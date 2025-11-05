/*
  # Add Settings Table

  1. New Tables
    - `settings` - Stores user settings and preferences
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `theme` (text, user's theme preference)
      - `notifications_enabled` (boolean, notification settings)
      - `auto_save` (boolean, auto-save preference)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on settings table
    - Users can only view and update their own settings
*/

CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  theme text DEFAULT 'light',
  notifications_enabled boolean DEFAULT true,
  auto_save boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings"
  ON settings FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own settings"
  ON settings FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own settings"
  ON settings FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());