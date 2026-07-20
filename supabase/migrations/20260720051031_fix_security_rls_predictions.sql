-- Remove unnecessary UPDATE and DELETE policies on predictions
-- (a public demo only needs SELECT for history and INSERT for new predictions)
DROP POLICY IF EXISTS anon_update_predictions ON predictions;
DROP POLICY IF EXISTS anon_delete_predictions ON predictions;
