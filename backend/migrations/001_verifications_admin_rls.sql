-- Migration 001: verifications table, admin is_active flag, RLS lockdown
-- Run this against the Supabase project (SQL editor or `supabase db push`).

-- ============================================================
-- 1. profiles.is_active  (BE-012 deactivate-user support)
-- ============================================================
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

-- ============================================================
-- 2. verifications table (did not exist previously)
-- ============================================================
CREATE TABLE IF NOT EXISTS verifications (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id       uuid REFERENCES cases(id) ON DELETE SET NULL,
  report_type   text NOT NULL CHECK (report_type IN ('emergency_report', 'stolen_asset')),
  report_id     uuid NOT NULL,
  method        text NOT NULL DEFAULT 'MANUAL'
                  CHECK (method IN ('MANUAL', 'IMAGE', 'SERIAL_NUMBER', 'OWNERSHIP_PROOF', 'ADMIN_REVIEW')),
  status        text NOT NULL DEFAULT 'PENDING'
                  CHECK (status IN ('PENDING', 'VERIFIED', 'REJECTED')),
  evidence_url  text,
  notes         text,
  reviewed_by   uuid REFERENCES profiles(id),
  verified_at   timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS verifications_status_idx ON verifications(status);
CREATE INDEX IF NOT EXISTS verifications_case_id_idx ON verifications(case_id);

ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;

-- No anon/authenticated policies at all: verifications are only ever
-- read/written by the backend using the service-role key (mirrors
-- audit_logs, which has the same "no client policy" shape already).

-- ============================================================
-- 3. Lock down profiles (currently USING (true) / WITH CHECK (true)
--    for ALL commands -- anyone with the anon key can read/write
--    every profile today, including fayda_id, phone, emergency
--    contacts). Replace with owner-only access; profile creation
--    and role changes now go through the backend service-role
--    client, which enforces the role-escalation rules in code.
-- ============================================================
DROP POLICY IF EXISTS "Enable all access for profiles" ON profiles;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Intentionally no INSERT/DELETE policy: profile creation happens via
-- POST /api/v1/auth/complete-profile (service-role, forces role='user'
-- unless the actor calling it is an admin). Deletion is not supported
-- from the client.

-- ============================================================
-- 4. Lock down devices (same USING(true)/WITH CHECK(true) problem --
--    exposes every device's recovery_token to the anon key).
-- ============================================================
DROP POLICY IF EXISTS "Enable all access for devices" ON devices;

CREATE POLICY "Users can manage own devices"
  ON devices FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admin/inventory views go through the backend (service-role, bypasses
-- RLS, application code checks role = admin).

-- ============================================================
-- 5. Fix broadcasts INSERT policy -- "Allow authenticated insert" is
--    actually public (roles: public, WITH CHECK true), same open
--    problem as profiles/devices had. Restrict to police/admin, same
--    pattern as the existing announcements policy.
-- ============================================================
DROP POLICY IF EXISTS "Allow authenticated insert" ON broadcasts;

CREATE POLICY "Police can insert broadcasts"
  ON broadcasts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = ANY (ARRAY['police'::text, 'admin'::text])
    )
  );
