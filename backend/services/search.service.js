import { supabaseAdmin } from '../config/supabase.js';
import { toAppError } from '../utils/errors.js';

// Searches across the three public-facing report tables. Kept simple
// (ilike on the obvious text columns) -- no cross-table ranking, just
// three parallel queries merged by type.
export const searchService = {
  async search({ q, limit = 10 } = {}) {
    const term = (q || '').trim();
    if (!term) return { emergency_reports: [], stolen_assets: [], cases: [] };

    const [emergency, assets, cases] = await Promise.all([
      supabaseAdmin.from('emergency_reports').select('*')
        .or(`full_name.ilike.%${term}%,details.ilike.%${term}%,last_seen_location.ilike.%${term}%`)
        .order('created_at', { ascending: false }).limit(Number(limit)),
      supabaseAdmin.from('stolen_assets').select('*')
        .or(`asset_name.ilike.%${term}%,description.ilike.%${term}%,serial_number.ilike.%${term}%`)
        .order('created_at', { ascending: false }).limit(Number(limit)),
      supabaseAdmin.from('cases').select('*')
        .or(`title.ilike.%${term}%,description.ilike.%${term}%`)
        .order('created_at', { ascending: false }).limit(Number(limit))
    ]);

    if (emergency.error) throw toAppError(emergency.error);
    if (assets.error) throw toAppError(assets.error);
    if (cases.error) throw toAppError(cases.error);

    return {
      emergency_reports: emergency.data,
      stolen_assets: assets.data,
      cases: cases.data
    };
  }
};
