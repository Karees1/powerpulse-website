# PowerPulse — Thermal Engineering Website

Dark industrial-tech marketing site for PowerPulse (Boiler Techniques Engineering), Nairobi. Static HTML/CSS/JS frontend + a single Vercel serverless function for the contact form. No database, no server process to manage.

## Stack

- **Frontend:** plain HTML/CSS/JS, Bootstrap 5 (CDN, SRI-pinned), AOS scroll animations, Ionicons — no build step.
- **Contact form:** `POST /api/contact`, a Vercel serverless function (`api/contact.js`) that sends mail via [Resend](https://resend.com).
- **PWA:** installable, offline fallback page, service worker with network-first navigation / stale-while-revalidate assets.
- **Hosting:** Vercel (static files served from the repo root; `/api` auto-deploys as serverless functions).

## Local development

```bash
npm install
npm run dev        # runs `vercel dev` — serves the static site + /api/contact locally
```

You'll need the [Vercel CLI](https://vercel.com/docs/cli) linked to a project (`vercel link`) for `vercel dev` to pick up environment variables. Without it, you can still open the HTML files directly or run any static file server — only the contact form needs the Vercel dev server (or a deployed environment) to actually send mail.

## Environment variables

Copy `.env.example` to `.env` and fill in:

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | API key from [resend.com](https://resend.com) — required for the contact form to send email. |
| `CONTACT_RECIPIENT` | Mailbox that receives enquiries. Defaults to `boilertechniques@gmail.com`. |
| `CONTACT_FROM` | Verified sender address. Until a domain is verified in Resend, use the Resend sandbox sender (`onboarding@resend.dev`) — see below. |
| `SITE_URL` | Your production URL. Used server-side to reject contact-form POSTs that don't originate from your own site. |

**Getting Resend working:**
1. Sign up at resend.com (free tier: 3,000 emails/month, 100/day).
2. Create an API key → set it as `RESEND_API_KEY` in Vercel project settings (Production + Preview).
3. Sandbox mode (no domain verified) can only deliver to the email address on your Resend account — fine for testing, not for the live site.
4. For production, verify your own sending domain in Resend (Domains → Add Domain, add the DNS records they give you), then set `CONTACT_FROM` to an address on that domain, e.g. `PowerPulse <noreply@boilertechniques.co.ke>`.

## Contact form behavior

- The visible form (`contactus.html`) and the footer "Quick Inquiry" form (every page) both POST as JSON to `/api/contact` via `js/contact.js`, with an inline success/error message — no page reload.
- If JS fails to load, the forms still `action="/api/contact" method="post"` as a fallback (the function accepts both).
- **Fastest path for a visitor who wants a reply now:** the WhatsApp floating button (bottom-right, every page) opens a chat at `wa.me/254721170470` — always works, no backend involved.

## Security measures in place

- **Content-Security-Policy** + `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS — set globally in `vercel.json`.
- **Subresource Integrity (SRI)** on the Bootstrap CDN `<link>`/`<script>` tags.
- **Contact API hardening** (`api/contact.js`):
  - Server-side validation of name/email/message (length caps, email format).
  - Honeypot field (`website`) — bots that fill it get a fake success response instead of a real error, so they don't learn to adapt.
  - Origin/Referer check — rejects POSTs that don't originate from `SITE_URL` or the request's own host.
  - Best-effort in-memory rate limiting (5 requests / 10 minutes per IP per warm function instance) — a deterrent, not a hard guarantee, since serverless instances are ephemeral. For stronger protection at scale, add a durable rate limiter (Vercel Edge Config / Upstash Redis) or a CAPTCHA (Cloudflare Turnstile).
  - HTML-escaping of all user input before it's embedded in the outgoing email, and newline-stripping on fields to prevent header injection.
  - No secrets in the repo — `.env` is gitignored; real keys live in Vercel project env vars.
- **No database, no auth, no cookies** — nothing to breach beyond the mail-sending function itself.

## Project structure

```
index.html, aboutus.html, ourservices.html, contactus.html, offline.html   — pages
css/style.css                — full design system (dark theme, zero border-radius)
js/main.js                   — AOS init, back-to-top, service worker registration (all pages)
js/home.js                   — homepage stat counters
js/contact.js                — AJAX submit + inline success/error for both contact forms
manifest.webmanifest, service-worker.js, icons/  — PWA
api/contact.js                — serverless contact-form handler (Resend)
vercel.json                   — clean URLs (/aboutus, /ourservices, /contactus, no .html) + security headers
```

## Deployment

Push to GitHub, then import the repo in Vercel (or run `vercel --prod` from the repo root). Set the environment variables above in the Vercel dashboard under Project → Settings → Environment Variables, then redeploy.
