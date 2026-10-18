# PowerPulse — project context for Claude Code

Read this first in any new or compacted session. It's the orientation layer;
`PLANNING.md` in this same repo has the full phased roadmap and status detail,
and should be read next for anything beyond what's summarized here.

## What this is

**PowerPulse Dynamics Ltd** — a real, currently-operating thermal engineering
business in Nairobi, Kenya (boilers, burners, steam systems, combustion). This
is real client work for a real business, not a demo project. The owner is
Ian (iankariuki418@gmail.com). Treat business facts conservatively — don't
invent or assume details the client hasn't confirmed.

**This project spans two separate git repos plus a shared Supabase backend:**

1. **`powerpulse-website`** (this repo) — `C:\Users\Mustafa\DevOps\projects\powerpulse-website`,
   GitHub `Karees1/powerpulse-website`, live at `frontendpowerpulse.vercel.app`
   (Vercel project `frontend_powerpulse`). The public marketing site: static
   HTML/CSS/JS, zero build step, zero third-party CDNs. Has one hidden page
   (`onboarding-2026.html`, a content-intake survey) and a disguised entry
   point (the footer copyright text) into Director Hub's admin area.

2. **`director-hub`** — `C:\Users\Mustafa\DevOps\projects\director-hub`,
   GitHub `Karees1/director-hub`, live at `director-hub-eight.vercel.app`
   (Vercel project `director-hub`). A Next.js 16 + Supabase app with **two
   distinct parts that are easy to confuse**: a public marketing shell at `/`
   (deliberately generic-looking camouflage, by original design — NOT the
   dashboard) and the real Director-only admin dashboard behind `/portal`
   (gated by Supabase Auth login). See `director-hub/CLAUDE.md` for its own
   project rules.

