/*
  # Update news articles table

  1. Changes
    - Ensure table exists with correct column names
    - Add RLS if not already enabled
    - Add policies if they don't exist

  2. Security
    - Check and enable RLS
    - Add read policy for public access if missing
    - Add management policy for service role if missing
*/

-- Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS news_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  url text NOT NULL,
  imageurl text,
  category text NOT NULL,
  publishedat timestamptz NOT NULL,
  source text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS (safe to run multiple times)
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

-- Create policies only if they don't exist
DO $$ 
BEGIN
  -- Check if public read policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'news_articles' 
    AND policyname = 'Allow public read access'
  ) THEN
    CREATE POLICY "Allow public read access"
      ON news_articles
      FOR SELECT
      TO public
      USING (true);
  END IF;

  -- Check if service role management policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'news_articles' 
    AND policyname = 'Allow service role to manage news'
  ) THEN
    CREATE POLICY "Allow service role to manage news"
      ON news_articles
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;