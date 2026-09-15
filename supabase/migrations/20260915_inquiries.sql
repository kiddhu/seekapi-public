-- Apply in an isolated, operator-approved Supabase project. No customer data here.
create table public.inquiry_staff(user_id uuid primary key references auth.users(id),active boolean not null default true);
create table public.inquiry_rate_limits(key text primary key,window_start timestamptz not null,hits integer not null);
create table public.inquiry_drafts(id uuid primary key,token_hash text not null,payload_hash text not null,payload jsonb not null,files jsonb not null,created_at timestamptz not null default now(),expires_at timestamptz not null default now()+interval '24 hours');
create table public.inquiries(id uuid primary key,reference text not null unique default ('SQ-'||upper(substr(replace(gen_random_uuid()::text,'-',''),1,16))),payload jsonb not null,status text not null default 'new' check(status in ('new','reviewing','needs_information','quoted','in_progress','closed','spam')),owner text not null default '',created_at timestamptz not null default now(),updated_at timestamptz not null default now(),consent_version text not null default '2026-09-inquiry-v1');
create table public.inquiry_attachments(id uuid primary key default gen_random_uuid(),inquiry_id uuid not null references public.inquiries(id) on delete cascade,name text not null,object_path text not null unique,clean_path text,expected_size bigint not null,extension text not null,scan_status text not null default 'pending' check(scan_status in ('pending','clean','rejected')),sha256 text,scan_at timestamptz);
create table public.inquiry_events(id bigint generated always as identity primary key,inquiry_id uuid not null references public.inquiries(id) on delete cascade,actor uuid,note text not null,created_at timestamptz not null default now());
create table public.inquiry_outbox(id uuid primary key default gen_random_uuid(),inquiry_id uuid not null references public.inquiries(id) on delete cascade,kind text not null check(kind in ('staff','receipt')),state text not null default 'pending',attempts integer not null default 0,first_attempt_at timestamptz,lease_until timestamptz,next_attempt_at timestamptz not null default now(),provider_id text,message_payload jsonb,unique(inquiry_id,kind));
-- No direct client table access. Every HTTP operation authenticates server-side.
do $$ declare t text; begin foreach t in array array['inquiry_staff','inquiry_rate_limits','inquiry_drafts','inquiries','inquiry_attachments','inquiry_events','inquiry_outbox'] loop
 execute format('alter table public.%I enable row level security',t);
 execute format('revoke all on public.%I from anon, authenticated',t);
 execute format('grant all on public.%I to service_role',t);
end loop; end $$;
grant usage,select on sequence public.inquiry_events_id_seq to service_role;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values
 ('inquiry-quarantine','inquiry-quarantine',false,20971520,array['application/octet-stream']),
 ('inquiry-clean','inquiry-clean',false,20971520,array['application/octet-stream']);
-- Neither bucket receives anon/authenticated object policies. Only server credentials
-- and object-scoped signed upload permissions can write. Never enable upsert for drafts.

create function public.inquiry_rate(p_key text,p_limit integer) returns boolean language plpgsql security definer set search_path=public as $$
declare n integer; begin
 insert into inquiry_rate_limits values(p_key,now(),1) on conflict(key) do update set
 hits=case when inquiry_rate_limits.window_start<now()-interval '1 hour' then 1 else inquiry_rate_limits.hits+1 end,
 window_start=case when inquiry_rate_limits.window_start<now()-interval '1 hour' then now() else inquiry_rate_limits.window_start end returning hits into n;
 return n<=p_limit; end $$;

create function public.inquiry_create_draft(p_id uuid,p_token_hash text,p_payload_hash text,p_payload jsonb,p_files jsonb) returns boolean language plpgsql security definer set search_path=public as $$
declare d inquiry_drafts; begin
 insert into inquiry_drafts(id,token_hash,payload_hash,payload,files) values(p_id,p_token_hash,p_payload_hash,p_payload,p_files) on conflict(id) do nothing;
 select * into d from inquiry_drafts where id=p_id;
 return d.token_hash=p_token_hash and d.payload_hash=p_payload_hash and d.expires_at>now(); end $$;

create function public.inquiry_finalize(p_id uuid,p_token_hash text) returns jsonb language plpgsql security definer set search_path=public,storage as $$
declare d public.inquiry_drafts; i public.inquiries; f jsonb; n bigint; begin
 select * into d from public.inquiry_drafts where id=p_id and token_hash=p_token_hash for update;
 if not found or d.expires_at<now() then raise exception 'invalid session';end if;
 select * into i from public.inquiries where id=p_id;
 if found then return jsonb_build_object('reference',i.reference,'created_at',i.created_at);end if;
 for f in select * from jsonb_array_elements(d.files) loop
   select (metadata->>'size')::bigint into n from storage.objects where bucket_id='inquiry-quarantine' and name=f->>'path';
   if n is null or n<>(f->>'size')::bigint then raise exception 'attachment not ready';end if;
 end loop;
 insert into public.inquiries(id,payload) values(p_id,d.payload) returning * into i;
 for f in select * from jsonb_array_elements(d.files) loop
 insert into public.inquiry_attachments(inquiry_id,name,object_path,expected_size,extension) values(p_id,f->>'name',f->>'path',(f->>'size')::bigint,f->>'extension');end loop;
 insert into public.inquiry_events(inquiry_id,note) values(p_id,'Inquiry received; internal scope review only.');
 insert into public.inquiry_outbox(inquiry_id,kind) values(p_id,'staff'),(p_id,'receipt');
 return jsonb_build_object('reference',i.reference,'created_at',i.created_at);end $$;

