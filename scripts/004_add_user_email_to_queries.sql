-- Add user_email column to queries table
ALTER TABLE queries ADD COLUMN IF NOT EXISTS user_email TEXT;

-- Update RLS policies to allow the column
-- (existing policies should already cover this, but we'll ensure it)
