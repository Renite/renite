-- BE-011: Fayda-compatible identity verification
-- Stores verification state/evidence, not raw Fayda QR payloads or face images.

create table if not exists public.identity_verifications (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null references public.profiles(id) on delete cascade,

  verification_status text not null default 'pending'
    check (verification_status in (
      'pending',
      'verified',
      'failed',
      'expired',
      'revoked'
    )),

  signature_verified boolean not null default false,

  verified_at timestamptz,
  retention_until timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists identity_verifications_user_id_idx
  on public.identity_verifications(user_id);

create index if not exists identity_verifications_status_idx
  on public.identity_verifications(verification_status);

create index if not exists identity_verifications_retention_idx
  on public.identity_verifications(retention_until);

-- Enable Row Level Security.
alter table public.identity_verifications enable row level security;

-- Users can see their own verification status.
create policy "Users can view own identity verification"
on public.identity_verifications
for select
to authenticated
using (auth.uid() = user_id);

-- Users cannot directly insert verification results.
-- Verification results must come from trusted backend/server logic.

-- Users cannot directly update verification results.
-- Verification results must come from trusted backend/server logic.

-- Users cannot directly delete verification records.
-- Retention/deletion is handled by trusted backend/server logic.