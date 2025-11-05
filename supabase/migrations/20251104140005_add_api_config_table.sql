/*
  # Add API Config Table

  1. New Tables
    - `api_config` - Stores API configuration and keys for users
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `api_key` (text, encrypted API key)
      - `api_name` (text, name of the API service)
      - `base_url` (text, API base URL)
      - `is_active` (boolean, whether config is active)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on api_config table
    - Users can only view, create, update, and delete their own API configs
*/

CREATE TABLE IF NOT EXISTS api_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  api_name text NOT NULL,
  api_key text NOT NULL,
  base_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, api_name)
);

ALTER TABLE api_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own API configs"
  ON api_config FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own API configs"
  ON api_config FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own API configs"
  ON api_config FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own API configs"
  ON api_config FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());