create function public.inquiry_update(p_id uuid,p_actor uuid,p_status text,p_owner text,p_note text) returns void language plpgsql security definer set search_path=public as $$
begin
 if not exists(select 1 from inquiry_staff where user_id=p_actor and active) then raise exception 'not staff';end if;
 update inquiries set status=p_status,owner=p_owner,updated_at=now() where id=p_id;
 if not found then raise exception 'not found';end if;
 insert into inquiry_events(inquiry_id,actor,note) values(p_id,p_actor,'Status: '||p_status||'; Owner: '||p_owner||E'\n'||p_note);
end $$;

create function public.inquiry_claim_mail() returns setof public.inquiry_outbox language plpgsql security definer set search_path=public as $$
begin
 -- Resend deduplicates for 24h. Never automatically retry beyond 23h after the
 -- first attempt: a crash after send must not create duplicate acknowledgement.
 update inquiry_outbox set state='needs_review' where state in ('pending','sending') and (attempts>=8 or first_attempt_at<now()-interval '23 hours');
 return query with candidate as (select id from inquiry_outbox where state in ('pending','sending') and next_attempt_at<=now() and (lease_until is null or lease_until<now()) order by next_attempt_at for update skip locked limit 1)
 update inquiry_outbox o set state='sending',attempts=attempts+1,first_attempt_at=coalesce(first_attempt_at,now()),lease_until=now()+interval '2 minutes' from candidate c where o.id=c.id returning o.*;
end $$;

-- Remove implicit PUBLIC execute privilege, including anonymous RPC access.
revoke all on function public.inquiry_rate(text,integer),public.inquiry_create_draft(uuid,text,text,jsonb,jsonb),public.inquiry_finalize(uuid,text),public.inquiry_update(uuid,uuid,text,text,text),public.inquiry_claim_mail() from public,anon,authenticated;
grant execute on function public.inquiry_rate(text,integer),public.inquiry_create_draft(uuid,text,text,jsonb,jsonb),public.inquiry_finalize(uuid,text),public.inquiry_update(uuid,uuid,text,text,text),public.inquiry_claim_mail() to service_role;

alter table public.inquiries add column deletion_requested_at timestamptz;
create table public.inquiry_worker_health(id boolean primary key default true check(id),last_ok timestamptz not null);
alter table public.inquiry_worker_health enable row level security;
revoke all on public.inquiry_worker_health from anon,authenticated;
grant all on public.inquiry_worker_health to service_role;
create function public.inquiry_search(p_query text,p_status text,p_country text,p_language text,p_service text,p_page integer,p_from date,p_to date) returns setof public.inquiries language sql security definer set search_path=public as $$
 select * from inquiries where deletion_requested_at is null
 and (p_query='' or reference ilike '%'||p_query||'%' or payload->>'name' ilike '%'||p_query||'%' or payload->>'email' ilike '%'||p_query||'%' or payload->'details'->>'company' ilike '%'||p_query||'%')
 and (p_status='' or status=p_status) and (p_country='' or payload->>'country' ilike '%'||p_country||'%')
 and (p_language='' or payload->>'locale'=p_language) and (p_service='' or (payload->'services')::text ilike '%'||p_service||'%')
 and (p_from is null or created_at>=p_from) and (p_to is null or created_at<p_to+interval '1 day')
 order by created_at desc limit 30 offset greatest(0,p_page)*30;
$$;
create function public.inquiry_request_deletion(p_id uuid,p_actor uuid) returns void language plpgsql security definer set search_path=public as $$
begin
 if not exists(select 1 from inquiry_staff where user_id=p_actor and active) then raise exception 'not staff';end if;
 update inquiries set deletion_requested_at=now() where id=p_id;
 update inquiry_outbox set state='cancelled' where inquiry_id=p_id and state<>'provider_accepted';
 insert into inquiry_events(inquiry_id,actor,note) values(p_id,p_actor,'Deletion requested. A notification already in flight may still complete.');
end $$;
revoke all on function public.inquiry_search(text,text,text,text,text,integer,date,date),public.inquiry_request_deletion(uuid,uuid) from public,anon,authenticated;
grant execute on function public.inquiry_search(text,text,text,text,text,integer,date,date),public.inquiry_request_deletion(uuid,uuid) to service_role;
-- Clean storage serves only allowlisted MIME types after malware/signature checks.
update storage.buckets set allowed_mime_types=array['image/jpeg','image/png','image/webp','application/pdf','text/plain','text/csv','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/vnd.openxmlformats-officedocument.presentationml.presentation'] where id='inquiry-clean';
