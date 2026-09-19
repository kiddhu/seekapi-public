-- Run only against the approved isolated Supabase test project after migration.
-- Rolls back all synthetic records; does not send email or upload real files.
begin;
do $$
declare i uuid:=gen_random_uuid();h text:=repeat('a',64);r jsonb;s jsonb;n integer;begin
 if has_table_privilege('anon','public.inquiries','SELECT') or has_table_privilege('authenticated','public.inquiry_attachments','SELECT') then raise exception 'client read permission leak';end if;
 if has_function_privilege('anon','public.inquiry_finalize(uuid,text)','EXECUTE') then raise exception 'anonymous RPC permission leak';end if;
 if not public.inquiry_create_draft(i,h,h,'{"name":"Synthetic acceptance record","email":"test@example.test","locale":"en"}'::jsonb,'[]'::jsonb) then raise exception 'draft creation';end if;
 if public.inquiry_create_draft(i,repeat('b',64),h,'{}','[]') then raise exception 'token substitution';end if;
 if public.inquiry_create_draft(i,h,repeat('b',64),'{}','[]') then raise exception 'payload mutation';end if;
 r:=public.inquiry_finalize(i,h);s:=public.inquiry_finalize(i,h);
 if r<>s then raise exception 'finalize not idempotent';end if;
 select count(*) into n from public.inquiry_outbox where inquiry_id=i;
 if n<>2 then raise exception 'duplicate/missing notification jobs';end if;
 begin perform public.inquiry_finalize(i,repeat('b',64));raise exception 'expected rejection';exception when others then if sqlerrm='expected rejection' then raise;end if;end;
 i:=gen_random_uuid();perform public.inquiry_create_draft(i,h,h,'{}','[{"name":"missing.pdf","path":"missing/file.pdf","size":3,"extension":"pdf"}]');
 begin perform public.inquiry_finalize(i,h);raise exception 'missing file accepted';exception when others then if sqlerrm='missing file accepted' then raise;end if;end;
 if exists(select 1 from public.inquiries where id=i) then raise exception 'false success record';end if;
end $$;
rollback;
