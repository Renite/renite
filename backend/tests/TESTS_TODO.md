# Test suite status

The previous Mongo-based test suite (`profile.test.js`, `report.test.js`,
`verification.test.js`, `conversation.test.js`, `message.test.js`,
`search.test.js`) tested Mongoose models and a custom-JWT auth flow that
no longer exist after the Supabase migration. Rather than leave them
red, they were removed. `health.test.js` (no DB dependency) was kept
and updated to match the new health-check message.

## Rebuilding the suite against Supabase

These now need integration tests against a real (or mocked) Supabase
project instead of an in-memory Mongo instance:

- `auth.service.js` — completeProfile (role always forced to 'user'),
  lookupEmailByFaydaId
- `profile.service.js` — getMyProfile/updateMyProfile (field allowlist)
- `admin.service.js` — updateRole, setActive (+ auth ban sync),
  createStaff (+ rollback on profile-insert failure)
- `report.service.js` — emergency reports, stolen assets, devices
  (own-user scoping)
- `case.service.js` — list scoping (privileged vs owner-only)
- `verification.service.js` — status transitions (PENDING -> VERIFIED/REJECTED,
  can't re-review)
- `search.service.js` — cross-table search

Options: point TEST_SUPABASE_URL/TEST_SUPABASE_SERVICE_ROLE_KEY at a
disposable Supabase project and truncate tables between tests, or mock
`@supabase/supabase-js` at the module level. Given the number of
service-role calls, a real disposable project will catch RLS/schema
drift that mocks won't.
