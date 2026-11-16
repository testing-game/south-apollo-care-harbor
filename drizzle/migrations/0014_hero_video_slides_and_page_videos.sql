ALTER TABLE public.hero_banners
  ADD COLUMN media_type text NOT NULL DEFAULT 'image',
  ADD COLUMN video_url text NOT NULL DEFAULT '';
ALTER TABLE public.hero_banners
  ADD CONSTRAINT hero_banners_media_type_check CHECK (media_type IN ('image', 'video'));

CREATE TABLE public.page_videos (
  slot text PRIMARY KEY,
  source_type text NOT NULL DEFAULT 'upload' CHECK (source_type IN ('upload', 'link')),
  video_url text NOT NULL DEFAULT '',
  poster_url text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  caption text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.page_videos TO anon;
GRANT SELECT, UPDATE ON public.page_videos TO authenticated;
GRANT ALL ON public.page_videos TO service_role;

ALTER TABLE public.page_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public reads live page videos" ON public.page_videos
  FOR SELECT TO anon, authenticated
  USING ((is_active AND video_url <> '') OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update page videos" ON public.page_videos
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE FUNCTION public.touch_page_videos_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER page_videos_touch_updated_at
  BEFORE UPDATE ON public.page_videos
  FOR EACH ROW EXECUTE FUNCTION public.touch_page_videos_updated_at();

INSERT INTO public.page_videos (slot, title) VALUES ('about_intro', 'Hospital Intro Video')
ON CONFLICT (slot) DO NOTHING;