3. **Shared Supabase backend** — project `BOILER_SYSTEM`, ref
   `atwrjbhpbiwklyxnhskk`. Director Hub's tables (`clients`, `invoices`,
   `invoice_items`, `quotations`, `quotation_line_items`, `lpos`,
   `lpo_items`, `company_documents`, `company_settings`) live here alongside
   a separate sibling app's own tables, **Ops Hub** (`profiles`, `departments`,
   the `private.is_director()` RLS function Director Hub's auth depends on).
   **Ops Hub is explicitly out of scope** — a standing owner decision. Don't
   modify its schema/auth; Director Hub just consumes it as-is. Ops Hub's own
   code lives outside `DevOps\projects`, at `H:\OneDrive\Desktop\PROJ.SRN\COMPUTER SCIENCE\ops-hub\web`
   (found once, never explored — not needed for this project's scope).

Both repos are also registered in a **user-level global** `C:\Users\Mustafa\.claude\launch.json`
(not a per-project file) for `preview_start` by name. **If either repo's
folder ever moves, that file's hardcoded paths go stale silently** — update
it in the same move.

## The three success criteria (the owner's own words)

**Realism, practicality, and SEO reach.** Not feature completeness, not
enterprise polish. This is a solo-developer effort (Ian + Claude), for a
small real business. Every recommendation should be sized accordingly —
flag over-engineering rather than building it.

## Real business facts (confirmed, don't re-derive or guess)

Sourced from real historical invoices/quotations at `H:\PowerPulsedocs`
(33 documents, read in full by three parallel agents on 2026-10-17 — see the
`reference-powerpulse-real-data` memory for the complete extraction):

- **Legal name:** PowerPulse Dynamics Ltd (confirmed independently from two
  sources: Director Hub's own README, and the real invoice letterhead)
- **Address:** Dar es Salaam Rd, Industrial Area, P.O. Box 27708-00506, MKI
  Hse, Nairobi, Kenya
- **Real phone numbers:** +254 710 187 781 and +254 725 134 483 (the numbers
  that used to be live on the site, +254721170470 / +254710877781, were
  wrong — borrowed from the business this site was cloned from)
- **Real email:** dynamicspowerpulse@gmail.com
- **Website:** powerpulse.ke
- **KRA PIN:** P052452759K
- **Real positioning:** "Instrumentation Control, Combustion, and
  Energy-Saving Consultants" / supply, installation, servicing of thermic
  fluid, steam and hot water boilers, flow measurement, instrumentation and
  control, incinerators, kilns, PET blowers, steam networks
- **Real tax rate:** 16% VAT (matches Director Hub's existing `TAX_RATE`
  constant — no change needed there)
- **Real staff names** appearing on real documents: Morris Kinoti, Lewis
  (invoice/quote preparers), Samuel Kariuki (site supervisor)
- **5 real clients**, now seeded in the live database: Glacier Products Ltd
  (dominant client, multiple sites — Tilisi, Kikuyu, Road A — are sites
  under this ONE client, not separate clients), Elite Plants International
  Limited, Zaytuna Agro Industries Limited, Lean Energy Solutions Ltd, Food
  Education Giga Kitchen.
- **Still unconfirmed, don't assume either way:** whether Unga/Pepsi/
  Coca-Cola (mentioned in one client's statement line items) are real
  sub-clients or just job-site labels; PowerPulse's own social media
  accounts (likely don't exist yet — the site's old social icons pointed at
  a different business's real accounts and were removed); the relationship
  (if any) between PowerPulse and "Energtronic Products Limited" (a logo
  file found in the same folder, context unknown).

## Director Hub login

The Director account is **iankariuki418@gmail.com** (confirmed via a direct
`auth.users` query — the same account already used for Ops Hub, predates
this project). Nobody — not this session, not any Claude session — has or
can retrieve the password; Supabase only stores it hashed. If it's ever
needed, use the password-reset flow (see "Password recovery was broken"
below for the state of that flow) rather than guessing or asking for it to
be typed into a prompt.

## This site's own content survey

`onboarding-2026.html` (hidden, unlinked, noindex) is the mechanism for
collecting further real facts directly from the client — 47 fields across 7
sections, rebuilt 2026-10-17. Its first question is urgent and specific: it
asks the owner to confirm, company by company, whether 8 real named
businesses that used to appear on the homepage (3 fabricated-looking
testimonials + a 5-more-name "trusted by" logo strip) were ever genuine —
that content was removed pending the answer, not because it was confirmed
false. If real answers come back for any of those 8, that's when the
removed sections get rebuilt with real content, not fabricated ones.

## Phased roadmap — status as of 2026-10-17

Full detail, acceptance criteria, and reasoning for every phase lives in
`PLANNING.md`. Summary:

- **Phase 0 (context)** — done.
- **Phase 1 (brand separation + content survey v2)** — **shipped & live.**
  Removed every "Boiler Techniques" coupling (the business this site was
  cloned from), the 8 fabricated client-name claims, unverified
  operating-history claims; rebuilt the survey. Real phone/WhatsApp numbers
  now live site-wide (note: **each page has two separate WhatsApp links** —
  a floating chat button and a footer social icon — a bug where only one got
  updated already happened once; check both if this ever needs touching
  again).
- **Phase 2 (security/subdomain isolation)** — **Stage 1 shipped & live**
  (verified via real `fetch()` against the production origin, not assumed):
  retired the `vercel.json` reverse-proxy that used to front Director Hub;
  the hidden footer link now points directly at
  `https://director-hub-eight.vercel.app/portal`; Director Hub's own
  `next.config.ts` now carries the security headers it used to inherit from
  that proxy (CSP, HSTS, X-Frame-Options, etc. — confirmed live). **Stage 2**
  (a real branded subdomain instead of the `.vercel.app` URL) is **not
  started** — gated on the owner actually purchasing a domain.
- **Phase 3 (Director Hub polish/harden)** — **all shipped & live**: 3a
  (security hardening: optional Turnstile CAPTCHA on login, dormant until
  configured; document-upload MIME/size validation; PDF line-item sanity
  caps; Dependabot enabled), 3b (real client/invoice/quotation data seeded
  into the live database — 5 clients, 8 invoices, 7 quotations, all
  cross-checked against real KRA eTIMS fiscal receipts where available;
  PLUS documents search/filter + the previously-disconnected delete button
  wired up + `updated_at` tracking), 3c (UI consistency — one shared
  `StatusBadge`/`formatMoney` instead of four duplicated versions, LPOs now
  get the due-date countdown they never had, `InvoiceBuilderForm` now uses
  the same shared line-items component the other builders already used).
  **Caveat: the authenticated `/portal` UI (documents search/delete, the
  updated list pages) has never been visually verified by anyone** — no test
  Director credentials are available to a Claude session, and the owner
  hasn't logged in and checked since these shipped. Confidence is
  code-level only (clean `tsc`/`eslint`/production build).
- **Phase 4 (SEO)** — **not started.** Next up. Known gaps from the original
  context pass: no `sitemap.xml`, no canonical tags, no OG/Twitter cards, no
  JSON-LD structured data, no analytics/Search Console, 6 unoptimized images
  (236KB–808KB, not WebP). See `PLANNING.md`'s Phase 4 section for the full,
  already-designed plan (Track A ships immediately, Track B1/B2 gated on
  brand facts that are now mostly confirmed).

## Password recovery — was broken, now fixed and confirmed end-to-end (2026-10-18)

Ian tried to reset the Director password and hit this in stages, found by
actually walking through the flow rather than assuming it worked:

1. **Supabase's Site URL was `localhost:3000`** (a dev leftover) — Ian
   fixed this himself in the dashboard (Authentication → URL Configuration)
   to point at `https://director-hub-eight.vercel.app`. Confirmed fixed:
   the reset email started landing on the real production domain.
2. **Reaching the real domain still didn't work** — the email's link landed
   on the plain homepage, not a password-change form. Reason: Supabase's
   Reset Password email template still used the default link, and
   **template editing is locked behind custom SMTP on this project's
   tier** ("Set up custom SMTP to edit templates") — not configured, and a
   separate, bigger task. So pointing the template at a custom route
   (`/auth/confirm`, added in `director-hub` PR #9) was never actually
   usable.
3. **Fix (`director-hub` PR #10, merged and live) works with Supabase's
   unmodified default link** instead of requiring template access:
   `src/components/RecoveryRedirect.tsx`, mounted in the root layout,
   detects the default link's `#access_token=...&type=recovery` hash
   fragment on any page load, calls `supabase.auth.setSession()` explicitly
   (an actual API call, which `@supabase/ssr` DOES persist via cookies —
   passive hash auto-detection is what doesn't work with this client), then
   sends the visitor on to `/reset-password` with a real session already
   established. **No dashboard or email-template change needed at all.**
4. **Follow-up fix (`director-hub` PR #11, merged):** PR #10's `setSession()`
   call never checked whether it actually succeeded — a stale link (already
   clicked once, or past Supabase's recovery-token lifetime) still
   redirected to `/reset-password` with no real session, reproducing the
   exact "Auth session missing!" symptom even though the underlying fix
   was live. Now a failed `setSession()` bounces to
   `/portal/login?error=expired-reset-link` with a clear message instead of
   failing silently; the login page was also wired up to actually render
   that param (it had no code reading it at all before this).
5. **Confirmed end-to-end on 2026-10-18: Ian logged in successfully using a
   fresh password-reset email.** This saga is closed — no outstanding
   dashboard or code work on this flow.
6. The earlier `/auth/confirm` route (PR #9) is still in the codebase and
   harmless to leave — it's just unreachable without custom SMTP + a
   template change neither of which are planned. Don't remove it without
   asking; it'd be the right piece to wire up if custom SMTP ever does get
   configured for some other reason.
7. **There is no self-service "forgot password" link anywhere in
   director-hub's own UI** — found 2026-10-18 while investigating a
   separate PDF issue. Every reset email tested so far (including the one
   that finally worked) was triggered manually from the Supabase dashboard.
   Worth asking Ian whether that's intentional (single-Director app, fine
   as-is) or a real gap before building anything further on top of it.

## Hard-won lessons from this session (read before repeating the mistakes)

- **Don't trust `list_tables`' row counts.** They're cached/stale Postgres
  statistics. A `COUNT(*)` showed the database already had real/test data
  (duplicate client records, a real invoice, an uploaded PDF) when
  `list_tables` had shown 0 rows everywhere. Always verify with a direct
  query before writing to a shared database.
- **Director Hub has a public `/` and a hidden `/portal` — don't conflate
  them.** Visiting the root domain shows generic marketing content by
  design; it is not evidence the admin dashboard is broken.
- **This session's git/deploy actions were gated by Claude Code's own
  permission classifier**, which blocked things like `git status` in a
  "wrong" directory and PR merges with reasons like "Out-of-Place
  Publication" and "Production Deploy" — even after prior similar actions
  had been approved. Each category needed its own fresh, explicit
  authorization from Ian; past approval for one action type didn't carry
  over to another. Don't assume a blocked action will work on retry without
  the user saying so explicitly.
- **Pushing to a feature branch does not deploy to production** on this
  Vercel setup — only `master` does (confirmed via each project's domain
  list, which ties the real custom domain to the `master` branch
  specifically). This was used deliberately to let Phase 1 sit
  reviewable-but-undeployed while other phases shipped.
- **Vercel preview-deployment URLs are gated by SSO** (`all_except_custom_domains`
  protection) — only the production custom domain is publicly fetchable.
  Verification of preview builds has to go through the Vercel API
  (`get_deployment`, build status), not a plain browser fetch.
- **Always check the *actual deployed* page, not just "the build succeeded."**
  Three times this session, something that type-checked and built cleanly
  still had a real bug once checked against the live site or an actual user
  flow (a second WhatsApp link that didn't get the number update; the
  Zaytuna duplicate-client mess; password recovery looking fine in code but
  failing end-to-end because of a dashboard-only Auth setting). Reading the
  live DOM/response, and actually walking the flow a real user would,
  caught all three.
- **`@supabase/ssr`'s cookie-based session model does not *passively
  auto-detect* the `#access_token=...` hash fragment Supabase's default
  auth emails use** the way the vanilla `supabase-js` client does — but an
  *explicit* `supabase.auth.setSession({access_token, refresh_token})` call
  still works fine and does persist via cookies. The "right" documented
  fix (a server Route Handler calling `verifyOtp({token_hash, type})`, see
  `src/app/auth/confirm/route.ts`) needs Supabase's email template pointed
  at a custom URL shape — which needs custom SMTP configured first (see
  next lesson). The pragmatic fix that needed neither: detect the hash
  client-side and call `setSession()` explicitly (`RecoveryRedirect.tsx`,
  mounted in the root layout). Don't assume the "documented best practice"
  fix is actually usable before checking what the project's actual tier
  allows.
- **Supabase locks email template editing behind custom SMTP.** On this
  project's tier, Authentication → Emails only shows a read-only preview of
  the default template ("Set up custom SMTP to edit templates") — there's
  no way to change the action link's URL shape without first configuring a
  real SMTP provider in Auth settings, a separate, bigger task nobody has
  done. Any fix that assumes "just change the email template" needs this
  checked first, not assumed.

## Open items

- **Password recovery is fully resolved** (PRs #10 and #11, confirmed live
  2026-10-18 with a real reset email) — no longer an open item, see
  "Password recovery" above.
- **PDF generator logo was rendering at 40×40pt** (a postage stamp) on
  every invoice/quotation/LPO — fixed in `director-hub` PR #12 (bumped to
  100×100pt in `sharedDocumentStyles.ts`). Found 2026-10-18 by comparing a
  generated invoice against a real historical quotation Ian had on hand.
- **"Prepared by" renders as "—" on generated PDFs** — not a code bug, the
  template already pulls `director.full_name` correctly. The Director's
  `profiles` row (owned by the sibling Ops Hub app, not this repo) has
  `full_name: null`. Needs Ian to confirm what name to set before writing
  to that shared table — asked, not yet answered as of 2026-10-18.
- **No self-service "forgot password" link exists anywhere in
  director-hub's UI** — every tested reset email so far was sent manually
  from the Supabase dashboard. Found 2026-10-18; worth confirming with Ian
  whether that's acceptable for a single-Director app or worth building.
- The authenticated `/portal` UI (documents search/delete, the Phase 3c
  list pages) is now confirmed reachable (Ian logged in and used
  `/portal/invoices/new` successfully on 2026-10-18) but hasn't had a
  full walkthrough of every list page yet.
- 5 Dependabot PRs sitting open on `director-hub` (routine dependency
  bumps) — one (`react-dom` 19.2.8→19.3.0) failed its build. Not
  investigated; not part of this project's phase work unless asked.
- Phase 2 Stage 2 (branded subdomain) needs the owner to actually buy a
  domain — external dependency, no code action possible yet.
- Phase 4 (SEO) has not started — still the next planned phase per
  `PLANNING.md`.
- Several facts in the content survey are still genuinely open (see "Real
  business facts" above) — don't resolve them by guessing; wait for the
  owner's answers.
