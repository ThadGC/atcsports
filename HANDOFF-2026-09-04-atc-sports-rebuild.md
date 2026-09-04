# ATC Sports — handoff 2026-09-04

> Paste this whole file into a new chat. It is self-contained.
> Supersedes: none (first handoff for this project)

## 0. Rules that bite

**The user's attached images never reach the filesystem.** They arrive as image data in
the conversation. You cannot write them to disk. Three separate searches of `~/Downloads`,
`~/Desktop`, `~/Pictures`, `~/Library/Containers`, `/tmp` and `/var/folders` found nothing.
If an image is needed as a file, say so in one line and give the command below — do not
quietly substitute a different photo. Doing that once cost a lot of trust.

**Measure before adjusting anything visual.** Guessing at crops and paddings cost several
rounds. Two traps already hit:
- `logo-wide.png` had **235px of transparent padding baked into its left edge** (a fifth of
  the image). Three CSS nudges did nothing. The fix was trimming the PNG. Check alpha bounds
  before touching CSS alignment.
- A phone hero fits a wide photo **by height**, so it crops only sideways. `object-position`
  vertical does nothing there. The only lever on a subject's vertical position is cropping
  the source file. See `scripts/hero-mobile.mjs`.

**Tailwind only reads literal class strings.** `'lg:' + x.join(' lg:')` silently generates
nothing. Every responsive class must be written out in full.

**Tailwind opacity is extended to every integer** in `tailwind.config.js`. Without it,
`bg-ink/92` emits no CSS at all and fails silently. 131 classes were broken by this.

**Never animate a pseudo-element with `transform: translate(100%)`.** A leftover
`@keyframes` doing that added ~1350px of horizontal scroll to every page. Animate
`background-position` for sweeps instead.

**Stacking contexts trap dropdowns.** Any ancestor with a `transform`, a `filter` or its
own `z-index` forms one, and a child's `z-index` cannot escape it. `Reveal` used to do
this permanently; it now drops both once the entry animation ends. The `Select` panel is
portalled to `<body>` for the same reason. If a new overlay paints underneath something,
this is why.

**Running the suites repeatedly trips the API rate limiter** (300 requests / 15 min).
Every page load calls `/api/auth/me`. A wave of 429s in the audit means restart the API,
not that the site broke.

**Be careful with bulk CSS deletion.** An over-broad "remove dead CSS" pass deleted
`.glass` and `.bezel` along with the intended block, silently killing the floating navbar
and every card treatment. The user spotted it before the tests did.

**Copy rules:** no em dashes or en dashes anywhere (site, README, server comments, docs).
Zero currently. Never invent a fact about the league — every date, fee, division, rule and
address came from atcfootball.com verbatim and lives in `src/data/site.js`.

## 1. Where things stand

A complete React site for ATC Sports (youth flag football, Roseville CA) replacing their
TeamLinkt-hosted page, plus an Express API for parent accounts. 12 routes, prerendered to
static HTML. All verification suites pass: 22/22 checklist, responsive clean across 12
pages × 3 widths, menu 8/8, E2E 16/16, buttons all centred, listbox behaviour, no JS
errors. Working tree clean, pushed to
`main` at `072b7b9`. Nothing is deployed — there is no live site.

## 2. What was done this session

- **Front end** (`src/`): 12 pages on the league's black/gold identity using their own
  photography and logo. Every fact in `src/data/site.js`.
- **Prerendering** (`scripts/prerender.mjs`): replaced `vite-react-ssg`, whose loader
  manifest hash came out `undefined` on both Vite 7 and 8 and crashed the production
  bundle. App now mounts with `createRoot`, so hydration mismatch cannot occur.
- **API** (`server/`): cookie sessions, bcrypt 12 rounds, zod validation, rate limits.
  Two interchangeable DB adapters — JSON file by default, Postgres the moment
  `DATABASE_URL` is set. Schema in `server/src/db/schema.sql`.
- **Carried over from the old site**: uniform sizing guide (rebuilt as an interactive tool
  with a body diagram, not a re-embedded image), Schedule, Standings, all 71 real teams
  across 9 divisions.
- **Client document**: `docs/parent-accounts.html` → `npm run pdf`. Also published as an
  artifact at https://claude.ai/code/artifact/65446824-231e-42c3-a2e0-2d4d1cfb46a9
- **Custom listbox** (`src/components/Select.jsx`): replaced all three native selects.
  Portalled to `<body>`, flips above the trigger when short of room, full keyboard
  support including type-ahead.
