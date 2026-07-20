-- Fix "RLS Policy Always True" warnings by adding real field checks

-- contact_messages: require non-empty name, email, and message
DROP POLICY IF EXISTS anon_insert_contact_messages ON contact_messages;
CREATE POLICY "anon_insert_contact_messages" ON contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    name IS NOT NULL AND name <> '' AND
    email IS NOT NULL AND email <> '' AND
    message IS NOT NULL AND message <> ''
  );

-- predictions: require non-empty text for insert
DROP POLICY IF EXISTS anon_insert_predictions ON predictions;
CREATE POLICY "anon_insert_predictions" ON predictions FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    text IS NOT NULL AND text <> ''
  );
