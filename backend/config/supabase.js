import { createClient } from '@supabase/supabase-js';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars. ' +
    'The backend uses the service-role key to bypass RLS and enforce ' +
    'authorization in application code instead -- see middleware/auth.middleware.js.'
  );
}

// Service-role client: bypasses RLS entirely. Every route that uses this
// MUST do its own authorization check (authenticate/authorize/can) before
// touching data -- RLS is not a backstop here, the app code is.
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);
