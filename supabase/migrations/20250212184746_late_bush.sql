/*
  # Create news articles table

  1. New Tables
    - `news_articles`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `description` (text, not null)
      - `url` (text, not null)
      - `imageurl` (text, nullable)
      - `category` (text, not null)
      - `publishedat` (timestamptz, not null)
      - `source` (text, not null)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `news_articles` table
    - Add policy for public read access
    - Add policy for service role write access
*/

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

-- Enable Row Level Security
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access"
  ON news_articles
  FOR SELECT
  TO public
  USING (true);

-- Allow service role to insert/update
CREATE POLICY "Allow service role to manage news"
  ON news_articles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);