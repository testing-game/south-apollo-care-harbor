ALTER TABLE public.health_packages ADD COLUMN IF NOT EXISTS home_image_url text NOT NULL DEFAULT '';
COMMENT ON COLUMN public.health_packages.home_image_url IS 'Portrait 29:32 banner for the homepage Health Check Packages cards; falls back to image_url when empty.';
COMMENT ON COLUMN public.health_packages.image_url IS 'Landscape 16:10 banner for the /health-checkup-all-packages cards.';