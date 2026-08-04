# PowerPulse — Thermal Engineering Website

Dark industrial-tech marketing site for PowerPulse (Boiler Techniques Engineering), Nairobi. Static HTML/CSS/JS frontend + a single Vercel serverless function for the contact form. No database, no server process to manage.

## Stack

- **Frontend:** plain HTML/CSS/JS — no build step. Bootstrap 5, AOS, and all photos are vendored into the repo (`/vendor`, `/images`) and served same-origin; icons are inlined SVG. Zero third-party script/style/image origins besides Google Fonts.
- **Contact form:** `POST /api/contact`, a Vercel serverless function (`api/contact.js`) that sends mail via [Resend](https://resend.com).
- **Content survey:** `POST /api/survey` + a hidden page (`onboarding-2026.html`, not linked anywhere) for collecting real business details from the client — see "Content survey" below.
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
| `SURVEY_RECIPIENT` | Optional. Where content-survey submissions go. Falls back to `CONTACT_RECIPIENT` if unset — useful once `CONTACT_RECIPIENT` switches to the client's own inbox, since survey answers should keep going to whoever is building the site. |

**Getting Resend working:**
1. Sign up at resend.com (free tier: 3,000 emails/month, 100/day).
2. Create an API key → set it as `RESEND_API_KEY` in Vercel project settings (Production + Preview).
3. Sandbox mode (no domain verified) can only deliver to the email address on your Resend account — fine for testing, not for the live site.
4. For production, verify your own sending domain in Resend (Domains → Add Domain, add the DNS records they give you), then set `CONTACT_FROM` to an address on that domain, e.g. `PowerPulse <noreply@boilertechniques.co.ke>`.

## Contact form behavior

- The visible form (`contactus.html`) and the footer "Quick Inquiry" form (every page) both POST as JSON to `/api/contact` via `js/contact.js`, with an inline success/error message — no page reload.
- If JS fails to load, the forms still `action="/api/contact" method="post"` as a fallback (the function accepts both).
- **Fastest path for a visitor who wants a reply now:** the WhatsApp floating button (bottom-right, every page) opens a chat at `wa.me/254721170470` — always works, no backend involved.

## Content survey

`onboarding-2026.html` is a private form for collecting real business details (contact info, WhatsApp number, about text, services, stats, testimonials) directly from the client, so the site can be rebuilt from their actual answers instead of assumed content. It's deliberately **not** linked from any nav/footer, is excluded from `robots.txt` and the service worker cache, and is marked `noindex, nofollow` (both via `<meta>` and an `X-Robots-Tag` header in `vercel.json`) — the only way to reach it is the direct URL: `https://frontendpowerpulse.vercel.app/onboarding-2026`.

Submissions POST to `/api/survey` (same validation/honeypot/rate-limit/origin-check pattern as the contact form, sharing the helpers in `api/_lib/security.js`) and arrive as a formatted email at `SURVEY_RECIPIENT` (or `CONTACT_RECIPIENT` if that's unset).

## Security measures in place

- **Content-Security-Policy** + `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS — set globally in `vercel.json`.
- **Subresource Integrity (SRI)** on the Bootstrap CDN `<link>`/`<script>` tags.
- **API hardening** (`api/contact.js`, `api/survey.js`, shared helpers in `api/_lib/security.js`):
  - Server-side validation of every field (length caps, email format, required fields).
  - Honeypot field (`website`) — bots that fill it get a fake success response instead of a real error, so they don't learn to adapt.
  - Origin/Referer check — rejects POSTs that don't originate from `SITE_URL` or the request's own host.
  - Best-effort in-memory rate limiting (5 requests / 10 minutes per IP per warm function instance) — a deterrent, not a hard guarantee, since serverless instances are ephemeral. For stronger protection at scale, add a durable rate limiter (Vercel Edge Config / Upstash Redis) or a CAPTCHA (Cloudflare Turnstile).
  - HTML-escaping of all user input before it's embedded in the outgoing email, and newline-stripping on fields to prevent header injection.
  - No secrets in the repo — `.env` is gitignored; real keys live in Vercel project env vars.
- **Zero third-party CDNs** — Bootstrap, AOS, and all photos are vendored/self-hosted (`/vendor`, `/images`); icons are inline SVG. Only Google Fonts remains external. This also sidesteps ad-blockers/privacy extensions silently breaking the page by blocking third-party script/style/image domains.
- **No database, no auth, no cookies** — nothing to breach beyond the mail-sending function itself.

## Project structure

```text
index.html, aboutus.html, ourservices.html, contactus.html, offline.html   — public pages
onboarding-2026.html          — hidden client content-survey page (not linked anywhere)
css/style.css                 — full design system (dark theme, zero border-radius)
js/main.js                    — AOS init, back-to-top, service worker registration (all pages)
js/home.js                    — homepage stat counters
js/contact.js                 — AJAX submit + inline success/error for both contact forms
vendor/bootstrap, vendor/aos  — self-hosted third-party CSS/JS
images/                       — self-hosted photos
manifest.webmanifest, service-worker.js, icons/  — PWA
api/contact.js                — serverless contact-form handler (Resend)
api/survey.js                 — serverless content-survey handler (Resend)
api/_lib/security.js          — shared validation/honeypot/rate-limit/origin-check helpers
vercel.json                   — clean URLs (/aboutus, /ourservices, /contactus, no .html) + security headers
```

## Deployment

Push to GitHub, then import the repo in Vercel (or run `vercel --prod` from the repo root). Set the environment variables above in the Vercel dashboard under Project → Settings → Environment Variables, then redeploy.
