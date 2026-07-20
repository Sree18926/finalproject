import { supabase, type PredictionRow } from './supabase';

/**
 * API client for the Fake News Detection backend.
 *
 * Two modes:
 *  - Local dev with Flask: set VITE_API_URL in `.env` to point at the Python
 *    server (backend/app.py). Predictions go to the real ML model and are
 *    stored in SQLite by the backend.
 *  - Hosted preview / no backend: VITE_API_URL is unset. The ML prediction
 *    uses a local heuristic so the UI is fully demoable, while prediction
 *    HISTORY and STATS persist to the provisioned Supabase database so the
 *    admin dashboard works across reloads and devices.
 */

const API_URL = (import.meta as any).env?.VITE_API_URL as string | undefined;

export type PredictionResult = {
  label: 'REAL' | 'FAKE';
  confidence: number; // 0..1
  text: string;
  createdAt: string;
};

export type HistoryEntry = PredictionResult & { id: string };

/** Heuristic local prediction used only when the Flask backend is unreachable. */
function simulatePrediction(text: string): { label: 'REAL' | 'FAKE'; confidence: number } {
  const lower = text.toLowerCase();
  const fakeSignals = [
    'shocking', 'you won\'t believe', 'click here', 'exposed', 'they don\'t want you to know',
    'breaking', 'must watch', 'gone viral', 'leaked', 'conspiracy', 'hoax', 'secret', 'miracle',
    'cure', 'alien', 'illuminati', 'shocking truth', 'mainstream media won\'t',
  ];
  const realSignals = [
    'according to', 'study', 'research', 'published', 'journal', 'university', 'spokesperson',
    'official', 'statement', 'report', 'data', 'analysis', 'press release', 'percent',
  ];
  let score = 0;
  fakeSignals.forEach((s) => { if (lower.includes(s)) score += 2; });
  realSignals.forEach((s) => { if (lower.includes(s)) score -= 2; });
  const caps = (text.match(/[A-Z]{4,}/g) || []).length;
  score += caps * 1.5;
  if (text.length < 60) score += 1;

  const isFake = score > 1;
  const rawConfidence = 0.5 + Math.min(0.45, Math.abs(score) * 0.06);
  const confidence = Math.max(0.5, Math.min(0.97, rawConfidence));
  return { label: isFake ? 'FAKE' : 'REAL', confidence: isFake ? confidence : 1 - confidence + 0.5 };
}

/** POST /predict — classify a news article as REAL or FAKE. */
export async function predictNews(text: string): Promise<PredictionResult> {
  const trimmed = text.trim();
  if (!trimmed) throw new Error('Please paste a news article to analyze.');

  if (API_URL) {
    // Real Flask backend.
    const res = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: trimmed }),
    });
    if (!res.ok) throw new Error(`Server error (${res.status})`);
    const data = await res.json();
    const result: PredictionResult = {
      label: data.label === 'FAKE' ? 'FAKE' : 'REAL',
      confidence: Number(data.confidence),
      text: trimmed,
      createdAt: new Date().toISOString(),
    };
    await savePrediction(result);
    return result;
  }

  // Simulation fallback for the hosted preview.
  await new Promise((r) => setTimeout(r, 700));
  const sim = simulatePrediction(trimmed);
  const result: PredictionResult = { ...sim, text: trimmed, createdAt: new Date().toISOString() };
  await savePrediction(result);
  return result;
}

/** GET /history — list past predictions (admin dashboard). */
export async function getHistory(): Promise<HistoryEntry[]> {
  if (API_URL) {
    const res = await fetch(`${API_URL}/history`);
    if (!res.ok) throw new Error(`Server error (${res.status})`);
    return (await res.json()) as HistoryEntry[];
  }
  return readSupabase();
}

/** DELETE /history/:id — remove a single prediction. */
export async function deleteHistoryEntry(id: string): Promise<void> {
  if (API_URL) {
    const res = await fetch(`${API_URL}/history/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Server error (${res.status})`);
    return;
  }
  await deleteSupabase(id);
}

/** DELETE /history — clear all prediction history. */
export async function clearHistory(): Promise<void> {
  if (API_URL) {
    const res = await fetch(`${API_URL}/history`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Server error (${res.status})`);
    return;
  }
  await clearSupabase();
}

/** GET /stats — aggregate counts for the dashboard chart. */
export async function getStats(): Promise<{ real: number; fake: number; total: number }> {
  if (API_URL) {
    const res = await fetch(`${API_URL}/stats`);
    if (!res.ok) throw new Error(`Server error (${res.status})`);
    return (await res.json()) as { real: number; fake: number; total: number };
  }
  return statsSupabase();
}

/* ----------------------- Supabase persistence ----------------------- */
/* Used in preview mode (no Flask backend). The predictions table is a
   single-tenant shared store with anon-accessible RLS policies.        */

async function savePrediction(r: PredictionResult): Promise<void> {
  if (API_URL || !supabase) return; // backend stores its own history
  const { error } = await supabase.from('predictions').insert({
    text: r.text,
    label: r.label,
    confidence: r.confidence,
  });
  if (error) console.warn('[supabase] insert failed:', error.message);
  notifyChanged();
}

async function readSupabase(): Promise<HistoryEntry[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('predictions')
    .select('id, text, label, confidence, created_at')
    .order('created_at', { ascending: false })
    .limit(200);
  if (error) {
    console.warn('[supabase] select failed:', error.message);
    return [];
  }
  return (data as PredictionRow[]).map(toEntry);
}

async function deleteSupabase(id: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from('predictions').delete().eq('id', id);
  if (error) console.warn('[supabase] delete failed:', error.message);
  notifyChanged();
}

async function clearSupabase(): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from('predictions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (error) console.warn('[supabase] clear failed:', error.message);
  notifyChanged();
}

async function statsSupabase(): Promise<{ real: number; fake: number; total: number }> {
  if (!supabase) return { real: 0, fake: 0, total: 0 };
  const { data, error } = await supabase
    .from('predictions')
    .select('label');
  if (error) {
    console.warn('[supabase] stats failed:', error.message);
    return { real: 0, fake: 0, total: 0 };
  }
  const rows = (data || []) as Pick<PredictionRow, 'label'>[];
  const real = rows.filter((r) => r.label === 'REAL').length;
  return { real, fake: rows.length - real, total: rows.length };
}

/** Map a Supabase row to the frontend HistoryEntry shape. */
function toEntry(r: PredictionRow): HistoryEntry {
  return {
    id: r.id,
    text: r.text,
    label: r.label,
    confidence: Number(r.confidence),
    createdAt: r.created_at,
  };
}

/** Notify same-tab listeners that history changed. */
function notifyChanged() {
  window.dispatchEvent(new Event('fnd-history-changed'));
}
