# Inquiry V1 — text-only deployment and acceptance

Control: aion-governance #957. Current Monarch scope amendment makes the web
intake text-only. Supporting documents are exchanged later through the support
email thread; the website must not accept file uploads.

## Product boundary

- Web form accepts structured inquiry text and contact details only.
- Browser file picker / drag-drop / upload progress: absent.
- Direct API requests with a non-empty `files` payload: rejected.
- The draft API never issues signed Storage upload URLs.
- New V0.1 drafts are always created with `p_files=[]`.
- Existing Preview-only attachment rows/buckets are historical test artifacts,
  not shipped product behavior. Do not destructively drop them merely to tidy a
  Preview environment; allow ordinary retention/cleanup to remove them.
- If documents are needed, staff asks the customer to send them in the
  subsequent support email thread, after any NDA/confidentiality step required.

## Required setup

1. Use the isolated Supabase project and applied inquiry schema. Public Auth
   signup stays disabled. Staff must have a confirmed Auth user and an explicit
   active `inquiry_staff` row.
2. Keep server-side Supabase credentials only in approved secret stores.
3. Configure Resend with the verified SeekAPI sender. Mail retries use the
   durable outbox and provider idempotency key.
4. Configure Preview/Production Vercel variables with exact allowed origins.
   Keep Preview protection enabled. Automation uses the project-scoped Vercel
   Protection Bypass secret only from the bounded worker host.
5. Run the bounded maintenance worker every 5 minutes. For text-only V0.1 its
   active duties are heartbeat, expired-draft/rate-limit/retention cleanup and
   durable mail retry. ClamAV is not a new-customer intake dependency. It is
   invoked only if a legacy Preview attachment is still pending from before the
   text-only amendment.
6. New draft creation fails closed when the worker heartbeat is older than
   10 minutes. This protects durable retry/maintenance semantics without
   creating a second control plane.

## Data and mail behavior

- Draft/finalize remain idempotent. Finalization commits one inquiry, one initial
  event and two logical mail jobs (staff notification + customer receipt).
- Repeating the same finalize returns the same reference and must not create a
  duplicate inquiry or duplicate logical mail jobs.
- Normal request handling attempts mail after persistence. The worker retries
  pending jobs with bounded backoff and the same stored provider payload.
- `provider_accepted` means Resend accepted the request; it is not a promise of
  inbox delivery. Human replies remain in the support mailbox.
- Closed/spam records expire after 365 days. Deletion requests retain a 24-hour
  safety delay before final cleanup.
- Existing historical Preview attachment objects may remain until their applied
  24-hour draft expiry / retention path. They do not authorize web uploads.

## Required checks before merge

Run:
- `npm ci`
- `npm test`
- `NEXT_PUBLIC_INQUIRIES_ENABLED=1 npm run build`
- `python3 tests/http-closed.py`

Preview acceptance must prove:
- all seven languages, Arabic RTL, keyboard use and error retention;
- one synthetic text inquiry persists and returns one reference;
- receipt and staff notification are durable and provider accepted;
- fresh staff login can list/open the inquiry;
- direct non-empty attachment payload is rejected and no signed upload URL is
  issued;
- anonymous/unapproved staff cannot list/detail/update/export;
- lost finalize response/retry stays idempotent;
- database outage never displays false success;
- mail outage preserves the inquiry and leaves durable retry state;
- exact-head CI + independent security review pass.

Removed from V0.1 acceptance:
- browser image/PDF/Office upload;
- quarantine/clean promotion;
- EICAR upload;
- pre-scan download denial;
- attachment download/preview.

Production remains off until the simplified exact head is reviewed, merged
through the controlled path, deployed and verified outside-in with a fresh
text-only inquiry.
