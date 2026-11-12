ALTER TABLE public.doctors ADD COLUMN display_order integer NOT NULL DEFAULT 999;

UPDATE public.doctors d
SET display_order = s.rn
FROM (SELECT id, row_number() OVER (ORDER BY name, created_at) AS rn FROM public.doctors) s
WHERE d.id = s.id;

CREATE INDEX doctors_display_order_idx ON public.doctors (display_order, created_at);