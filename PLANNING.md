# PowerPulse Dynamics Ltd — Master Roadmap: Brand, Security & SEO Foundation

## Intro — success criteria and why this order

The owner has set three explicit success criteria for this project — **realism**, **practicality**, and **SEO reach** — plus one hard constraint stated directly: PowerPulse Dynamics Ltd is a separate business from Boiler Techniques (the business this site was cloned from for convenience), and the finished site must carry no relative comparison to, or inherited identity from, that other company. Not feature completeness, not enterprise polish. This is a solo-developer project — one person, assisted by an AI pair-programmer, with no team and no dedicated security/SRE staff — and every phase below is sized against that constraint rather than against what a larger org might build.

The four phases are ordered the way they are for one reason: **facts and foundations have to land before anything permanent gets built on top of them.** Brand truth (Phase 1) comes first because it is the one thing every other phase either reads from or risks baking in wrong — Director Hub's own README, the SEO phase's JSON-LD `legalName` and Open Graph image, and the footer of every public page all either already assume "PowerPulse Dynamics Ltd" is correct or need it confirmed before they can be finalized. Phase 1 is scoped more broadly than it first appears: it's not just the name, email, and social icons borrowed from Boiler Techniques — it also covers inherited *operating-history and manufacturer-relationship copy* ("two decades," "authorised dealer for Riello, Ecoflam, Elco") that reads as PowerPulse's own history but was never confirmed as such. That copy is arguably the deepest form of brand coupling on the site, and it's treated here as a required fix, not an optional one. Shipping SEO schema markup or a polished admin dashboard before brand facts are nailed down risks encoding someone else's identity into new, permanent surface area at the exact moment the project is trying to remove it from the old surface area.

Security/subdomain isolation (Phase 2) is genuinely independent infrastructure work — it touches hosting and DNS, not content or brand. Its core goal — a crash, bug, or attack confined to the admin app can't surface on the public site, and vice versa — is achievable **today, for free, with no domain purchase**, by retiring the shared-origin proxy and routing straight to Director Hub's own already-live `.vercel.app` origin. A purchased domain and a branded subdomain (`portal.powerpulse.co.ke`) is a URL/discoverability upgrade layered on top of that isolation, not a prerequisite for it. The domain purchase is still the single longest, least predictable lead time in this roadmap, so it should still start immediately and in parallel with Phase 1 — it just no longer blocks the isolation work itself, only the branding upgrade. Director Hub's own polish-and-harden work (Phase 3) is likewise independent of brand content and can run in parallel with both, but it should reach completion before any *new* Director Hub feature work ships, so new surface area is built on a hardened foundation. SEO technical work (Phase 4) is split into tracks for the same reason Phase 1 exists: the mechanical half (sitemap, robots.txt, canonical tags, image optimization, analytics) has zero brand dependency and ships immediately; the half that encodes brand facts (OG image, JSON-LD `legalName`/`sameAs`) is gated on Phase 1 — more precisely, gated on *different slices* of Phase 1 depending on which fact is needed, which is spelled out below rather than treated as one undifferentiated gate.

## Phase Map

| Phase | One-line goal | Depends on | External dependency (needs the owner/client to act outside the code) |
|---|---|---|---|
| **Phase 0 — Context** *(complete)* | Prior context-gathering pass over both repos: architecture, routes, confirmed decisions | — | None |
| **Phase 1 — Brand Separation & Content Survey v2** | Remove every currently-identified "Boiler Techniques" dependency — including inherited operating-history/dealer copy, not just name/contact/social — from the public site; rebuild the content survey to extract PowerPulse's own, hard-to-copy facts | Phase 0 | Owner confirms the legal entity name "PowerPulse Dynamics Ltd" directly; owner confirms actual years in operation and any real manufacturer-authorized-dealer relationships (closes A8); owner decides and creates a new dedicated PowerPulse contact email, then updates `CONTACT_RECIPIENT`/`SURVEY_RECIPIENT` live in the Vercel dashboard (Production + Preview); owner approves removing the 3 borrowed social-media icons before deploy; client creates PowerPulse's own social accounts; owner confirms or corrects the "across Kenya & East Africa" service-area claim; owner/client supplies certifications, equipment-brands-serviced, and case-study material, and signs off on the final Survey v2 field list before it's built |
| **Phase 2 — Security & Subdomain Isolation** | **Stage 1 (ships now, free):** retire the shared-origin proxy and route Director Hub traffic straight to its own existing `.vercel.app` origin, so a crash/bug/attack in one app can't surface on the other. **Stage 2 (gated on domain):** upgrade that to a branded subdomain. | Phase 0 (runs in parallel with Phase 1) | Stage 1: none — pure code/config, ships immediately. Stage 2: owner purchases a custom domain and completes DNS verification — unknown timeline, but blocks only the branding upgrade, not the isolation goal; owner signs off on the chosen subdomain label and cutover policy |
| **Phase 3 — Director Hub: Polish & Harden** | Harden and consolidate the existing clients/invoices/quotations/LPOs tracker — no parallel logging system | Phase 0 (runs in parallel with Phases 1 & 2; its header work must land alongside Phase 2 Stage 1, not after it — see Phase 2 sequencing) | Owner signs up with hCaptcha or Cloudflare Turnstile and supplies site/secret keys; owner provides real-world guidance on max upload file size/type for Documents; owner confirms whether "cancel instead of delete" is the intended permanent policy for financial records; owner signs off before any change to project-level Supabase Auth settings (shared with Ops Hub) and re-confirms accepting the shared-backend (`private.is_director()`) residual risk |
| **Phase 4 — SEO Technical Foundation** | Make the public site crawlable, shareable, and measurable: sitemap, canonical tags, OG/Twitter cards, JSON-LD, image optimization, analytics, Search Console | Track A: Phase 0 only (ships immediately). Track B1 (JSON-LD `legalName` fix, no `sameAs`): Phase 1's fast-tracked blocking subset only. Track B2 (OG image, full JSON-LD enrichment): Phase 1's full survey + real brand/social assets | Track A: none blocking. Track B1 needs just the 2-5 fast-tracked facts (owner/client action, out of band). Track B2 needs the full survey, real social accounts, and brand assets; the domain-cutover checklist needs the same custom-domain purchase as Phase 2 Stage 2 (owner, non-code) |

---

## Phase 0 — Context *(complete)*

A prior context-gathering pass was made over both repositories (`powerpulse-website` and `director-hub`) before this planning pass began: file trees, route structures, `vercel.json`/`robots.txt` configuration, the Supabase schema and auth layering, and the initial brand-coupling instances were identified by direct repo reads, not assumption. That pass is the shared foundation the four phases below build on. Everywhere a phase below says "verified" or "confirmed," it means grounded in that Phase 0 read (or, where noted, a direct re-check performed while assembling this document) — and everywhere it says "found so far" or "current-best-knowledge," it's an explicit signal that the audit should be revisited, not treated as closed.

---

## Phase 1 — Brand Separation & Content Survey v2

> **Status (2026-10-17):** Part A is code-complete for everything that didn't need owner input — A1, A2, A3, A5, A6 (interim removal), A7 (provisional "POWERPULSE DYNAMICS LTD" text), and A8 (neutral-language pass) are all live in the repo (not yet committed/deployed). Verified rendering correctly via a local static-server preview of index/aboutus/ourservices. **Part B is also done**: `onboarding-2026.html` rebuilt with 47 fields across 7 sections (plus a new urgent testimonials-check block), `api/survey.js`'s `FIELDS` array updated 1:1, checkbox-group submission logic verified working. Still blocked on owner input: A4/A5's final recipient address, A6's real social URLs, A7's final legal-name confirmation — these are now literally what Survey v2 asks for, so the next step is getting the owner to actually fill it in and submit it. One new issue was found during this pass, outside the original 8-instance audit, and later found to be BIGGER than first reported: `index.html` named **eight real companies** as if they were PowerPulse clients — not just the 3 testimonials (Kenchic, Brookside Dairy, Riara Group) but also a separate "Trusted across Kenya & East Africa" logo marquee naming 5 more (Serena Hotels, Sarova Whitesands, Equatorial Nut Processors, Kenya Railways, Maasai Mara). Confirmed live on production (`frontendpowerpulse.vercel.app`) as of 2026-10-17 at the time it was found. Owner decided (2026-10-17): take it down immediately rather than wait for survey answers. **Both the marquee section and the 3-testimonial section have been removed from `index.html` (replaced with an HTML comment explaining why and what's needed to restore them), verified via local preview — no layout break, zero remaining mentions of any of the 8 names anywhere in the file.** Survey v2's urgent top question covers all 8 by name, for when real answers come back.

**Deploy sequencing decision (owner, 2026-10-17): Phase 1 as a whole stays undeployed until the content survey is answered** — brand facts and the takedown fix should ship together, as one accurate deploy, not twice. Phases 2 and 3 are explicitly NOT gated on the survey and should proceed. **Nothing in Phase 1 has been committed or pushed — the live production site still shows the pre-Phase-1 content, including the 8-name claims, until this deploys.** That gap is a known, owner-accepted tradeoff, not an oversight — flagged clearly before the decision was made.

**Update (2026-10-17, later same day):** Phase 1 + Phase 2 Stage 1 are now pushed to branch `phase-1-2-brand-security-survey` on GitHub (4 commits) — NOT merged to `master`, so production is still unaffected and the "wait for survey answers" decision above still holds for the real deploy. Vercel built a preview from this branch successfully (clean build, stable alias `frontendpowerpulse-git-phase-1-2-brand-56fc50-karees1s-projects.vercel.app`); that preview sits behind Vercel's own SSO/deployment protection, so only someone logged into the Vercel account can view it directly.

