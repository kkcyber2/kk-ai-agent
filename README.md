# Social Media Assistant

A dashboard for managing messages across Facebook, Instagram, LinkedIn, Twitter
and WhatsApp from one inbox, with AI-drafted replies, per-platform settings and
a monitoring loop that polls for new messages.

- **Client** — React + TypeScript + Vite + Tailwind, shadcn/ui components
- **Server** — Express + TypeScript, Supabase for storage, OpenAI for drafts

## Layout

```
src/            React client
server/src/     Express API
server/test/    API and configuration tests
supabase/       SQL migrations
```

## Requirements

- Node.js 18 or newer
- A Supabase project (optional — the server boots and answers without one)

## Running locally

```bash
npm install
cd server && npm install && cd ..

cp .env.example .env                 # client: Supabase URL + publishable key
cp server/.env.example server/.env   # server: Supabase + platform OAuth apps

npm run dev                          # client on :8080
cd server && npm run dev             # API on :3001
```

### Configuration

The server starts without any environment variables. Routes that need Supabase
return a clear error rather than crashing the process, and `/api/health` always
answers — so you can confirm the process is up before wiring credentials.

| Variable | Needed for |
|---|---|
| `SUPABASE_URL`, `SUPABASE_ANON_KEY` | Any data route |
| `OPENAI_API_KEY` | AI-drafted replies and sentiment |
| `INSTAGRAM_*`, `FACEBOOK_*`, `LINKEDIN_*`, `TWITTER_*` | Connecting each platform |
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` | Client build |

The publishable (anon) key is designed to ship in browser bundles; row-level
security is what protects the data. Never put a service-role key in the client.

## Tests

```bash
cd server && npm test
```

11 tests: health and 404 behaviour over real HTTP, malformed JSON returning 400
instead of 500, oversized bodies, helmet security headers, and the
database-configuration paths (missing vars, present vars, actionable error
message, initialisation resolving without a database). Type checking runs as
`npx tsc --noEmit`.

## Database

Apply `server/supabase/migrations/001_initial_schema.sql` to your Supabase
project, then set `project_id` in `supabase/config.toml` before using the
Supabase CLI.

## Licence

MIT — see `LICENSE`. Author: Konain Sultan Khan (KK),
https://github.com/kkcyber2
