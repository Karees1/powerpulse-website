# Prompt for the next session

Paste this as the first message in a new or post-compaction session to pick
up the PowerPulse project accurately, without re-deriving or guessing at
anything already established.

---

We're continuing work on the **PowerPulse** project (PowerPulse Dynamics
Ltd — a real thermal-engineering business in Nairobi, Kenya). This spans two
git repos plus a shared Supabase backend.

**Before doing or assuming anything, read these in order:**
1. `C:\Users\Mustafa\DevOps\projects\powerpulse-website\CLAUDE.md` — full
   project identity, confirmed real business facts, phase-by-phase status,
   and specific mistakes already made once this session (don't repeat them).
2. `PLANNING.md` in the same repo — full phase detail, reasoning, and
   acceptance criteria for everything.
3. If the task touches `director-hub`, its own `CLAUDE.md` points back to
   the file above — read both before editing anything there.

**Where things stand:** Phase 1 (brand separation + content survey),
Phase 2 Stage 1 (security/subdomain isolation), and all of Phase 3 (3a
hardening, 3b real data + documents search/delete, 3c UI consistency) are
built, merged to `master` in both repos, and verified live on production —
not just "the build succeeded," actually checked against the real deployed
sites. Phase 4 (SEO) has not started; it's fully designed already in
`PLANNING.md`'s Phase 4 section.

**Two open items worth checking before starting anything new:**
- The authenticated `/portal` dashboard (documents search/delete, the
  updated Phase 3c list pages) has never been visually verified by anyone —
  no test Director credentials were available to verify it directly. If you
  have real login access now, check that first before building more on top
  of it.
- 5 Dependabot PRs are open on `director-hub` (routine dependency bumps);
  one (`react-dom` 19.2.8→19.3.0) failed its build. Not investigated — low
  priority unless asked about directly.

**Ground rules already learned the hard way this session** (full detail in
CLAUDE.md's "hard-won lessons" section — read it, don't skip it):
verify database state with a direct query, never trust cached row counts;
`director-hub` has a generic public `/` that's deliberately separate from
the real `/portal` dashboard — don't mistake one for the other being
broken; after any deploy, check the actual live site/response, not just
that the build succeeded; each public page has two separate WhatsApp links
if phone/contact info ever needs touching again.

**Default next task, unless told otherwise:** start Phase 4 (SEO) per the
plan already written in `PLANNING.md`.
