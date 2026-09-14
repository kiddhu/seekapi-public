# SeekAPI Website V0.1

A full rebuild of the public SeekAPI website around three first-class surfaces:

- For Companies — China Supply Chain Desk
- For Agents — Human Execution Layer
- APIs — machine capability surface

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Production boundary

This branch is preview-only until accepted. It does not enable payment, sensitive file upload, customer data handling, or live Agent task APIs.

## Preview validation

```bash
npm ci
npm run build
```

Preview deployments stay non-indexable. Public indexing requires both
`VERCEL_ENV=production` and `NEXT_PUBLIC_PUBLIC_INDEXING=1`, after public
content acceptance and domain cutover approval.

Before public informational launch:

- verify the legal entity, responsible contact and public contact route;
- connect a real non-sensitive intake destination and publish its data handling;
- confirm Search Console and Bing Webmaster ownership;
- submit the approved sitemap and IndexNow notifications after publication;
- verify Googlebot, Bingbot and OAI-SearchBot access through the production WAF;
- record Core Web Vitals and form delivery evidence.