- **Buttons**: `.btn` centres its content, so any stretched button is centred.
  `scripts/btn-center.mjs` enforces it across 11 pages × 3 widths.
- **Verification harness** (`scripts/`): `checklist.mjs`, `shots.mjs`, `menu-test.mjs`,
  `e2e.mjs`, `lb.mjs`, `btn-center.mjs`, `sel.mjs`, `mobile-check.mjs`, `tap.mjs`,
  `demo-login.mjs`.
- **Asset generators**: `logo-alpha.mjs`, `hero-mobile.mjs`, `stadium.mjs`,
  `crop-flyer.mjs`, `use-stadium.mjs`.

## 3. What is NOT done

- **The stadium backdrop is a placeholder.** The user sent their own image four times; it
  never reached disk. `public/img/stadium.jpg` is currently generated by
  `scripts/stadium.mjs`. Their file drops in with `npm run stadium` — no code change.
  **This is the top open item and the user is frustrated about it.**
- **No password reset.** Needs email first. Real gap before a live season.
- **No email sending.** Contact messages are stored, never delivered. No provider chosen.
- **No league-side admin view.** Roles (parent/coach/admin) exist in the schema; no screen
  is built on them.
- **Database is a JSON file.** Fine for demo, not for a live season.
- **Payment stays on TeamLinkt.** By design, not a gap.
- **Scores/Standings have no results.** Winter 2026 has not started (opens 14 Nov 2026).
  The old site's tables are empty too. No results were invented.
- **Not deployed anywhere.** `netlify.toml` and `vercel.json` are configured but unused.
- **Unverified:** nothing has been checked on a real phone or tablet, only emulated
  viewports in Playwright.

## 4. The next concrete step

Ask Thadeus to save the stadium photo to `~/Downloads`, then run:
`cd /Users/thadeusgous/Documents/ATCsports && npm run stadium && npm run build`

## 5. How to build / run / verify

```bash
# API (port 4000) — first run needs: cp .env.example .env
cd /Users/thadeusgous/Documents/ATCsports/server && npm install && npm start

# Site (port 5173)
cd /Users/thadeusgous/Documents/ATCsports && npm install && npm run dev

# Demo account for the logged-in area
cd server && npm run seed          # demo@atcsports.test / atcdemo2026

# Production build (sitemap + vite + prerender)
npm run build

# Serve the build the way a real static host does, then verify against it
node scripts/serve.mjs             # port 4180
BASE=http://localhost:4180 node scripts/checklist.mjs    # 22 common failure modes
BASE=http://localhost:4180 node scripts/shots.mjs        # 12 pages x 390/834/1440
BASE=http://localhost:4180 node scripts/menu-test.mjs    # mobile + tablet nav
BASE=http://localhost:4180 node scripts/e2e.mjs          # signup, login, athletes, contact
BASE=http://localhost:4180 node scripts/lb.mjs           # gallery lightbox
BASE=http://localhost:4180 node scripts/btn-center.mjs   # no off-centre buttons
BASE=http://localhost:4180 node scripts/sel.mjs          # custom dropdown

# Swap in a supplied backdrop photo
npm run stadium -- /path/to/photo.jpg && npm run build

# Rebuild the client PDF after editing docs/parent-accounts.html
npm run pdf
```

Do **not** add a SPA catch-all rewrite. It would serve the homepage's HTML for every
route and discard the per-page metadata the prerender exists to produce.

## 6. Open questions for the human

- **Thadeus:** can you save the stadium photo to `~/Downloads`? It is the only blocker on
  the backdrop.
- **Thadeus:** is `docs/parent-accounts.html` wording right for this client, particularly
  the status labels (Working / Needs ATC / Not built)? Those are my framing.
- **Thadeus / the client (AJ Barnett, ATC Sports president):** does ATC want a league-side
  admin view, or are they happy staying in TeamLinkt for that?
- **The client:** which email provider, in ATC's name? Password reset and contact
  notifications both depend on it.
- **The client:** ATC publishes no email address anywhere. Is there one to use, or does the
  contact form stay the only inbound path?
- **Hannes:** hosting and deploy when it gets there. Nothing is deployed and I will not
  deploy it.

## 7. Hard rules

May: read, write and edit code, run tests, run builds and local dev servers,
git commit, git push / open PRs.
MUST STOP AND ASK before: deploying to live or production; touching a live database or
live client data. Deploys are Hannes's job.
Never write a credential into any file. Never invent a fact.
