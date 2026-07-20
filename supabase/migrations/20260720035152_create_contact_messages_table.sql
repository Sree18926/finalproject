/*
# Create contact_messages table (single-tenant, no auth)

1. New Tables
- `contact_messages`
  - `id` (uuid, primary key, auto-generated)
  - `name` (text, not null) — sender's name
  - `email` (text, not null) — sender's email address
  - `subject` (text, not null) — message subject line
  - `message` (text, not null) — the message body
  - `created_at` (timestamptz, defaults to now) — when the message was sent

2. Security
- Enable RLS on `contact_messages`.
- The app has NO sign-in screen, so the anon-key frontend must be able to
  submit contact messages. Add INSERT policy scoped to
  `TO anon, authenticated` with `WITH CHECK (true)`.
- No SELECT/UPDATE/DELETE policies are added because only the admin
  should read messages, and this app has no admin auth. (If you later add
  auth, scope SELECT to authenticated admins.)

3. Indexes
- Index on `created_at` descending so messages can be listed newest-first.
*/

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS contact_messages_created_at_idx
  ON contact_messages (created_at DESC);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- INSERT: anyone (anon + authenticated) can submit a contact message
DROP POLICY IF EXISTS "anon_insert_contact_messages" ON contact_messages;
CREATE POLICY "anon_insert_contact_messages" ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);
