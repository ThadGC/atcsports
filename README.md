# ATC Sports

Website and parent-account system for ATC Sports: youth flag football, 7-on-7 and skills
camps in Roseville, California.

Two parts:

| Path      | What it is                                                          |
| --------- | ------------------------------------------------------------------- |
| `/`       | React + Vite front end, prerendered to static HTML                   |
| `/server` | Express API for accounts, athletes and contact messages              |

---

## Running it

Two terminals.

**API** (port 4000):

```bash
cd server && npm install && cp .env.example .env && npm start
```

**Site** (port 5173):

```bash
npm install && npm run dev
```

Open http://localhost:5173.

---

## Content

Every fact on the site (dates, prices, divisions, rules, field addresses, phone number)
lives in [`src/data/site.js`](src/data/site.js). Change it there and it updates everywhere.
Nothing is hardcoded into a page.

The copy only claims what ATC actually offers. Season dates, fees, refund terms, 7-on-7
rules and camp details were taken from the existing league site verbatim.

---

## Build

```bash
npm run build
```

This does three things:

1. Writes `public/sitemap.xml`
2. Builds the Vite bundle
3. Prerenders every public route to static HTML (`scripts/prerender.mjs`)

Prerendering is why each page ships a real `<title>`, meta description, canonical URL and
full body copy without running JavaScript. The app mounts with `createRoot`, not
`hydrateRoot`, so the static HTML only has to be correct; it never has to match the client
render byte for byte, which removes hydration mismatch as a class of bug.

Output is `dist/`, with clean URLs as directory indexes (`dist/flag-football/index.html`)
and a real `dist/404.html`.

**Do not add a SPA catch-all rewrite** (`/* -> /index.html`). It would serve the homepage's
HTML for every route and discard the per-page metadata. `netlify.toml` and `vercel.json` are
already configured correctly.

### Checking a build locally

```bash
node scripts/serve.mjs          # serves dist/ the way a real static host does
BASE=http://localhost:4180 npm run audit
BASE=http://localhost:4180 npm run e2e
```

`npm run audit` walks every page at 390px, 834px and 1440px and fails on horizontal
overflow, broken images, missing alt text, missing or duplicated titles and meta
descriptions, wrong `<h1>` counts, and JS errors. `npm run e2e` drives the real signup,
login, athlete and contact flows.

---

## The API

Express, cookie-based sessions, `bcrypt` at 12 rounds, `zod` validation on every input,
rate limits on the credential and contact endpoints.

| Method | Route                  | Auth | Purpose                        |
| ------ | ---------------------- | ---- | ------------------------------ |
| GET    | `/api/health`          | No   | Status and active DB driver    |
| POST   | `/api/auth/register`   | No   | Create a parent account        |
| POST   | `/api/auth/login`      | No   | Start a session                |
| POST   | `/api/auth/logout`     | No   | End a session                  |
| GET    | `/api/auth/me`         | No   | Current user, or `null`        |
| GET    | `/api/athletes`        | ✓    | List your athletes             |
| POST   | `/api/athletes`        | ✓    | Add an athlete                 |
| DELETE | `/api/athletes/:id`    | ✓    | Remove one of your athletes    |
| POST   | `/api/contact`         | No   | Store a contact message        |

Sessions are JWTs in an `httpOnly` cookie, so page scripts can never read them. Login
returns the same message for an unknown email and a wrong password, so the endpoint cannot
be used to discover which parents have accounts. Athlete routes are scoped to the signed-in
user, so one account cannot read or delete another's records.

### Connecting a database

The API ships with two interchangeable adapters behind one interface
([`server/src/db/`](server/src/db)):

- **`json`** (default) writes to `server/data/db.json`. Everything works with no database.
- **`postgres`** is used automatically as soon as `DATABASE_URL` is set.

To switch:

```bash
# server/.env
DATABASE_URL=postgresql://user:password@host:5432/atcsports
```

```bash
cd server && npm run db:migrate   # applies src/db/schema.sql
```

No application code changes. The tables are defined in
[`server/src/db/schema.sql`](server/src/db/schema.sql): `users`, `athletes` and
`contact_messages`, with cascading deletes and the indexes the queries need.

### Before going live

1. Set a real `JWT_SECRET`. The server refuses to boot in production without one:
   ```bash
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```
2. Set `CORS_ORIGINS` to the live site's origin.
3. Set `NODE_ENV=production`, which switches the session cookie to `Secure`.
4. Point `VITE_API_URL` at the deployed API and rebuild the front end.

Contact messages are stored in the database but nothing emails them yet. When ATC picks a
provider, the hook is [`server/src/routes/contact.js`](server/src/routes/contact.js). The
record is already saved before that runs.

---

## Design

Black `#050505` and metallic gold `#D9B86C`, carried over from the existing ATC identity.
Display type is Anton, body is Plus Jakarta Sans. Photography and logos are the league's own.

- Layouts are fluid: type scales with `clamp()`, so nothing overflows between breakpoints
- Card surfaces use a nested outer-tray/inner-plate treatment rather than flat borders
- Motion is `transform` and `opacity` only, with a failsafe so content can never be stuck invisible
- `prefers-reduced-motion` disables animation throughout
- The closed mobile menu is `inert`, keeping it out of the tab order and the a11y tree

Tailwind's opacity scale is extended to every integer in
[`tailwind.config.js`](tailwind.config.js). Without it, a modifier like `bg-ink/92` silently
emits no CSS.
