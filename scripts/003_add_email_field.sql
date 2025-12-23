-- Add email field to queries table to store user's contact email
ALTER TABLE public.queries
ADD COLUMN IF NOT EXISTS user_email TEXT NOT NULL DEFAULT '';

COMMENT ON COLUMN public.queries.user_email IS 'User contact email for this query';
