import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client singleton.
 *
 * Reads the Vite-prefixed env vars that are pre-populated in `.env`.
 * The anon key is safe to expose in the browser — RLS policies govern access.
 */
const url = (import.meta as any).env?.VITE_SUPABASE_URL as string | undefined;
const anonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase = url && anonKey
  ? createClient(url, anonKey, { auth: { persistSession: false } })
  : null;

/** Row shape for the `predictions` table. */
export type PredictionRow = {
  id: string;
  text: string;
  label: 'REAL' | 'FAKE';
  confidence: number;
  created_at: string;
};
