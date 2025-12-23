-- Simplified queries table to only store query, location, and number of leads
ALTER TABLE public.queries
DROP COLUMN IF EXISTS company_name,
DROP COLUMN IF EXISTS industry,
DROP COLUMN IF EXISTS employee_count,
DROP COLUMN IF EXISTS job_title;

ALTER TABLE public.queries
ADD COLUMN IF NOT EXISTS query TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS num_leads INTEGER NOT NULL DEFAULT 10;

-- Update location to be NOT NULL with default
ALTER TABLE public.queries
ALTER COLUMN location SET DEFAULT '',
ALTER COLUMN location SET NOT NULL;

-- Simplified results table to only store email
ALTER TABLE public.results
DROP COLUMN IF EXISTS company_name,
DROP COLUMN IF EXISTS phone,
DROP COLUMN IF EXISTS linkedin_url,
DROP COLUMN IF EXISTS website,
DROP COLUMN IF EXISTS additional_data;

-- Make email required
ALTER TABLE public.results
ALTER COLUMN email SET NOT NULL;

COMMENT ON COLUMN public.queries.query IS 'The search query or criteria';
COMMENT ON COLUMN public.queries.location IS 'Geographic location for the search';
COMMENT ON COLUMN public.queries.num_leads IS 'Number of leads to generate';
COMMENT ON COLUMN public.results.email IS 'Email address of the lead';
