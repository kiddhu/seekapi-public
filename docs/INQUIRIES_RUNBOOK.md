# Inquiry V1 — deployment and acceptance

Control: aion-governance #957, inquiry repair packet comment 5686983279.
Implementation repository remains seekapi-public. This is customer product data,
not a factory task queue. No payment, supplier authorization, or live Agent task
API is added. Both feature flags default off; the existing mailto form remains
until enabled in a reviewed deployment. A build or PR is not live acceptance.

## Required setup (operator secrets only)

1. Select an isolated Supabase test project; inventory existing project usage
   before reusing anything. Run `supabase/migrations/20260915_inquiries.sql` once.
   Do not modify a bucket or table with unrelated customer data. The migration
   intentionally fails on existing names rather than changing unknown policies.
2. Disable public Auth signup. Create/invite the intended staff user and have the
   user set their own password securely; insert the verified Auth UUID into
   `inquiry_staff`. Supabase dashboard administrators are separate from staff.
   Server code requires confirmed email plus explicit staff membership on every
   operation; no client has direct database or bucket access.
3. Configure Resend with a verified sender authorized for SeekAPI. Receiving mail
   at support does not configure programmatic sending. If a sender subdomain
   requires DNS, get approval for the exact records first; do not change support
   mailbox MX. Keep `INQUIRY_MAIL_FROM` stable across retries. Never put real keys
   in GitHub, chat, screenshots, a browser bundle or a shared log.
4. Set `.env.example` names in Vercel with isolated Preview/Production bindings.
   `INQUIRY_ALLOWED_ORIGINS` is an exact comma-separated list, no wildcards.
   `INQUIRY_SITE_URL` is the public canonical origin, without trailing slash.
   `INQUIRY_STORAGE_REGION_LABEL` must describe the chosen, verified region.
   Rate limiting relies on Vercel's overwritten `x-vercel-forwarded-for`; another
   host requires a verified trusted ingress header before use. No proxy bypass.
5. On an existing approved compute host, install official Python 3 and ClamAV,
   maintain current virus definitions, and run `scripts/inquiry_worker.py` every
   5 minutes with a single-instance lock. This script does not install a daemon
   or modify any factory runtime. Host activation is still pending operator
   access/approval of the exact service binding. It processes at most 10 scans,
   50 expired drafts, 30 deletion records and two notification jobs per pass.
   Monitor its exit status and backlog; increase capacity only from real volume.
   Vercel does not run the Python/ClamAV process. Do not assume it does.
6. Do not enable intake unless the worker runs successfully. A stale (>10min)
   heartbeat blocks new draft creation; existing form contents remain visible.
   Files stay quarantined when the scanner fails. No production test-mode bypass.

## Data and mail behavior

- Anonymous draft capabilities allow only upload/finalize, never read/list access.
  SQL finalization locks the draft, verifies object size/ownership through its
  immutable manifest, then commits the inquiry, attachments, event and two mail
  jobs in one transaction. Repeating the same finalize returns the same receipt.
- Supabase upload URLs expire after 2 hours, do not allow upsert, and target a
  private quarantine bucket. The worker validates signatures/container contents,
  runs ClamAV, then uploads the exact scanned bytes to a separate immutable clean
  key. Staff can request a 60-second read URL only after authentication. No file
  is public. Download URLs are bearer capabilities for their short lifetime;
  do not copy them into emails. Downloads >4.5MB bypass Vercel response limits.
- The normal request path attempts both emails after persistence. The worker
  retries durable jobs with a lease, bounded backoff and provider idempotency.
  Retry payload is stored unchanged before sending. After 8 tries or 23 hours
  since first attempt, job becomes `needs_review`, avoiding blind resend after
  Resend's 24-hour deduplication expires. Check provider state before manual
  reconciliation. `provider_accepted` does not assert inbox delivery. Two jobs
  per pass means a high-volume backlog requires a bounded batch adjustment.
- Customer receipts contain reference/count/boundary, not untrusted request URLs
  or attachments. Staff notifications have a summary and authenticated link.
  Replies remain in support mailbox; the UI does not claim email thread sync.
- Staff deletion requests cancel future jobs and are processed after 24 hours
  so outstanding upload tokens cannot recreate deleted objects. Already in-flight
  mail may still complete. Closed/spam records expire after 365 days. Backups and
  provider logs require separate retention verification; do not promise instant
  removal from every provider. Do not retain contracts in this intake store.

## Required checks

Run `npm ci`, `npm test`, `NEXT_PUBLIC_INQUIRIES_ENABLED=1 npm run build`.
Tests cover validation, contact injection, consent, agent/Russian boundaries,
file quotas, filename/MIME/container rejection and scanner failure behavior.
The unit tests stub scanner exit statuses; they do not prove actual scanning.
Run `tests/inquiry-database.sql` in the isolated test DB and record its result.

Before merge/enable, run real isolated Preview acceptance:

- Desktop/mobile, all seven languages, Arabic RTL, keyboard and error retention.
- Real text + image + PDF + office file upload, persisted records after re-login,
  clean preview/download and denial before scan; real EICAR rejection and scanner
  outage. Synthetic files only, never real customer confidential data for testing.
- Anonymous and unapproved staff denied every list/detail/update/export/download;
  wrong token, object substitution and expired link denied; no secret in bundle.
- Lost finalize response/retry returns one reference, one record, two logical mail
  jobs. Database outage never displays success; mail outage preserves the record.
- Both notification and receipt arrive in designated user-controlled test inboxes;
  customer reply reaches support, staff reply reaches the test customer. Confirm
  outgoing mail test recipients before sending; do not mail arbitrary examples.
- Exact PR head build + risk-focused review, then controlled deployment and
  outside-in production readback. Preserve rollback to prior deployment/flags.
- Only after live verification update machine manifest from user-reviewed_email
  to web inquiry/manual review, plus any remaining old intake copy in Trust/APIs.
  Never mark planned Agent task APIs/MCP as live.

## Current gate

This implementation contains real adapters and SQL, not simulated success. Live
database migration, staff auth, storage, antivirus host, email delivery and full
browser acceptance must be recorded separately after credentials are connected.
Do not enable/merge while these checks are pending.