> **Key decisions**
> - Elevated the inherited "two decades" / "authorised dealer for Riello, Ecoflam, Elco" operating-history copy (found in `aboutus.html` and the shared intro paragraph repeated across all 4 pages) to a **required, blocking** Part A fix (A8) rather than an optional survey follow-up. It's a deeper and more consequential form of the same Boiler-Techniques coupling the owner explicitly flagged than any footer icon or contact email: it's a specific, falsifiable claim about history and named manufacturer relationships, not just an identity artifact.
> - Recommended creating a new, dedicated, free PowerPulse email now — rather than keeping `boilertechniques@gmail.com` as invisible internal routing — because the public Contact page's visible `mailto:` link has to change either way; switching both the display and backend recipient closes the dependency at no added cost.
> - Treated the footer social links as a hard external dependency, not a pure code task: ship an interim fix now (remove the three borrowed-account icons, keep WhatsApp — already PowerPulse's real number) rather than leave a live link to a different company's social accounts in production while waiting on new accounts.
> - Found and included a 7th brand-coupling instance beyond the original list: the footer "© 2026 POWERPULSE · BOILER TECHNIQUES ENGINEERING" legal mark, which is also the disguised click-target redirecting to `/portal` — its click behavior is deliberately left untouched since that obscurity mechanism is a separate, already-decided design (and, per Phase 2, its target is updated there, not here).
> - Proposed decoupling a small "blocking subset" of Survey v2 (legal entity name, contact-email preference, social handles, operating history/dealer-status facts) from the rest of the survey, so Phase 1's code fixes aren't stalled waiting for a long-form survey to be completed in one sitting.
> - Restructured `services_offered` and case studies into a small number of bounded, repeated form blocks (up to 5 services, up to 3 case studies) rather than dynamic add/remove JS, to stay realistic for a zero-build-step, zero-framework static site maintained by one developer.
> - Kept certifications, equipment-brands-serviced, and case-study fields optional rather than required (distinct from the A8 facts above, which are required), trading some content completeness for a higher chance the busy owner actually finishes the survey in one sitting.

### Objective
Remove every currently-identified dependency of the PowerPulse Dynamics Ltd website on "Boiler Techniques" — the business it was cloned from for convenience, and a separate company this site must carry no relative comparison to — and replace the current, too-generic content survey (`onboarding-2026.html`) with a deliberately engineered v2 that extracts the specific, hard-to-copy facts needed to write PowerPulse as its own standalone, SEO-differentiated business. This phase's inventory (8 instances, below) is **current-best-knowledge, not a closed list** — the 7th and 8th instances were each found only on a later re-read of the same four pages, so Part A should not be marked done without one more targeted pass specifically for inherited copy before closing out. Scope is code-and-content only, sized for a solo developer; it does not touch Director Hub's business logic, Ops Hub, or the shared `BOILER_SYSTEM` Supabase backend, and it does not cover subdomain separation or `sitemap.xml` — those are Phase 2 and Phase 4 below.

### Why (gaps confirmed by direct repo read)
Eight concrete brand-coupling instances have been found so far, across repeated passes over the same four pages — treat this as current-best-knowledge, not a final count:

1. `README.md:3` — describes the site as "PowerPulse (Boiler Techniques Engineering)".
2. `README.md:29,38` — documents `CONTACT_RECIPIENT`'s default as `boilertechniques@gmail.com` and gives `boilertechniques.co.ke` as the example production sending domain.
3. `.env.example:5,8` — same default value and domain example, in the file a developer actually copies from.
4. `contactus.html:103` — a live, visitor-facing `mailto:boilertechniques@gmail.com` link on the Contact page itself.
5. `api/contact.js:60` and `api/survey.js:88` — hardcoded fallback recipient `'boilertechniques@gmail.com'`, used only if the Vercel env var is unset, but still a landmine for a future redeploy/new environment.
6. `index.html:288-290` (identically repeated in `aboutus.html`, `ourservices.html`, `contactus.html`) — footer social icons linking to `instagram.com/boilertechniques`, `twitter.com/boilertechniques`, `facebook.com/boilertechniques`, on every page.
7. `index.html:334` (and the matching line in the other three pages) — the footer legal mark reads `© 2026 POWERPULSE · BOILER TECHNIQUES ENGINEERING`. `js/main.js:17-20` wires a click handler on that exact element (`#pp-legal-mark`) to redirect to `/portal` — i.e. it is also the disguised Director Hub entry point. Any fix here must change only the visible text, not the click behavior (that mechanism and its target are Phase 2's responsibility — coordinate the two edits).
8. **New finding, more substantive than 1-7:** `aboutus.html`'s H1 ("Two decades keeping Kenya's industry running") and its paragraph ("two decades of hands-on thermal engineering experience... an authorised dealer for leading European boiler and burner brands"), plus `index.html`/`ourservices.html`'s "Authorised dealer for European brands — Riello, Ecoflam and Elco burners — original equipment with full manufacturer warranties," repeated verbatim across all 4 pages' shared intro paragraph. Unlike instances 1-7, this isn't an identity artifact (a name, an email, an icon) — it's a specific, falsifiable claim about operating history and named manufacturer relationships. If it isn't true for PowerPulse, continuing to publish it is a false-advertising / manufacturer-misrepresentation exposure, and directly undercuts the owner's own "realism" bar. This is treated as a **required, blocking** Phase 1 fix (A8 below), not deferred to the optional long-form survey.

On the content side, the current survey's weakest fields are exactly the ones that most need depth: `industry` is a single free-text line (no structured service categories for schema/SEO), `differentiators` is "one reason per line" with no requirement to back the reason with evidence, and there is no field anywhere for certifications, equipment brands serviced, service-area radius, response-time commitments, case studies, founding year, or — critically — confirmation of the legal entity name or PowerPulse's own social handles.

### Part A — Brand Separation: fix per instance

| # | Instance | Fix type | Action |
|---|---|---|---|
| A1 | `README.md:3` | Pure text edit | Rewrite to "PowerPulse Dynamics Ltd, a thermal engineering company in Nairobi" — drop the parenthetical entirely. |
| A2 | `README.md:29,38` | Pure text edit (value depends on A5 decision) | Reword the `CONTACT_RECIPIENT` row to describe it as "an internal routing inbox, not a public brand identifier," and replace the `boilertechniques.co.ke` example with a generic placeholder (`yourdomain.co.ke`) rather than any real domain. |
| A3 | `.env.example:5,8` | Pure config edit (value depends on A5) | Same generalization as A2, applied to the file a developer actually copies. |
| A4 | `contactus.html:103` | Code edit, **must change regardless of A5's outcome** | Display either a new dedicated PowerPulse address (if A5 → Option 2) or, at minimum, drop the visible address to WhatsApp/phone only until a PowerPulse address exists. |
| A5 | `api/contact.js:60`, `api/survey.js:88` fallback strings | Code edit + **operational step** | See decision below. Also change the *pattern*: fail with a clear 503 if the env var is unset, instead of silently defaulting to any hardcoded real inbox. |
| A6 | Footer social icons (4 pages) | **Not a pure code fix — external dependency** | Interim fix (ship now): remove the three icons, keep only WhatsApp (`wa.me/254721170470` — confirmed real number). Permanent fix: swap in real URLs once accounts exist and are captured via Survey v2. |
| A7 | Footer legal mark text, all 4 pages | Pure text edit — **highest-visibility fix** | Change to `© 2026 POWERPULSE DYNAMICS LTD`. Do not touch `js/main.js`'s click-to-`/portal` wiring in this phase — its target URL is Phase 2's responsibility to update. |
| A8 | `aboutus.html` H1 + shared intro paragraph (all 4 pages) + `ourservices.html`'s "Authorised dealer for European brands — Riello, Ecoflam, Elco" | Content edit — **required, blocking fix, not optional** | Do not keep publishing a specific operating-history length or named manufacturer-dealer relationship that hasn't been confirmed true for PowerPulse. Until the owner confirms actual years in operation and any real authorized-dealer status, replace with neutral, verifiably-true language (e.g., "thermal engineering specialists serving Kenyan industry" instead of "two decades..."; drop the Riello/Ecoflam/Elco line entirely rather than guess). Restore specific claims only once the owner confirms them — this is a false-advertising/manufacturer-misrepresentation exposure if left live and untrue, not merely a branding inconsistency. |

**Decision on the shared contact email (A5):** Recommend **creating a new, dedicated, free PowerPulse address now** rather than keeping `boilertechniques@gmail.com` as invisible internal plumbing. A4 (the public Contact page) must change its *displayed* address regardless, so the only question is whether the backend `CONTACT_RECIPIENT` also switches to match — switching both closes the dependency with no real added cost. The actual recipient is controlled by the `CONTACT_RECIPIENT`/`SURVEY_RECIPIENT` env vars in the Vercel dashboard (Production + Preview scopes) — updating those is an operational step outside the repo, not just a code edit, and must be verified live, not assumed from `.env.example`.

**External, non-code task for the owner (do not code around this):** create PowerPulse Dynamics Ltd's own social accounts — worth a short conversation on *which* platforms actually matter for a B2B industrial/engineering audience in Kenya (LinkedIn plausibly matters more than Instagram/Twitter/Facebook here). In the same conversation, get the owner's confirmation of the real operating history and any genuine equipment-brand authorizations, needed to correct or confirm A8.

### Part B — Content Survey v2

#### Why the current fields are too shallow
- `industry` (one free-text line) can't drive LocalBusiness/ProfessionalService schema, which wants specific service categories.
- `differentiators` ("one reason per line") invites boilerplate with no requirement for the evidence that makes a claim believable and unique.
- `services_offered` is one unstructured free-text block — it can't become distinct, keyword-rich service sections.
- There is no field anywhere for: legal entity name confirmation, PowerPulse's own social handles (blocks A6), certifications/compliance, named equipment brands serviced, a real service-area radius, response-time commitments, founding year, or past project/case-study material.

#### Rebuilt field list (grouped, each field justified)

**1. About you**
- `submitter_name` (kept)
- `submitter_role` (new, optional) — owner vs. staff answering changes how much weight to put on claims like certifications.

**2. Legal & brand identity** *(mostly new — closes Part A's dependencies)*
- `legal_entity_name` (new, required) — "Confirm your registered company name exactly as it should appear in the footer, copyright line, and structured data." Closes: the entity name currently has no owner-confirmed source.
- `business_name` / trading name (kept, relabeled)
- `tagline` (kept)
- `service_categories` (replaces free-text `industry`) — structured multi-select + "other" free text.
- `brand_color` (kept)
- `brand_assets_available` (new) — logo file / real project photos?
- `social_handles` (replaces free-text `social_links`) — structured per platform. Closes: A6 directly.
- `preferred_public_contact` (new) — puts the A4/A5 decision in the owner's hands.

**3. Contact & service area**
- `whatsapp_number`, `phone_numbers`, `contact_email`, `address`, `hours` (all kept)
- `service_area_radius` (new) — confirms or corrects the hero copy's "across Kenya & East Africa" claim.
- `response_time_commitment` (new) — a concrete trust/conversion signal.

**4. Proof & credibility** *(new section — the biggest content gap)*
- `certifications_and_compliance` (new) — licenses, DOSH boiler certification, ISO certs, manufacturer-authorized status (this field now also formally closes A8's dealer-status question, not just future SEO content).
- `equipment_brands_serviced` (new) — specific brands/models actually installed or serviced.
- `past_projects_case_studies` (new, up to 3 structured entries).
- `differentiators` (kept, prompt rewritten to require evidence per line, not just a reason).
- `key_stats` (kept, prompt tightened toward independently-checkable numbers).

**5. About the business**
- `founded_year` (kept — now explicitly feeds A8's correction, not just About-page copy), `about_text`, `mission_vision_values` (kept, `about_text` prompt tightened).
- `company_history_milestones` (new, optional).

**6. Services**
- `services_offered` (restructured into up to 5 repeated entries: name, description, typical customer, relevant brands/equipment).
- `target_industries` (kept)

**7. Anything else**
- `testimonials` (kept, now asks for publish permission + company name if allowed), `cta_wording` (kept), `notes` (kept)

#### Build notes
- Keep the "repeated entries" pattern bounded ("Service 1–5", "Case study 1–3") rather than dynamic add/remove JS.
- Update `api/survey.js`'s `FIELDS` array 1:1 with the new field names/labels.
- Keep the page itself exactly as hidden as today: `noindex`, unlinked, excluded from `robots.txt` and the service worker cache, `X-Robots-Tag` header in `vercel.json`.

### Deliverables / Tasks
1. Confirm with the owner: which new PowerPulse contact address to create and display (closes A5/A4).
2. Edit `README.md` (lines 3, 29, 38) — remove Boiler Techniques framing, generalize domain example.
3. Edit `.env.example` (lines 5, 8) to match.
4. Edit `contactus.html:103` to show the finalized PowerPulse contact detail.
5. Edit `api/contact.js:60` and `api/survey.js:88` — replace hardcoded fallback with the new default or an explicit "fail if unset" pattern.
6. Edit the footer legal mark on all 4 pages to `© 2026 POWERPULSE DYNAMICS LTD`; verify `js/main.js`'s `/portal` click handler still fires unchanged (its target URL changes under Phase 2, not here).
7. Remove the Instagram/Twitter/Facebook footer icons on all 4 pages now; keep WhatsApp.
8. **Edit `aboutus.html`'s H1 and shared intro paragraph (all 4 pages), and `ourservices.html`'s "Authorised dealer" line (A8)** — replace unconfirmed operating-history/dealer claims with neutral, verifiably-true language until the owner confirms actual facts. Required before Phase 1 is considered done; do not defer this to the optional survey fields.
9. Update `CONTACT_RECIPIENT`/`SURVEY_RECIPIENT` in the live Vercel dashboard (Production + Preview) to match the finalized address.
10. Owner creates PowerPulse Dynamics Ltd's own social accounts on whichever platforms are agreed as worthwhile.
11. Re-add real social URLs to the footer once accounts exist.
12. Finalize the Survey v2 field list with the owner (sign-off before building).
13. Rebuild `onboarding-2026.html` with the new sections/fields.
14. Update `api/survey.js`'s `FIELDS` array to match.
15. **Whenever any task above touches `index.html`, `aboutus.html`, `ourservices.html`, or `contactus.html`, bump that page's `lastmod` entry in `powerpulse-website/sitemap.xml` in the same commit** (coordinates with Phase 4 Track A, which ships the initial sitemap — see Phase 4's cross-phase note). If these edits land before the sitemap exists yet, use each page's actual edit date as the initial `lastmod`, not a stale pre-edit date.
16. Send the survey to whoever holds the real business facts; collect responses (the 2-5 blocking facts should move on a faster track — see Dependencies).

### Dependencies
- Tasks 1, 10, 11 depend on an owner decision/action outside the codebase; they are not purely engineering tasks.
- Task 9 requires Vercel dashboard access, not just repo access.
- **Sequencing shortcut recommended:** don't block all of Part A on a fully completed Survey v2 response. Ask the owner directly, out of band, for just the 4-5 facts that unblock Part A: legal entity name confirmation, the contact-email decision, current social handles (or "we don't have any yet"), **actual years in operation / founding year, and whether PowerPulse holds any real manufacturer-authorized-dealer status (and with which brands, if any) — needed to correct or confirm A8**. The fuller survey (services detail, certifications, case studies) proceeds on its own, less time-pressured track.
- This phase intentionally does not cover subdomain separation for `/portal` (Phase 2) or `sitemap.xml`/broader SEO infrastructure (Phase 4). Overlap points: task 6 (footer legal-mark text) must leave the existing `/portal` redirect mechanism untouched so as not to conflict with Phase 2's work on that click target; task 15 (sitemap `lastmod`) must stay in sync with whatever Phase 4 Track A ships.

### Acceptance criteria
- No case-insensitive occurrence of "boilertechniques" remains in `README.md`, `.env.example`, `contactus.html`, `api/contact.js`, or `api/survey.js`.
- All 4 public pages' footer legal mark reads a PowerPulse-only identity string, and clicking it still navigates correctly (regression check).
- No page links to `instagram.com/boilertechniques`, `twitter.com/boilertechniques`, or `facebook.com/boilertechniques`.
- No unverified, specific operating-history length ("two decades," etc.) or named manufacturer-authorized-dealer claim (Riello/Ecoflam/Elco) remains live unless the owner has confirmed it true for PowerPulse; until confirmed, copy uses neutral, verifiably-true language instead (A8).
- `CONTACT_RECIPIENT`/`SURVEY_RECIPIENT` verified live in Vercel (not just in `.env.example`); a real test submission of both the contact form and survey form is confirmed delivered after the change.
- New `onboarding-2026.html` is live, still `noindex`/unlinked/excluded from `robots.txt` exactly as before, and `api/survey.js`'s `FIELDS` array matches its field names 1:1.
- Owner has reviewed and approved the final Survey v2 field list before the rebuild, and has supplied at minimum the 4-5 fast-tracked facts blocking Part A.
- Any content edit made in this phase to the 4 public pages has a matching `sitemap.xml` `lastmod` bump in the same commit.

### Open risks
- The brand-coupling audit has already undercounted once (instance 7 was a late addition) and arguably twice (instance 8, the inherited history/dealer copy, was missed across earlier passes before this one) — treat the 8-instance list as current-best-knowledge, not closed. Do one more targeted re-read of all four pages' body copy specifically for inherited history/credential language before marking Part A done.
- The legal entity name "PowerPulse Dynamics Ltd" was sourced from the Director Hub app's own README, not confirmed directly by the business owner — Survey v2 asks for confirmation, but nothing should be hardcoded into the footer/JSON-LD as final until that answer comes back. This is the single highest-leverage unconfirmed fact in the whole roadmap, since it propagates into the footer, JSON-LD `legalName`, and potentially real legal/registration paperwork.
- Removing the three social-media icons from a live, already-deployed public site is a visible content change; recommend getting the owner's quick go-ahead before deploying it.
- Which new contact-email provider/address to use was left as an open question for the owner — do not assume Gmail or any specific naming convention without asking.
- The current hero copy claims service "across Kenya & East Africa" — the new `service_area_radius` field exists specifically to confirm or correct this; until answered, treat the existing claim as unverified marketing copy, not fact.
- Certifications, equipment-brands-serviced, and case-study fields require the owner to pull real records/documents, so they are the fields most likely to stall survey completion — flagged as optional/follow-up-eligible rather than required.
- It's unclear whether the person filling out the survey is the actual PowerPulse Dynamics Ltd owner or a separate client being represented — this plan assumes the survey reaches whoever holds the real business facts.
- Which social platforms are worth creating accounts on is a strategic marketing call left to the owner.

---

## Phase 2 — Security & Subdomain Isolation

> **Status (2026-10-17):** Stage 1 is code-complete in both repos, locally, not deployed: `director-hub/next.config.ts` now ships the security headers it had zero of before (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS, and a CSP scoped correctly to allow the ONE real browser-side Supabase call this app makes — `/reset-password`'s client-side `supabase.auth.updateUser()` — verified by reading `src/lib/supabase/client.ts` and confirming no other `"use client"` page imports it, so `connect-src` was not left too permissive or too strict), plus a `/portal/:path*`-scoped `X-Robots-Tag: noindex, nofollow` carried over from the old proxy config. `powerpulse-website/js/main.js`'s footer click handler now points directly at `https://director-hub-eight.vercel.app/portal` instead of the proxied `/portal` path; `vercel.json`'s four rewrite rules and the `/portal`/`_next` header blocks are removed (fixed a resulting JSON syntax error immediately — caught by validating, not assumed correct); `robots.txt` no longer disallows `/portal`. **Not done:** this has not been deployed, so the live smoke test PLANNING.md calls for (login/invoice-PDF/document-download against the real `director-hub-eight.vercel.app` origin) has not happened — that requires an actual push + Vercel deploy, which needs the owner's go-ahead, not just a local edit. Stage 2 (branded subdomain) untouched — still gated on a domain purchase.

**Update (2026-10-17, later same day): MERGED AND LIVE.** Both PRs merged to `master` (`powerpulse-website` PR #2, `director-hub` PR #1), production redeployed automatically, and verified directly against the live sites (not assumed):
- `director-hub-eight.vercel.app`'s response headers confirmed live via `fetch()`: CSP (with the correct Supabase `connect-src`), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, HSTS, `Referrer-Policy`, `Permissions-Policy` — all present exactly as configured.
- `/portal` confirmed reachable directly (no more proxy), redirects to `/portal/login`, carries `X-Robots-Tag: noindex, nofollow`.
- `frontendpowerpulse.vercel.app`'s footer admin link confirmed (by reading the deployed `js/main.js`) to target `https://director-hub-eight.vercel.app/portal` directly.
- **One bug caught live after the first merge**: each public page actually has TWO WhatsApp links (a floating chat button and a separate footer social icon) — only the floating button got the real number in the original commit. Caught by reading the live deployed page's actual links rather than assuming the earlier fix was complete, fixed in a follow-up PR (#3), merged and reverified.
- Dependabot (enabled as part of Phase 3a) already opened 4 PRs on `director-hub` within minutes of merging — one (`react-dom` 19.2.8→19.3.0) failed its preview build. Not yet investigated or acted on; these are separate from this project's own phase work.

**Update (2026-10-17, later still): Phase 3b (real scope) and 3c now also merged and live.** After Ian flagged confusion navigating to `director-hub`'s own `/` (a deliberate public camouflage page, not the dashboard — `/portal` is where the real app is, confirmed working), three gaps were identified, built, and shipped in PR #7: (1) director-hub's own public pages now use the same real business facts as everywhere else, including phone/email on `/contact` that were missing entirely; (2) documents search/filter (reusing the existing `search_vector` column) and the previously-disconnected delete button are wired up, plus an `updated_at` trigger-based column on clients/invoices/invoice_items/lpos/lpo_items; (3) the UI consistency pass — one shared `StatusBadge` and `formatMoney` helper instead of four duplicated versions, LPOs now get the due-date countdown they never had, `InvoiceBuilderForm` now uses the shared `LineItemsFieldset` like the other two builders. Verified live: public pages render the real content on `director-hub-eight.vercel.app` (confirmed via `fetch`/browser). The documents search/delete and updated list-page UI are behind the Director login and have NOT been visually verified by anyone yet — no test credentials available to this session; code-level confidence comes from a clean `tsc`/`eslint`/production build only. **All of Phase 3 (3a/3b/3c) is now built and live** — only 3d ("what not to build," a guideline not an action) was never a build task to begin with.

> **Key decisions**
> - Split this phase into a **Stage 1** (free, immediate, no-domain-needed isolation — remove the shared-origin proxy and point straight at Director Hub's existing `.vercel.app` origin) and a **Stage 2** (branded-subdomain upgrade, gated on a purchased domain). The owner's actual "admin and users don't crash together" goal is met in Stage 1, at zero cost; Stage 2 is a URL/branding and discoverability improvement layered on top, not a prerequisite for the isolation itself.
> - Chose a real Vercel-native subdomain (Stage 2, attached directly to the `director-hub` project) over a self-hosted reverse proxy/WAF, since Vercel's own per-project domain routing already gives full origin isolation at zero added operational cost.
> - Recommended keeping a non-obvious subdomain label at Stage 2 rather than switching to something self-announcing like "admin.", while being explicit that a public subdomain is inherently more discoverable than today's disguised footer-click path, because of public Certificate Transparency logs.
> - Recommended a hard cutover of the `/portal` entry point (update the click handler directly) over a temporary redirect rule, since the old path was never a public, bookmarked link in the first place.
> - Scoped this phase to the hosting/routing layer only — explicitly declined to touch the shared Supabase backend — and documents the resulting residual risk once, as part of Phase 3a-9's write-up, rather than maintaining two independently-worded risk notes that have to be kept in sync.
> - Decided cookies must remain host-only (no shared `Domain` attribute across subdomains) as a standing rule.
> - Sequenced the domain purchase to start immediately and in parallel with Phase 1 and Stage 1, since it is the single longest, least code-dependent lead time in the entire roadmap — but it now blocks only Stage 2.

### Objective
Give the Director Hub admin area a real, separate network identity instead of the current same-apparent-origin, path-based reverse proxy, so that a crash, bug, outage, or attack confined to the admin section cannot surface as a failure on the public marketing site, and vice versa. This happens in two stages: **Stage 1** achieves the isolation itself, immediately, using infrastructure that already exists (Director Hub's own `.vercel.app` project). **Stage 2** upgrades the resulting plain URL to a branded subdomain once a custom domain exists. This is the solo-dev-realistic version of "subdomains to prevent unitary crashes": no new infrastructure to run and maintain, just correct use of Vercel's own per-project domain routing.

### Why this phase, specifically (grounded in the live config)
Direct read of `powerpulse-website/vercel.json`, re-verified while assembling this document, confirms:

```json
"rewrites": [
  { "source": "/portal", "destination": "https://director-hub-eight.vercel.app/portal" },
  { "source": "/portal/:path*", "destination": "https://director-hub-eight.vercel.app/portal/:path*" },
  { "source": "/api/invoices/:path*", "destination": "https://director-hub-eight.vercel.app/api/invoices/:path*" },
  { "source": "/_next/:path*", "destination": "https://director-hub-eight.vercel.app/_next/:path*" }
]
```

- A 4th rewrite rule, `/_next/:path*`, is also proxied — required because Director Hub is a Next.js app and its hashed JS/CSS bundles are served from `/_next/*`. Any migration off the proxy has to retire this rule too.
- The two apps genuinely are separate Vercel projects today, each already reachable at its own origin (`director-hub-eight.vercel.app` has a valid TLS cert right now) — that separation already exists; this phase does not need to create it, only stop routing through a shared proxy on top of it.
- What is **not** isolated today: once a request for `/portal/*` lands on the public site's edge, Vercel transparently fetches and returns `director-hub-eight.vercel.app`'s response as if it came from the public origin. Confirmed in `vercel.json`'s `headers` block: the `/portal/:path*` source gets its own, looser CSP than the root — the public site's own config file is already carrying two different security postures for two different apps, keyed on URL path rather than origin.
- Because the rewrite is transparent, `/portal/*` responses **do** currently inherit security headers from `powerpulse-website`'s `vercel.json` even though `director-hub` itself ships with no `headers()` and no `vercel.json` of its own. **This means retiring the rewrite (Stage 1) removes those inherited headers at the same moment** — Phase 3a-7's own header work in `director-hub` must land at the same time as, or before, the rewrite removal, not sometime after, or there's a real window with zero security headers on the admin app.
- Supabase Auth cookies are set without an explicit `Domain` attribute, so they already default to host-only. This must **stay** host-only after any move.
- Neither app has a custom domain yet — both are still on `*.vercel.app`. A *branded* subdomain cannot be issued without first owning a domain — but Director Hub's existing `.vercel.app` origin needs no such purchase to be used directly.

---

### Phase 2 · Stage 1 — Immediate isolation (ship now, free, no domain required)

1. **Smoke-test directly against `https://director-hub-eight.vercel.app/portal`** (not through the proxy): login, one client create, one invoice PDF generation, one document upload/download (signed URL) — confirm cookies, CSP, and Storage signed-URL generation all work correctly on that origin before cutting anything over.
2. **Update `js/main.js`'s `#pp-legal-mark` click handler** to point directly at `https://director-hub-eight.vercel.app/portal` instead of the proxied `/portal` path (coordinates with Phase 1 task 6 — only the visible text changes there; the click target changes here).
3. Only after the smoke test passes, **remove all four rewrite rules** (`/portal`, `/portal/:path*`, `/api/invoices/:path*`, `/_next/:path*`) and the now-redundant `/portal/:path*` entry in `powerpulse-website/vercel.json`'s `headers` block — keep the old rewrite live in parallel for a short overlap window rather than cutting over atomically, so a mistake is a rollback, not a live incident.
4. **Update `robots.txt`**: remove the `Disallow: /portal` line from the public site (meaningless once `/portal` is simply a different origin's own path) — Director Hub's own `noindex`/`X-Robots-Tag` posture (Phase 3) carries this responsibility from here on.
5. Confirm the Supabase Auth redirect/callback allow-list already includes `director-hub-eight.vercel.app` (it should, since that's the project's own domain) — a check, not a new addition, since Stage 1 introduces no new origin.
6. **Hard dependency with Phase 3a-7:** Director Hub's own `headers()`/`vercel.json` security-header work must land at the same time as, or before, step 3 above. Sequencing these out of order leaves a real gap where the admin app has no security headers at all.

This alone retires the shared-origin proxy and meets the "admin and users don't crash together" goal — today, for $0, before any domain exists. The one accepted trade-off: `director-hub-eight.vercel.app` is a less polished URL than a branded subdomain and is more visibly "a different app" to anyone reading the address bar closely. That's resolved in Stage 2.

### Phase 2 · Stage 2 — Branded subdomain upgrade (gated on domain purchase)

Everything below is a branding/discoverability upgrade layered on top of Stage 1's isolation. Once Stage 1 ships, the isolation goal is already met; Stage 2 trades the plain `.vercel.app` URL for something like `portal.powerpulse.co.ke` once a domain exists.

**2a — Prerequisite: domain acquisition & DNS (external, blocking only Stage 2)**
1. Owner purchases a domain for PowerPulse Dynamics Ltd (e.g. `powerpulse.co.ke` or `.com` — note `.co.ke` registration typically requires a local registrar/KRA PIN, which can add lead time versus a generic TLD).
2. Add the domain to the `powerpulse-website` Vercel project as the apex/root (and `www`) domain.
3. Add a chosen subdomain label (see 2b) directly to the `director-hub` Vercel project.
4. Verify both via Vercel's domain-verification flow — requires the owner's registrar/DNS access.

This step has no fixed timeline and should start in parallel with Phase 1 and Stage 1 — it's the longest-lead-time item in the whole roadmap, but it now blocks only this stage, not the isolation goal above.

**2b — Subdomain naming & architecture decision**
1. Recommend a non-obvious subdomain label, not `admin.` or `dashboard.`. Stated honestly: a real subdomain is **more** discoverable than today's disguised click-handler, because any publicly-trusted TLS certificate is permanently logged in public Certificate Transparency logs. A quieter label reduces casual probing but doesn't prevent discovery — the real security boundary stays Supabase RLS + `requireDirector()` (Phase 3). Flagged in Open Risks below as a genuine, accepted trade-off.
2. Decide, and document, that cookies stay host-only (no `Domain=.powerpulse.co.ke` on any cookie) — add this as a one-line rule alongside Phase 3's service-role-key rule.
3. Decide the transition policy for `/portal` on the public domain: **recommend a hard cutover**, since by Stage 2 the entry point already points directly at `director-hub-eight.vercel.app` (Stage 1), and this step is simply updating that pointer again to the branded subdomain — no redirect-rule scaffolding needed.

**2c — Migration: branded subdomain cutover**
1. Deploy `director-hub` normally to its new `portal.powerpulse.co.ke`-style domain — no code change required; Vercel serves the existing app from the new hostname once DNS/cert verification completes, same as it already does for `director-hub-eight.vercel.app` today.
2. Update `js/main.js`'s `#pp-legal-mark` click handler (already pointing at `director-hub-eight.vercel.app/portal` since Stage 1) to point at the branded subdomain's login URL instead.
3. (Rewrite rules were already removed in Stage 1 — nothing further to remove here.)
4. The subdomain serves its own `robots.txt` (`Disallow: /`), independent of the public site's — same posture Stage 1 already established, just on the new hostname.
5. Confirm the Supabase Auth redirect/callback allow-list includes the new branded origin before cutover (this one genuinely is a new addition, since it's a new origin).
6. Repeat the Stage 1 smoke test (login, client create, invoice PDF, document upload/download) directly against the new branded origin before removing the old `.vercel.app`-pointing click handler.
7. Keep the Stage-1 URL reachable in parallel for a short overlap window, same rollback logic as Stage 1.

**2d — Document the residual risk, once**
Hosting/network isolation becomes real at Stage 1; data-layer isolation does not, and neither stage changes that. Both apps still depend on the same Supabase project (`BOILER_SYSTEM`) for Director Hub's auth/RLS backstop. **This is documented once, as part of Phase 3a-9's write-up in `director-hub`'s `README.md`/`AGENTS.md`** — Phase 2 contributes the hosting-side half of that sentence (isolating the web/hosting blast radius does not isolate the shared-backend blast radius), rather than maintaining a second, independently-worded note that has to stay in sync with Phase 3a-9's.

**2e — Explicit "what NOT to build"**
1. No self-hosted reverse proxy, API gateway, or WAF.
2. No splitting or duplicating the Supabase backend.
3. No micro-frontend/module-federation architecture.
4. No automated redirect-rule tooling — a manual, one-time edit is correctly sized for a change that happens once (twice, counting Stage 2).

### Dependencies
- **Stage 1 has no external dependency and should ship immediately** — it's pure code/config, no domain needed, and delivers the actual isolation goal.
- **Stage 2's blocking prerequisite** is domain purchase + DNS (2a) — external, non-code, unknown timeline. Only Stage 2 (branding/discoverability), not the isolation goal, waits on it.
- Phase 3's security-header work (3a-7) must land alongside Stage 1's rewrite removal, not independently of it — see the hard dependency noted in Stage 1 step 6.
- Should complete before any substantial *new* Director Hub feature work ships beyond Phase 3's polish-and-harden scope.

### Acceptance criteria

**Stage 1 (ships now):**
- [ ] All four rewrite rules and the `/portal/:path*` headers block are removed from `powerpulse-website/vercel.json`.
- [ ] Footer legal-mark click handler points directly at `https://director-hub-eight.vercel.app/portal`; clicking it from the live public site reaches Director Hub's login page successfully.
- [ ] `powerpulse-website/robots.txt` no longer disallows `/portal`.
- [ ] Login, invoice PDF generation, and document signed-URL download all verified working end-to-end directly against `director-hub-eight.vercel.app` before the old rewrite is removed.
- [ ] Phase 3a-7's security headers are confirmed live on `director-hub-eight.vercel.app` at the same time the rewrite is removed — no header-gap window.
- [ ] Cookies set by `director-hub` are confirmed host-only post-cutover.

**Stage 2 (gated on domain purchase):**
- [ ] The branded subdomain resolves directly to the `director-hub` Vercel project with a valid TLS certificate.
- [ ] Footer legal-mark click handler updated again to point at the branded subdomain.
- [ ] Subdomain serves its own `robots.txt` (`Disallow: /`), independent of the public site's.
- [ ] Supabase Auth allow-list includes the new branded origin; full smoke test repeated there before cutover.
- [ ] The shared-Supabase residual-risk note exists as a single canonical write-up (Phase 3a-9), with Phase 2's contribution folded in rather than duplicated.

### Open risks
- Stage 1 has effectively no open risk beyond normal regression risk of a config change — it uses infrastructure that already exists and is already TLS-secured.
- Stage 2's domain purchase/DNS step has no fixed timeline and is entirely outside the codebase — if delayed, only the branding upgrade (and Phase 4's domain-cutover checklist) stalls with it, not the isolation already shipped in Stage 1.
- Moving to a branded subdomain makes Director Hub's existence discoverable via public Certificate Transparency logs in a way `director-hub-eight.vercel.app` already somewhat is (it's a public hostname too, just less guessable) — worth the owner's explicit sign-off since it changes a previously-informal security property.
- `.co.ke` domain registration may require local registrar/KRA verification steps that add lead time versus a generic TLD — unconfirmed until the owner actually starts the purchase.
- The overlap windows (Stage 1 step 3, Stage 2 step 7) need someone to actually remember to remove the superseded route afterward, or the "isolation" is cosmetic while an old path still works as a silent backup route.
- Neither stage addresses the shared-Supabase-backend residual risk (RLS depending on Ops Hub's `private.is_director()`); this must be re-confirmed with the owner as an accepted trade-off via Phase 3a-9's write-up.
- Updating Supabase Auth's allowed redirect/callback URLs (Stage 2 step 5) touches a project-level setting shared with Ops Hub — needs the same owner sign-off Phase 3 (3a-1, 3a-9) already calls for before touching shared Auth settings.

---

## Phase 3 — Director Hub: Polish & Harden

> **Key decisions**
> - Recommended Supabase Auth's built-in CAPTCHA (hCaptcha/Turnstile) for login brute-force defense instead of a hand-rolled rate limiter, since no app-level throttle exists today and a built-in toggle fits a solo-dev effort budget better than custom middleware.
> - Scoped the only schema change in this phase to adding `updated_at` (+ trigger) on clients/invoices/lpos (and their item tables) — verified no such column exists anywhere in the two migrations — rather than any audit-log/event-sourcing table, because that alone delivers the "personal dashboard" feel the owner wants.
> - Treated UI consistency work as *consolidating duplicated logic that already exists three times* rather than introducing a new design system or component library — verified each duplication by reading the actual page/component files.
> - Scoped document-upload hardening to a MIME/size allow-list only, explicitly rejecting malware-scanning infrastructure, because the feature sits behind `requireDirector()` and the uploader is the business owner uploading their own paperwork.
> - Treated quotations' denormalized `client_name` text column as read-only/do-not-touch this phase, since migration comments confirm Ops Hub's own Express API still writes it directly.
> - Kept "no hard delete on invoices/quotations/LPOs" as the recommended design, proposing documentation of that intent rather than adding delete UI, but flagged it as an open question since the gap isn't actually documented anywhere today.
> - Made Phase 3a-9 the single canonical write-up of the shared-Supabase residual risk, cross-referenced (not duplicated) by Phase 2d.

*(numbering here is this sub-roadmap's own; slotted as Phase 3 in the master sequence)*

> **Status (2026-10-17): Phase 3b is data-complete.** Real company letterhead (name, tax PIN, address, email, website) set in `company_settings`; 5 real clients seeded (Glacier Products Ltd, Elite Plants International Limited, Zaytuna Agro Industries Limited, Lean Energy Solutions Ltd, Food Education Giga Kitchen); 8 real historical invoices (12 line items) and 7 real historical quotations (12 line items) seeded, sourced from `H:\PowerPulsedocs`, cross-checked against KRA eTIMS fiscal receipts where available. All math verified (subtotal + tax = total on every record; invoice line items sum to subtotal except one documented discount case). **A near-miss happened during this**: an earlier schema check showed "0 rows" everywhere, which was stale/cached Postgres statistics, not real emptiness — the database already had 7 duplicate test "ZAYTUNA" client records, a real invoice, an uploaded real PDF, and 3 trivial test quotations. One accidental 8th duplicate was created before this was caught via a `COUNT(*)` check. Owner confirmed the Zaytuna test data had no real meaning; everything was cleared and re-seeded cleanly. **Lesson: always run a direct `COUNT(*)` before assuming a table is empty — don't trust summary/list-tables row counts.** The PDF generators (`InvoiceDocument.tsx`/`QuotationDocument.tsx`) were not independently re-verified via an isolated script (hit a Node/tsx module-resolution issue with a transitive dependency, unrelated to the app's own code) — but a real invoice matching one of the seeded records was already successfully generated and uploaded through the actual running app before this session started, which is stronger evidence the pipeline works than an isolated script would be. Real phone numbers (+254710187781, +254725134483, from the invoices) now replace the old ones across all of `powerpulse-website`'s public pages — WhatsApp links deliberately left unchanged since it's unconfirmed which number is actually WhatsApp-enabled.

> **Status (2026-10-17): Phase 3a is code-complete**, all 9 items, in `director-hub` (local, uncommitted): login CAPTCHA wired via Cloudflare Turnstile (conditional — dormant until `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + the matching Supabase Auth setting are both configured, so login keeps working unchanged until then; CSP's `script-src`/`frame-src`/`connect-src` widen automatically, only when that key is set); cookie settings confirmed via source (no override of `@supabase/ssr` defaults); service-role-key guardrail + the shared-backend residual-risk writeup added to `CLAUDE.md` (not `AGENTS.md` — that file is auto-regenerated by `next dev`, confirmed by reading its own header, so durable rules go in `CLAUDE.md` instead); `uploadDocument()` now enforces a MIME/size allow-list (PDF/JPEG/PNG/WebP, 15MB) matching a new `experimental.serverActions.bodySizeLimit` in `next.config.ts` (previously silently capped at Next's 1MB default — real uploads were failing); storage-ACL comment added; `parseLineItems.ts` caps item count/description length; `.github/dependabot.yml` added; security headers were already done as part of Phase 2 Stage 1. `README.md` updated to document all of this. Verified with `tsc --noEmit` (clean) after every edit. **Phase 3b/3c/3d not started yet.**

**Scope lock, per the owner's existing decision:** this phase refines the *existing* clients / invoices / quotations / LPOs / vendors / documents system — this is the "personal dashboard" the owner wants, built out properly rather than bolted on. It does not introduce a parallel logging system, and it does not touch Ops Hub or the shared `BOILER_SYSTEM` Supabase schema/auth. Director Hub keeps consuming that backend exactly as-is; all isolation and hardening work here happens on Director Hub's own side (code, config, one small migration) — hosting-level isolation is Phase 2's job, not this one's. Given how heavily the owner leaned on this section being planned "to the letter," the sub-phases below stay fully detailed rather than compressed.

### Objective
Take the tracker that already exists — and that the owner has confirmed *is* the "logs and progress" dashboard he wants — from "functionally present" to "something a solo operator can trust as their own admin tool," by closing verified security gaps, filling the real "dashboard" gaps that are actually missing, and removing duplicated/inconsistent UI code that accumulated as the five record types were built one at a time.

### Why this phase, specifically (grounded in the current code, not assumptions)
- No `updated_at` column exists on `clients`, `invoices`, `lpos`, or their item tables (both migration files checked).
- The Documents page has no search or filter UI. Its own `deleteDocument()` server action has no button wired to it anywhere — dead code from the UI's perspective.
- `uploadDocument()` performs no file-type or size validation, and `next.config.ts` never raises Next's default 1MB Server Action body limit — meaning most real scanned PDFs or phone photos of an LPO would silently fail to upload today.
- `director-hub` ships with no `next.config.ts` `headers()` and no `vercel.json` at all — zero custom security headers on an internet-reachable (if unlinked) admin app.
- Status badge color maps are copy-pasted verbatim in `invoices/page.tsx`, `lpos/page.tsx`, and `quotations/page.tsx`; `InvoiceBuilderForm` duplicates its own line-item UI instead of using the shared `LineItemsFieldset` component; LPOs have an `expected_delivery_date` but never got the `dueCountdown`/`dueToneClasses` treatment.
- Positive findings worth preserving, not "fixing": no Supabase service-role key appears anywhere in `src/`; the `company-documents` bucket is read via `createSignedUrl`, not public access; Next.js Server Actions already carry same-origin CSRF protection by default **(verify against the pinned `next` version in `package.json` — 16.3.6 — before relying on this as a documented security property)**; login returns a generic "Invalid email or password" with no user enumeration.

---

### Phase 3a — Security-hardening audit & fixes
Goal: verify and tighten the existing three-layer auth model (`proxy.ts` → `requireDirector()` → RLS), not replace it.

1. **Brute-force / login protection.** No app-level throttle exists on `login()` today. Enable Supabase Auth's built-in CAPTCHA (hCaptcha or Cloudflare Turnstile) as the lowest-effort, platform-native defense. Document Supabase's existing platform-level Auth rate limits as the current baseline rather than assuming they're sufficient without checking the project's Auth settings.
2. **Session/cookie settings.** Confirm (don't rebuild) that `@supabase/ssr`'s default cookie flags (`httpOnly`, `secure`, `sameSite=lax`) are in effect in production via a one-time check of response headers on the deployed `/portal/login`; record what was checked and when.
3. **Service-role key guardrail.** Verified absent from `src/` today — add a short rule to `AGENTS.md`/`CLAUDE.md` so a future feature doesn't introduce it by accident, alongside Phase 2's cookie-scoping rule.
4. **File-upload validation.** In `uploadDocument()`, add an explicit MIME-type allow-list and a max-size check before `storage.upload()`, returning a clear user-facing error. Pair with raising `experimental.serverActions.bodySizeLimit` in `next.config.ts` to a realistic ceiling (e.g., 10–15MB) — currently unset, silently capped at Next's 1MB default, a functional bug as much as a security one.
5. **Storage bucket ACL.** Verified private, served only via 5-minute signed URLs. No change needed — add a one-line comment at the bucket-access call sites noting "must stay private."
6. **PDF generation safety.** Verified: PDFs are built with `@react-pdf/renderer`, a layout engine, not an HTML/JS-based renderer — no SSRF or code-execution surface. As a low-priority, nice-to-have addition folded into the same commit as item 4 (not tracked as its own ceremony): add a simple sanity cap at the line-item parsing layer (description length, item count) purely to avoid a pathological render from a typo, not a security fix.
7. **Baseline security headers.** Add `headers()` in `next.config.ts` (or a minimal `vercel.json`) for `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, a `frame-ancestors 'none'` CSP directive, and HSTS — currently entirely absent. **This must land at the same time as Phase 2 Stage 1's rewrite removal** (see Phase 2's Stage 1 step 6) — not after — to avoid a window with zero security headers on `/portal`.
8. **Dependency hygiene.** Enable GitHub Dependabot (free, zero-maintenance) given `@supabase/supabase-js` and `@react-pdf/renderer` are actively-patched dependencies.
9. **Document the shared-backend residual risk, once, here.** Director Hub's RLS backstop calls `private.is_director()`, a function this repo doesn't define or control — it lives in Ops Hub's migrations. Write this down explicitly in `director-hub`'s `README.md`/`AGENTS.md` as an accepted, known risk, with the only mitigation being an occasional manual spot-check. **This is the single canonical write-up of the residual risk** — Phase 2d points here rather than maintaining a second, separately-worded version.

**Acceptance criteria (3a):**
- [ ] Login form has CAPTCHA wired and verified server-side; a failed/missing token is rejected.
- [ ] `uploadDocument()` rejects disallowed MIME types and oversized files with a clear message; a real multi-MB PDF uploads successfully end-to-end.
- [ ] Deployed `/portal` responses carry the new security headers, confirmed live at the same time Phase 2 Stage 1's rewrite removal lands.
- [ ] `AGENTS.md`/`CLAUDE.md` contains the service-role-key rule, the cookie-scoping rule, and the single canonical Ops Hub dependency/residual-risk note.
- [ ] No service-role key present anywhere in `src/` (re-verified, not just assumed).

---

### Phase 3b — Logs & progress tracking (gap-fill only, not a new system)
Goal: the invoice/quotation/LPO status fields plus Supabase's own timestamps already **are** the progress-tracking system here — this closes the specific, verified gaps in that existing system.

1. **Add `updated_at`.** Migration adding `updated_at timestamptz not null default now()` plus a standard trigger to `clients`, `invoices`, `invoice_items`, `lpos`, and `lpo_items` — confirmed currently missing from both migration files.
2. **Documents search.** Add a simple text filter (client/vendor name + document type) to the existing Documents list. `clients` already has a `search_vector` tsvector column with a GIN index not yet surfaced in any UI — reuse it rather than building new search infrastructure.
3. **Wire up the orphaned delete action.** `deleteDocument()` already exists but has no button calling it anywhere. Add the UI entry point (already correctly gated by `requireDirector()` server-side).
4. **Explicitly reject a custom audit-log/event-sourcing table**, an "activity feed," or a change-history UI. For a single-Director user base, `created_at`/`created_by` plus the new `updated_at` are sufficient — a bespoke event-sourcing layer here would be real over-engineering relative to the actual need.

**Acceptance criteria (3b):**
- [ ] Migration applied; every record type shows a correct, trigger-updated `updated_at` after an edit.
- [ ] Documents list can be filtered by client/vendor name and document type.
- [ ] Documents list has a working Delete action for Director-uploaded files.
- [ ] No new audit/event table introduced.

---

### Phase 3c — UI/UX consistency pass across the five record types
Goal: consolidate logic that was already written three times with small drift, not introduce a new design system.

1. **One shared `StatusBadge` component**, replacing the three independently copy-pasted `statusColors` objects.
2. **Extend the due-date countdown to LPOs** — `dueCountdown`/`dueToneClasses` is used for Invoices and the Dashboard but not LPOs, despite the directly analogous `expected_delivery_date`.
3. **Refactor `InvoiceBuilderForm` onto the shared `LineItemsFieldset`** — `LpoBuilderForm`/`QuotationBuilderForm` already use it.
4. **One shared money-formatting helper**, replacing the inconsistent inline `KES ${...}` formatting on list pages versus the Dashboard's `formatMoney()`.
5. **Reconcile list-view filtering/grouping** — define one consistent, deliberate pattern per list instead of today's ad hoc per-page choices.
6. **Document the no-hard-delete design intent.** Only `clients/[id]` currently has a `DeleteButton`. If intentional, add a one-line note on each record's detail page. *(Flagged as an open question for the owner — confirm intent before documenting it as permanent.)*

**Acceptance criteria (3c):**
- [ ] A single `StatusBadge` component is used by all list/detail views that show a status.
- [ ] LPO list/detail views show the same due-date countdown treatment as Invoices.
- [ ] `InvoiceBuilderForm` uses `LineItemsFieldset`; no duplicate line-item UI remains.
- [ ] One money-formatting helper is used across Dashboard, Invoices, LPOs, Quotations.
- [ ] Each of the 5 list views has a documented, intentional filter/grouping pattern.

---

### Phase 3d — Explicit "what NOT to build"
1. No custom audit-log / event-sourcing table (3b covers the right-sized alternative).
2. No granular role/permission system — one admin user class (Director) in scope.
3. No malware-scanning service for document uploads — a MIME/size allow-list plus private-bucket + signed-URL is the right ceiling.
4. No pagination/infinite-scroll yet — add only once a list routinely renders >~100 rows.
5. No notifications/reminders system — the Dashboard's "Overdue invoices" tile already surfaces this; email/push would be its own phase.
6. No architectural migration off Server Actions to a separate REST/GraphQL layer.
7. No automated end-to-end test suite build-out in this phase.
8. No touching Ops Hub or the shared `BOILER_SYSTEM` schema/auth.

---

### Dependencies
- No dependency on the public `powerpulse-website` phases — this phase is entirely internal to the `director-hub` repo and its Supabase migrations.
- Phase 2 Stage 1 (retiring the shared-origin proxy) is independent of this phase's content but has a hard sequencing tie to 3a-7 specifically (see Phase 2 Stage 1 step 6) — the two must ship together.
- Phase 3a and 3b have no ordering dependency on each other and can run concurrently; 3c (UI consistency) is easiest once 3b's `updated_at` column exists.

### Overall acceptance criteria for Phase 3
- [ ] All four sub-phases' individual acceptance criteria above are met.
- [ ] No new standalone logging/tracking system was introduced anywhere.
- [ ] Ops Hub / `BOILER_SYSTEM` schema and auth were not modified.
- [ ] A short written note (in this repo's `README.md` or `AGENTS.md`) records what was verified-and-kept-as-is versus what was changed.

### Open risks
- Enabling Supabase Auth CAPTCHA requires the owner to sign up with hCaptcha or Cloudflare Turnstile — an external, non-code prerequisite.
- No documented max file size / allowed file types for Documents upload — needs the owner's real-world input before a concrete limit is hardcoded.
- Whether "Cancelled status instead of delete" is the owner's intended permanent policy, versus wanting true delete-with-confirmation, is unconfirmed.
- Any change to Supabase Auth rate-limit/CAPTCHA settings applies to the shared `BOILER_SYSTEM` project used by Ops Hub too — needs the owner's sign-off before touching project-level Auth settings.
- The residual risk of RLS depending on `private.is_director()` (owned by Ops Hub) is accepted per the owner's standing decision — should be explicitly re-confirmed, not silently inherited.

---

## Phase 4 — SEO Technical Foundation

> **Key decisions**
> - Split Track B into **Track B1** (JSON-LD `legalName` fix, no `sameAs` — gated only on Phase 1's fast-tracked blocking subset) and **Track B2** (OG image + full JSON-LD enrichment — gated on the full survey and real brand/social assets), rather than treating "Phase 1" as one undifferentiated gate for both.
> - Chose `ProfessionalService` over `HomeAndConstructionBusiness` for the JSON-LD `@type`, because PowerPulse serves industrial/commercial clients rather than residential home-services customers.
> - Recommended Vercel Web Analytics over Google Analytics specifically because GA's `gtag.js` would require loosening the existing `script-src 'self'` CSP the repo deliberately built, whereas Vercel Analytics is same-origin and needs no CSP change.
> - Used the current live origin `https://frontendpowerpulse.vercel.app` as the working base for all absolute URLs rather than waiting on a custom domain purchase, and defined a bounded "domain cutover checklist" to run once a domain exists.
> - Kept `changefreq`/`priority` values realistic instead of inflated daily/weekly values.
> - Deliberately did not introduce an npm image-processing/build pipeline for the 6-image optimization pass.

**Repo:** `powerpulse-website` only (the 4 public pages: `/`, `/ourservices`, `/aboutus`, `/contactus`). Director Hub's own marketing shell and `/portal` are explicitly **out of scope** here — `/portal` must never appear in a sitemap or be indexable, which the current `robots.txt`/`X-Robots-Tag` setup already enforces. (Phase 2 changes *where* `/portal` lives, not its index-ability.)

### Why this phase exists
A file-level check confirms the public site currently ships with **zero** technical SEO scaffolding beyond its per-page `<title>`/`<meta description>` tags (already well-written and not touched in this phase):

- No `sitemap.xml` anywhere in the repo.
- No `<link rel="canonical">` on any page.
- No Open Graph or Twitter Card tags.
- No JSON-LD structured data.
- No analytics and no Search Console verification.
- `/images/*` are 6 unoptimized JPEGs — 234KB–806KB each — none resized, none in a modern format, none with explicit `width`/`height`. Alt text is already present and reasonably descriptive on every `<img>` — this audit is light-touch, not a rewrite.

### Sequencing (read this before assigning tasks)

**Track A — ship now, no dependencies.** Sitemap, robots.txt update, canonical tags, image optimization, Vercel Analytics, Search Console (interim verification).

**Cross-phase note on the sitemap:** Phase 1 edits these same 4 pages' content (contact details, footer legal mark, social icons, and the A8 history/dealer correction) around the same time this sitemap ships. Whichever lands second must bump the affected page(s)' `lastmod` in the same commit as the content edit — this is already an explicit task in Phase 1 (task 15); don't let it slip just because it's a one-line XML edit.

**Track B1 — ship as soon as Phase 1's fast-tracked blocking subset lands (not the full survey).** JSON-LD's `legalName` fix ("PowerPulse Dynamics Ltd") depends only on the 4-5 fast-tracked facts (legal name, A8's history/dealer correction) — not on certifications, case studies, or the rest of the long-form survey. Ship `sameAs`-free JSON-LD with the corrected `legalName` as its own small commit here, rather than waiting for Track B2.

**Track B2 — ship once the full Survey v2 is answered and brand assets exist.** The OG share image needs a real, branded 1200×630 asset (`brand_color`, `tagline`, `business_name`, an actual logo/photo) — these live in the slower, full-survey track. `sameAs` needs PowerPulse's own live social accounts. Full JSON-LD richness (`address`, `openingHoursSpecification`) likewise waits on survey answers. Treat B1 and B2 as unlocking on different tracks, not as one "Phase 1" gate.

**Domain is not a hard blocker.** Both repos are on `*.vercel.app` today — the live production origin is `https://frontendpowerpulse.vercel.app`. Because this is a zero-build-step static site, every absolute URL has to be a literal string in a committed file. Rather than wait on a domain purchase, build Track A now against `frontendpowerpulse.vercel.app` and run the bounded "domain cutover checklist" below the day a custom domain goes live (shared trigger with Phase 2 Stage 2).

### Deliverables

**1. `sitemap.xml`** at the repo root, listing exactly the 4 real public clean URLs — explicitly excluding `/onboarding-2026` and `/portal`. Realistic `changefreq`/`priority`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://frontendpowerpulse.vercel.app/</loc>
    <lastmod>2026-09-28</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://frontendpowerpulse.vercel.app/ourservices</loc>
    <lastmod>2026-09-28</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://frontendpowerpulse.vercel.app/aboutus</loc>
    <lastmod>2026-09-28</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://frontendpowerpulse.vercel.app/contactus</loc>
    <lastmod>2026-09-28</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
```

`lastmod` dates above match each page's actual last-edit commit date (verified via `git log`) as of this writing — **these will go stale the moment Phase 1's edits land**, per the cross-phase note above. The rule going forward: bump a page's `lastmod` only when its content actually changes, in the same commit.

**2. `robots.txt` update** — add the sitemap pointer, change nothing else until Phase 2 Stage 1's cutover removes the `/portal` line:

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /onboarding-2026
Disallow: /portal

Sitemap: https://frontendpowerpulse.vercel.app/sitemap.xml
```

**3. Canonical tags** — one `<link rel="canonical">` per page, pointing at its own clean URL. `onboarding-2026.html` gets **no** canonical tag (already `noindex, nofollow`).

**4. Open Graph + Twitter Card tags** — reuse the existing `<title>`/`<meta description>` copy verbatim; ship the mechanical fields now, leave `og:image` as a placeholder path until Track B2 produces the real branded asset:

```html
<meta property="og:type" content="website">
<meta property="og:site_name" content="PowerPulse">
<meta property="og:title" content="PowerPulse | Thermal Engineering — Kenya">
<meta property="og:description" content="PowerPulse — thermal engineering for industry: boilers, burners, steam systems and combustion.">
<meta property="og:url" content="https://frontendpowerpulse.vercel.app/">
<meta property="og:image" content="https://frontendpowerpulse.vercel.app/images/og-cover.jpg"> <!-- TODO Track B2: real branded 1200x630 asset -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="PowerPulse | Thermal Engineering — Kenya">
<meta name="twitter:description" content="PowerPulse — thermal engineering for industry: boilers, burners, steam systems and combustion.">
<meta name="twitter:image" content="https://frontendpowerpulse.vercel.app/images/og-cover.jpg">
```
(Repeat per page.) Note the description above drops "across Kenya & East Africa" pending Phase 1's `service_area_radius` confirmation — don't ship an unverified area claim into new SEO surface area either.

**5. JSON-LD structured data** — `ProfessionalService`, not `HomeAndConstructionBusiness` (PowerPulse serves industrial/commercial clients, not residential home-services customers). Ship in **Track B1**, as soon as the fast-tracked facts land:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "PowerPulse",
  "legalName": "PowerPulse Dynamics Ltd",
  "url": "https://frontendpowerpulse.vercel.app/",
  "telephone": "+254721170470",
  "areaServed": ["Kenya", "East Africa"],
  "description": "Thermal engineering for industry: boilers, burners, steam systems and combustion."
}
</script>
```
Note: `areaServed` above carries forward the same unverified "Kenya & East Africa" claim Phase 1 flags — correct it here too once `service_area_radius` is answered, in the same commit as the OG description fix. Extend with `address` (PostalAddress), `openingHoursSpecification`, `image`, and `sameAs` as part of **Track B2**, once, respectively: the full content survey returns a real address/hours, the brand/OG image exists, and PowerPulse has its own live social accounts. Do not add `sameAs` pointing at any Boiler Techniques account under any circumstance, including "temporarily."

**6. Image optimization pass** — one-time manual conversion, not a build pipeline:
- Resize each of the 6 source photos to the actual max render width used on the page. **(Verify in code before building: audit current CSS container/`max-width` rules in `css/style.css` first. A check during this planning pass did not turn up an obvious confirming container-width rule, so don't assume any specific rendered-width figure until this is checked directly.)**
- Convert to WebP; keep `.jpg` originals in git history, not in `/images`.
- Add explicit `width`/`height` attributes matching each resized image's intrinsic dimensions (currently sized only via inline `style="width:100%;height:100%"`, which gives no aspect-ratio hint and risks layout shift).
- Add `loading="lazy"` to every image below the fold; leave the hero/first-visible image eager.
- Alt text: already present and descriptive — carry existing alt strings over unchanged.
- Tooling: a local one-off run of `squoosh-cli` or `sharp-cli` is enough for 6 images — no npm dependency or build step.

**7. Analytics — Vercel Web Analytics, explicitly not Google Analytics.** The README documents a deliberate "zero third-party CDNs" design and `vercel.json`'s CSP is `script-src 'self'` with no external script domains allow-listed. GA's `gtag.js` would require reopening `script-src`/`connect-src` to two new third-party origins — undoing hardening already done once. Vercel Web Analytics is same-origin (`/_vercel/insights/script.js`), needs zero CSP changes, and is cookieless by default. Add the one script tag to all 4 public pages; skip it on `onboarding-2026.html`.

**8. Search Console** — verify via `<meta name="google-site-verification">` and submit `sitemap.xml`. A Search Console property is tied to the exact origin it was verified against — when a custom domain goes live, this is a **new property**, not a migration; re-verify there and leave the `frontendpowerpulse.vercel.app` property idle afterward.

### Domain cutover checklist (run once, whenever a custom domain goes live — shares its trigger with Phase 2 Stage 2)
1. Set the real domain as `SITE_URL` in Vercel env vars.
2. Find/replace `frontendpowerpulse.vercel.app` → new domain in: `sitemap.xml`, `robots.txt`'s `Sitemap:` line, all 4 `canonical`/`og:url`/`twitter` absolute URLs, the JSON-LD `url` field.
3. Re-verify Search Console on the new domain; submit the sitemap there.
4. Confirm the CSP in `vercel.json` still matches `self` correctly against the new origin.

### Acceptance criteria
- [ ] `sitemap.xml` live at `/sitemap.xml`, lists exactly 4 URLs, validates against the sitemaps.org schema, referenced from `robots.txt`.
- [ ] Sitemap `lastmod` values are bumped in the same commit as any Phase 1 content edit to the corresponding page.
- [ ] Every public page has exactly one self-referencing canonical tag; `onboarding-2026.html` has none.
- [ ] Every public page has complete OG + Twitter Card tags; `og:image`/`twitter:image` point at a real branded asset (Track B2) before tag #4 is marked done, even though the markup ships earlier (Track A).
- [ ] JSON-LD validates with zero errors in Google's Rich Results Test, contains the corrected `legalName` (Track B1), and no `boilertechniques` string anywhere.
- [ ] All 6 images served as resized WebP, each `<img>` has explicit `width`/`height`, below-fold images are lazy-loaded — sizing confirmed against actual container widths, not assumed.
- [ ] Lighthouse/PageSpeed Insights mobile performance score improves measurably over the pre-phase baseline.
- [ ] Vercel Web Analytics reporting live traffic; no CSP violation reports from the analytics script.
- [ ] Search Console property verified, sitemap submitted and showing "Success," 0 "Excluded" pages that should be indexed.

### Explicitly out of scope for this phase
- Any content rewrite of titles/meta descriptions.
- The onboarding survey rebuild (Phase 1).
- Director Hub's own SEO/indexing posture.
- Subdomain/architecture changes for admin-vs-public isolation (Phase 2).
- Purchasing/configuring a custom domain.

### Open risks
- JSON-LD's `legalName` fix (Track B1) depends on Phase 1's fast-tracked subset actually landing — if that slips, Track B1 slips with it, though Track A is unaffected.
- The OG share image and full JSON-LD richness (Track B2) depend on the full survey being answered and real brand/social assets existing — timeline outside this phase's control.
- PowerPulse does not yet have its own social media accounts; `sameAs` stays empty until the client creates them.
- `ProfessionalService` vs. a more specific schema.org subtype is a judgment call made here without the client's input — worth a quick confirmation before shipping.
- Exact timing of the custom domain purchase is unknown and external to this plan (shared with Phase 2 Stage 2); every absolute URL shipped in Track A will need a one-time manual find/replace pass whenever that happens.
- The image-container-width figure used to size the optimization pass is unverified pending a direct CSS check — don't let the placeholder number above become load-bearing without that check.

---

## Out of scope for this entire plan

**Ops Hub and the shared `BOILER_SYSTEM` Supabase backend are out of scope for every phase above, and deliberately so.** Ops Hub is a separate sibling application (`../ops-hub`) not present on this machine, whose contents are unknown beyond what Director Hub's own migrations reveal about the tables and functions it owns (`profiles`, `departments`, `company_settings`, the `company-documents` bucket, Director-role auth, and the `private.is_director()` RLS function). The owner has already made this call: Director Hub consumes that backend as-is, and no phase in this roadmap proposes modifying, splitting, migrating, or duplicating its schema, auth tables, or Auth project-level configuration beyond the narrow, explicitly-flagged exceptions above (adding a redirect-URL entry in Phase 2's Stage 2, and enabling Auth CAPTCHA in Phase 3a-1 — both touch only a setting, never the schema, and both need the owner's explicit sign-off precisely because the setting is shared with Ops Hub).

The reason is practical, not just deferential: nobody working on this roadmap has visibility into Ops Hub's own codebase, release schedule, or who else depends on it. Instead, every phase above treats the shared backend as a fixed boundary and documents, in one canonical place (Phase 3a-9, referenced by Phase 2d), the one real consequence of that boundary: Director Hub's auth backstop ultimately depends on a function Ops Hub owns, and no amount of hosting-level isolation (Phase 2) or in-app hardening (Phase 3) changes that.