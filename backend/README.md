# Renite Backend

Express 5 API backed by Supabase (Postgres + Auth). The frontend
authenticates directly against Supabase Auth (`supabase.auth.*`); this
backend verifies that same session token server-side via
`supabase.auth.getUser()` using the service-role key, then applies its
own authorization logic before touching data (the service-role key
bypasses RLS, so the app code is the real gate, not Postgres policies).

## Setup

```bash
npm install
cp .env.example .env   # fill in SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
```

Run the migration in `migrations/001_verifications_admin_rls.sql`
against your Supabase project before starting the server (Supabase
dashboard SQL editor, or `supabase db push`). It adds the `verifications`
table, `profiles.is_active`, and tightens RLS on `profiles`/`devices`/
`broadcasts` (previously wide open to the anon key).

```bash
npm run dev
```

## Test

```bash
npm test
```

See `tests/TESTS_TODO.md` — most of the suite needs rebuilding against
Supabase rather than the old in-memory Mongo instance.

## Health check

```
GET /api/health
```

## What's NOT here

`Match`, `Category`, `Material`, `RecoveryParticipant`, `Notification`
from the original Mongo model set were dropped — no corresponding
Postgres tables exist. If any of that functionality is still wanted,
it needs its own migration + table design first.
