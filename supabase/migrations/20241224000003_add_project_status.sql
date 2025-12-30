-- Add status and atlas_id columns if they don't exist
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'completed',
ADD COLUMN IF NOT EXISTS atlas_id TEXT;

-- Update existing rows to have completed status
UPDATE public.projects SET status = 'completed' WHERE status IS NULL;

-- Enable RLS just in case (already should be, but good practice)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
