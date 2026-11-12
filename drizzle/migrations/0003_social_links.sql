CREATE TABLE public.social_links (
  platform text PRIMARY KEY CHECK (platform IN ('facebook','twitter','youtube','instagram','linkedin','whatsapp')),
  url text NOT NULL DEFAULT '' CHECK (url = '' OR url ~* '^https?://[^\s]+$'),
  is_active boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.social_links TO anon;
GRANT SELECT, UPDATE ON public.social_links TO authenticated;
GRANT ALL ON public.social_links TO service_role;

ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public reads live social links" ON public.social_links
  FOR SELECT TO anon, authenticated
  USING ((is_active AND url <> '') OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update social links" ON public.social_links
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE FUNCTION public.touch_social_links_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at := now(); RETURN NEW; END $$;

CREATE TRIGGER social_links_touch BEFORE UPDATE ON public.social_links
  FOR EACH ROW EXECUTE FUNCTION public.touch_social_links_updated_at();

INSERT INTO public.social_links (platform, display_order) VALUES
  ('facebook', 1), ('youtube', 2), ('instagram', 3), ('linkedin', 4), ('twitter', 5), ('whatsapp', 6)
ON CONFLICT (platform) DO NOTHING;