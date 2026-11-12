ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS is_published boolean NOT NULL DEFAULT true;
ALTER TABLE public.patient_stories ADD COLUMN IF NOT EXISTS is_published boolean NOT NULL DEFAULT true;

DROP POLICY IF EXISTS "Public reads posts" ON public.posts;
CREATE POLICY "Public reads published posts" ON public.posts
  FOR SELECT TO anon, authenticated
  USING (is_published OR public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Public reads stories" ON public.patient_stories;
CREATE POLICY "Public reads published stories" ON public.patient_stories
  FOR SELECT TO anon, authenticated
  USING (is_published OR public.has_role(auth.uid(), 'admin'::public.app_role));