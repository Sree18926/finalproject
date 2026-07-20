/*
# Create predictions table (single-tenant, no auth)

1. New Tables
- `predictions`
  - `id` (uuid, primary key, auto-generated)
  - `text` (text, not null) — the news article the user submitted
  - `label` (text, not null) — either 'REAL' or 'FAKE'
  - `confidence` (numeric, not null) — model confidence in 0..1
  - `created_at` (timestamptz, defaults to now) — when the prediction was made

2. Security
- Enable RLS on `predictions`.
- The app has NO sign-in screen, so the anon-key frontend must be able to
  read and write its own shared data. Add four policies (select/insert/
  update/delete) scoped to `TO anon, authenticated` with `USING (true)` /
  `WITH CHECK (true)` because this data is intentionally public/shared
  within the single-tenant app.

3. Indexes
- Index on `created_at` (descending) since the dashboard lists history
  newest-first and the stats endpoint counts rows.
*/

CREATE TABLE IF NOT EXISTS predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text text NOT NULL,
  label text NOT NULL CHECK (label IN ('REAL', 'FAKE')),
  confidence numeric NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS predictions_created_at_idx
  ON predictions (created_at DESC);

ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

-- SELECT: anyone (anon + authenticated) can read all predictions
DROP POLICY IF EXISTS "anon_select_predictions" ON predictions;
CREATE POLICY "anon_select_predictions" ON predictions FOR SELECT
  TO anon, authenticated USING (true);

-- INSERT: anyone can insert a new prediction
DROP POLICY IF EXISTS "anon_insert_predictions" ON predictions;
CREATE POLICY "anon_insert_predictions" ON predictions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- UPDATE: anyone can update predictions
DROP POLICY IF EXISTS "anon_update_predictions" ON predictions;
CREATE POLICY "anon_update_predictions" ON predictions FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- DELETE: anyone can delete predictions (single-tenant shared data)
DROP POLICY IF EXISTS "anon_delete_predictions" ON predictions;
CREATE POLICY "anon_delete_predictions" ON predictions FOR DELETE
  TO anon, authenticated USING (true);
