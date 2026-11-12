CREATE TABLE public.job_circulars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (char_length(title) BETWEEN 2 AND 160),
  department text NOT NULL DEFAULT 'medical' CHECK (department IN ('medical', 'nursing', 'diagnostics', 'administration')),
  employment_type text NOT NULL DEFAULT 'full_time' CHECK (employment_type IN ('full_time', 'part_time', 'contractual')),
  vacancies integer NOT NULL DEFAULT 1 CHECK (vacancies BETWEEN 1 AND 999),
  qualifications text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  salary text NOT NULL DEFAULT 'Negotiable',
  deadline date,
  apply_email text NOT NULL DEFAULT '',
  apply_instructions text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX job_circulars_active_idx ON public.job_circulars (is_active, deadline);

GRANT SELECT ON public.job_circulars TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_circulars TO authenticated;
GRANT ALL ON public.job_circulars TO service_role;

ALTER TABLE public.job_circulars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public reads active job circulars" ON public.job_circulars
  FOR SELECT TO anon, authenticated
  USING (is_active OR public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins insert job circulars" ON public.job_circulars
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins update job circulars" ON public.job_circulars
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins delete job circulars" ON public.job_circulars
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));