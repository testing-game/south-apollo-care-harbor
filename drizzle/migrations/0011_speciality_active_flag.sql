ALTER TABLE public.specialities ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;
ALTER TABLE public.specialities ALTER COLUMN display_order SET DEFAULT 999;
GRANT SELECT ON public.specialities TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.specialities TO authenticated;
GRANT ALL ON public.specialities TO service_role;
DROP POLICY IF EXISTS "Public reads specialities" ON public.specialities;
CREATE POLICY "Public reads active specialities" ON public.specialities
  FOR SELECT TO anon, authenticated
  USING (is_active OR public.has_role(auth.uid(), 'admin'::public.app_role));