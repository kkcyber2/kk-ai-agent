import { createClient, SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

/**
 * Build the Supabase client lazily.
 *
 * Building it at import time meant a missing SUPABASE_URL crashed the process
 * before the server could start, so /api/health was unreachable and the only
 * symptom was an exception from deep inside the SDK. Creating it on first use
 * keeps the process bootable and lets routes report the misconfiguration.
 */
export const getSupabase = (): SupabaseClient => {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      'Supabase is not configured: set SUPABASE_URL and SUPABASE_ANON_KEY (see server/.env.example)'
    );
  }

  client = createClient(url, key);
  return client;
};

/** True when both Supabase settings are present. */
export const isDatabaseConfigured = (): boolean =>
  Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);

export const initializeDatabase = async (): Promise<void> => {
  if (!isDatabaseConfigured()) {
    console.warn('Supabase not configured; skipping schema initialisation.');
    return;
  }

  const supabase = getSupabase();
  const tables = [
    'create_social_accounts_table',
    'create_messages_table',
    'create_interaction_logs_table',
    'create_user_settings_table',
  ];

  for (const rpc of tables) {
    try {
      const { error } = await supabase.rpc(rpc);
      // "already exists" is the normal steady state, not a failure.
      if (error && !error.message.includes('already exists')) {
        console.error(`Could not run ${rpc}:`, error.message);
      }
    } catch (err) {
      console.error(`Could not run ${rpc}:`, (err as Error).message);
    }
  }
};
