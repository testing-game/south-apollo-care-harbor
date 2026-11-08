CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE TABLE public.hero_banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL, subtitle text, image_url text NOT NULL,
  cta_text text, cta_link text, display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now());

CREATE TABLE public.specialities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, slug text NOT NULL UNIQUE, icon_url text NOT NULL DEFAULT '',
  description text, display_order int NOT NULL DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now());

CREATE TABLE public.doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, designation text NOT NULL DEFAULT '', degrees text NOT NULL DEFAULT '',
  speciality_id uuid REFERENCES public.specialities(id) ON DELETE SET NULL,
  department_name text NOT NULL DEFAULT '', image_url text NOT NULL DEFAULT '',
  visiting_days text[] NOT NULL DEFAULT '{}', visiting_hours text NOT NULL DEFAULT '',
  room_number text, consultation_fee numeric, is_featured boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now());

CREATE TABLE public.health_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL, slug text NOT NULL UNIQUE, price numeric, image_url text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '', included_tests text[] NOT NULL DEFAULT '{}',
  is_featured boolean NOT NULL DEFAULT false, is_active boolean NOT NULL DEFAULT true,
  display_order int NOT NULL DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now());

CREATE TABLE public.patient_stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name text NOT NULL, treatment_title text NOT NULL,
  doctor_id uuid REFERENCES public.doctors(id) ON DELETE SET NULL,
  thumbnail_url text NOT NULL DEFAULT '', youtube_video_url text, story_content text NOT NULL DEFAULT '',
  slug text NOT NULL UNIQUE, is_featured boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now());

CREATE TABLE public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('news','blog')),
  title text NOT NULL, slug text NOT NULL UNIQUE, excerpt text NOT NULL DEFAULT '', content text NOT NULL DEFAULT '',
  featured_image text NOT NULL DEFAULT '', author_name text, published_date date NOT NULL DEFAULT current_date,
  is_featured boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now());

CREATE SEQUENCE public.appointment_number_seq;
CREATE SEQUENCE public.booking_number_seq;

CREATE TABLE public.doctor_appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_number text NOT NULL UNIQUE DEFAULT ('SA-A-' || lpad(nextval('public.appointment_number_seq')::text, 6, '0')),
  patient_name text NOT NULL CHECK (char_length(patient_name) BETWEEN 2 AND 120),
  patient_phone text NOT NULL CHECK (patient_phone ~ '^[0-9+ -]{7,20}$'),
  patient_age int NOT NULL CHECK (patient_age BETWEEN 0 AND 130),
  patient_gender text NOT NULL CHECK (patient_gender IN ('male','female','other')),
  doctor_id uuid NOT NULL REFERENCES public.doctors(id) ON DELETE RESTRICT,
  appointment_date date NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','completed','cancelled')),
  notes text CHECK (notes IS NULL OR char_length(notes) <= 1000),
  created_at timestamptz NOT NULL DEFAULT now());

CREATE TABLE public.test_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_number text NOT NULL UNIQUE DEFAULT ('SA-T-' || lpad(nextval('public.booking_number_seq')::text, 6, '0')),
  patient_name text NOT NULL CHECK (char_length(patient_name) BETWEEN 2 AND 120),
  patient_phone text NOT NULL CHECK (patient_phone ~ '^[0-9+ -]{7,20}$'),
  package_id uuid NOT NULL REFERENCES public.health_packages(id) ON DELETE RESTRICT,
  booking_date date NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','completed','cancelled')),
  created_at timestamptz NOT NULL DEFAULT now());

CREATE TABLE public.queries_contact (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 120),
  email text CHECK (email IS NULL OR char_length(email) <= 255),
  phone text NOT NULL CHECK (phone ~ '^[0-9+ -]{7,20}$'),
  subject text NOT NULL CHECK (char_length(subject) BETWEEN 2 AND 200),
  message text NOT NULL CHECK (char_length(message) BETWEEN 2 AND 3000),
  status text NOT NULL DEFAULT 'unread' CHECK (status IN ('unread','responded')),
  created_at timestamptz NOT NULL DEFAULT now());

GRANT SELECT ON public.hero_banners, public.specialities, public.doctors, public.health_packages, public.patient_stories, public.posts TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.hero_banners, public.specialities, public.doctors, public.health_packages, public.patient_stories, public.posts TO authenticated;
GRANT ALL ON public.hero_banners, public.specialities, public.doctors, public.health_packages, public.patient_stories, public.posts, public.doctor_appointments, public.test_bookings, public.queries_contact TO service_role;
GRANT SELECT, UPDATE, DELETE ON public.doctor_appointments, public.test_bookings, public.queries_contact TO authenticated;

ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queries_contact ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public reads active banners" ON public.hero_banners FOR SELECT TO anon, authenticated USING (is_active OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Public reads specialities" ON public.specialities FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public reads active doctors" ON public.doctors FOR SELECT TO anon, authenticated USING (is_active OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Public reads active packages" ON public.health_packages FOR SELECT TO anon, authenticated USING (is_active OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Public reads stories" ON public.patient_stories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public reads posts" ON public.posts FOR SELECT TO anon, authenticated USING (true);

DO $$ DECLARE t text; BEGIN
  FOREACH t IN ARRAY ARRAY['hero_banners','specialities','doctors','health_packages','patient_stories','posts'] LOOP
    EXECUTE format('CREATE POLICY "Admins insert" ON public.%I FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),''admin''))', t);
    EXECUTE format('CREATE POLICY "Admins update" ON public.%I FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),''admin'')) WITH CHECK (public.has_role(auth.uid(),''admin''))', t);
    EXECUTE format('CREATE POLICY "Admins delete" ON public.%I FOR DELETE TO authenticated USING (public.has_role(auth.uid(),''admin''))', t);
  END LOOP;
  FOREACH t IN ARRAY ARRAY['doctor_appointments','test_bookings','queries_contact'] LOOP
    EXECUTE format('CREATE POLICY "Admins read" ON public.%I FOR SELECT TO authenticated USING (public.has_role(auth.uid(),''admin''))', t);
    EXECUTE format('CREATE POLICY "Admins update" ON public.%I FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),''admin'')) WITH CHECK (public.has_role(auth.uid(),''admin''))', t);
    EXECUTE format('CREATE POLICY "Admins delete" ON public.%I FOR DELETE TO authenticated USING (public.has_role(auth.uid(),''admin''))', t);
  END LOOP;
END $$;

CREATE OR REPLACE FUNCTION public.book_appointment(_doctor_id uuid, _date date, _name text, _phone text, _age int, _gender text, _notes text)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE num text; d public.doctors;
BEGIN
  SELECT * INTO d FROM public.doctors WHERE id = _doctor_id AND is_active;
  IF NOT FOUND THEN RAISE EXCEPTION 'Doctor not available'; END IF;
  IF _date < current_date OR _date > current_date + 90 THEN RAISE EXCEPTION 'Choose a date within the next 90 days'; END IF;
  IF cardinality(d.visiting_days) > 0 AND NOT (trim(to_char(_date,'FMDay')) = ANY(d.visiting_days)) THEN RAISE EXCEPTION 'Doctor does not visit on that day'; END IF;
  INSERT INTO public.doctor_appointments(doctor_id, appointment_date, patient_name, patient_phone, patient_age, patient_gender, notes)
  VALUES (_doctor_id, _date, trim(_name), trim(_phone), _age, _gender, nullif(trim(coalesce(_notes,'')),''))
  RETURNING appointment_number INTO num;
  RETURN num;
END $$;

CREATE OR REPLACE FUNCTION public.book_test(_package_id uuid, _date date, _name text, _phone text)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE num text;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.health_packages WHERE id = _package_id AND is_active) THEN RAISE EXCEPTION 'Package not available'; END IF;
  IF _date < current_date OR _date > current_date + 90 THEN RAISE EXCEPTION 'Choose a date within the next 90 days'; END IF;
  INSERT INTO public.test_bookings(package_id, booking_date, patient_name, patient_phone)
  VALUES (_package_id, _date, trim(_name), trim(_phone)) RETURNING booking_number INTO num;
  RETURN num;
END $$;

CREATE OR REPLACE FUNCTION public.send_query(_name text, _email text, _phone text, _subject text, _message text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.queries_contact(name, email, phone, subject, message)
  VALUES (trim(_name), nullif(trim(coalesce(_email,'')),''), trim(_phone), trim(_subject), trim(_message));
END $$;

REVOKE ALL ON FUNCTION public.book_appointment(uuid,date,text,text,int,text,text), public.book_test(uuid,date,text,text), public.send_query(text,text,text,text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.book_appointment(uuid,date,text,text,int,text,text), public.book_test(uuid,date,text,text), public.send_query(text,text,text,text,text) TO anon, authenticated;

INSERT INTO public.specialities (name, slug, icon_url, display_order) VALUES
('Accident & Emergency', 'accident-emergency', '/__l5e/assets-v1/aed425c7-7096-4950-8221-6a0f6f2e7699/speciality-variant8.png', 0),
('Anesthesia and Pain Medicine', 'anesthesia-and-pain-medicine', '/__l5e/assets-v1/e7234620-085f-4399-8853-41bb038c8244/speciality-variant12.png', 1),
('Cancer Care Centre', 'cancer-care-centre', '/__l5e/assets-v1/a403d50b-5cad-4e1e-8bcd-699741087873/speciality-variant16.png', 2),
('Cardiology Care Centre', 'cardiology-care-centre', '/__l5e/assets-v1/bc4a3794-daa0-4b0d-98fe-920f2687039f/speciality-variant20.png', 3),
('Cardiothoracic & Vascular Surgery', 'cardiothoracic-vascular-surgery', '/__l5e/assets-v1/fd93fd94-0d08-47f6-ab15-befff8df7b0a/speciality-variant24.png', 4),
('Cardiothoracic Anaesthesia', 'cardiothoracic-anaesthesia', '/__l5e/assets-v1/8473c1b4-1907-42ee-926b-90512524f249/speciality-variant28.png', 5),
('Child Development Centre', 'child-development-centre', '/__l5e/assets-v1/1946e944-7606-4d6a-8c36-286541e4907e/speciality-variant32.png', 6),
('Counselling Centre', 'counselling-centre', '/__l5e/assets-v1/83d45d2a-6c6b-4803-8523-b53b08a5aa28/speciality-variant36.png', 7),
('Critical Care Units', 'critical-care-units', '/__l5e/assets-v1/f148d4d2-92e9-4d59-854c-005deece1f4d/speciality-variant40.png', 8),
('Dental & Maxillofacial Surgery', 'dental-maxillofacial-surgery', '/__l5e/assets-v1/c77a0e6e-53e3-452e-b931-b0bb30f53007/speciality-dentish-chair.png', 9),
('Dermatology & Venereology', 'dermatology-venereology', '/__l5e/assets-v1/474a6bc2-7887-4347-b283-5e09f1e9cf83/speciality-variant48.png', 10),
('Diabetology & Endocrinology', 'diabetology-endocrinology', '/__l5e/assets-v1/3c479b49-74c9-43b7-9dad-7f61505cf0b9/speciality-variant52.png', 11),
('Diagnostic & Interventional Radiology', 'diagnostic-interventional-radiology', '/__l5e/assets-v1/7e7b06c2-46d0-4f1e-9fbb-69ff4ef5fe19/speciality-variant56.png', 12),
('Dietetics & Nutrition', 'dietetics-nutrition', '/__l5e/assets-v1/503d493b-cc62-43a6-8620-2517b3cee866/speciality-variant60.png', 13),
('ENT & Head Neck Surgery', 'ent-head-neck-surgery', '/__l5e/assets-v1/7bfaf0e0-693b-41b2-b908-600b2ab05af4/speciality-variant64.png', 14),
('Fertility Centre', 'fertility-centre', '/__l5e/assets-v1/f599630a-8676-4c92-8fea-5e63c097dee2/speciality-variant68.png', 15),
('Gastroenterology & Hepatology', 'gastroenterology-hepatology', '/__l5e/assets-v1/316b6297-6cf8-44fa-852c-6fa139fd1fad/speciality-variant72.png', 16),
('General & Laparoscopic Surgery', 'general-laparoscopic-surgery', '/__l5e/assets-v1/b844e518-be40-4612-9678-814bc428fed7/speciality-variant76.png', 17),
('Hematology & Stem Cell Transplant', 'hematology-stem-cell-transplant', '/__l5e/assets-v1/511a83b2-1243-4fa8-8758-d54702acca5d/speciality-variant80.png', 18),
('Hepatobiliary, Pancreatic and Liver Transplant', 'hepatobiliary-pancreatic-and-liver-transplant', '/__l5e/assets-v1/d626781c-657c-4d35-857c-e4087692a2b5/speciality-variant84.png', 19),
('Internal Medicine', 'internal-medicine', '/__l5e/assets-v1/38f46c3f-006f-4ea1-b451-b944c3d08ed5/speciality-variant88.png', 20),
('Joint Care & Wellness Centre', 'joint-care-wellness-centre', '/__l5e/assets-v1/7bc68696-e8fd-4c65-a4f1-89e130bdf859/speciality-variant92.png', 21),
('Kidney Transplant Program', 'kidney-transplant-program', '/__l5e/assets-v1/c4423ffa-831f-4f95-8dc3-dddac11d7de1/speciality-variant96.png', 22),
('Lab Medicine', 'lab-medicine', '/__l5e/assets-v1/ca18e051-bd6a-474a-9937-3ea5c3e46541/speciality-variant100.png', 23),
('Lithotripsy', 'lithotripsy', '/__l5e/assets-v1/cfb2ed9c-2ca7-48d4-ad0e-e0a0d70ecaf8/speciality-variant104.png', 24),
('Neonatology', 'neonatology', '/__l5e/assets-v1/8082c551-6ab2-4764-9033-88d209bcde99/speciality-variant108.png', 25),
('Nephrology', 'nephrology', '/__l5e/assets-v1/060b3455-0d50-445b-8858-ab4ea6a7c767/speciality-variant112.png', 26),
('Neurology', 'neurology', '/__l5e/assets-v1/de6ce913-c6bd-4100-8cdb-891a9878c390/speciality-210539896.png', 27),
('Neurosurgery', 'neurosurgery', '/__l5e/assets-v1/26085703-9c94-40ce-91e6-efbb192736c6/speciality-variant120.png', 28),
('Nuclear Medicine', 'nuclear-medicine', '/__l5e/assets-v1/be09661a-ec60-4221-b331-4e74c16a5086/speciality-variant124.png', 29),
('Obstetrics and Gynaecology', 'obstetrics-and-gynaecology', '/__l5e/assets-v1/239c8ef2-697a-49c5-a809-cf7dece33c30/speciality-variant128.png', 30),
('Ophthalmology', 'ophthalmology', '/__l5e/assets-v1/2d06c186-0101-42d5-959a-cbe749818ae5/speciality-variant132.png', 31),
('Orthopaedics', 'orthopaedics', '/__l5e/assets-v1/ffc3d295-9142-45b8-bf21-e50377c9e50c/speciality-x367.png', 32),
('Paediatric Cardiology', 'paediatric-cardiology', '/__l5e/assets-v1/444f5360-4d3b-4c4b-bb42-719391dbabb6/speciality-variant140.png', 33),
('Paediatric Surgery & Paediatric Urology', 'paediatric-surgery-paediatric-urology', '/__l5e/assets-v1/11c01a72-03d6-40ce-82d2-f2c38ea7c3a4/speciality-variant144.png', 34),
('Paediatrics', 'paediatrics', '/__l5e/assets-v1/de945eb3-7194-4f30-9bfc-a6790821107e/speciality-variant148.png', 35),
('Physical Medicine & Rehabilitation', 'physical-medicine-rehabilitation', '/__l5e/assets-v1/87c5173c-ba38-4d71-a38b-762af9d5d4b1/speciality-variant152.png', 36),
('Plastic, Reconstructive & Cosmetic Surgery', 'plastic-reconstructive-cosmetic-surgery', '/__l5e/assets-v1/f525cf62-9d09-4a68-beec-a271bb20c790/speciality-variant156.png', 37),
('Psychiatry', 'psychiatry', '/__l5e/assets-v1/51fc131a-3a4d-41f7-894c-a6203c4806a3/speciality-variant160.png', 38),
('Respiratory Medicine', 'respiratory-medicine', '/__l5e/assets-v1/beb957b7-96ec-4e9e-ab28-05b0d8bdbfcc/speciality-lungs.png', 39),
('Rheumatology', 'rheumatology', '/__l5e/assets-v1/92c49d1d-4df4-4cd4-8470-785d494aba7c/speciality-group.png', 40),
('Thoracic Surgery', 'thoracic-surgery', '/__l5e/assets-v1/8eaffda8-deaa-4579-88e4-2b9251990a74/speciality-variant170.png', 41),
('Transfusion Medicine', 'transfusion-medicine', '/__l5e/assets-v1/127d6aa1-118d-4887-ab70-4ec0afa42dad/speciality-variant174.png', 42),
('Urology', 'urology', '/__l5e/assets-v1/58f963c8-55c9-40ca-8498-5c464bdad15a/speciality-variant178.png', 43);

INSERT INTO public.health_packages (title, slug, image_url, description, included_tests, is_featured, display_order) VALUES
('Executive Health Check (Male / Female)', 'executive-health-check-male-female', '/__l5e/assets-v1/371acb98-8c80-4b6f-b285-30c37aeef6dd/executive-health-check-male-female.png', 'Package details and pricing to be confirmed by the hospital.', '{}', true, 0),
('Heart Check (For Men)', 'heart-check-for-men', '/__l5e/assets-v1/db3829e1-ea4a-4f69-92b2-e5f27a2bf2a4/heart-check-for-men.png', 'Package details and pricing to be confirmed by the hospital.', '{}', true, 1),
('Heart Check (For Women)', 'heart-check-for-women', '/__l5e/assets-v1/bae92458-29ef-48be-9080-5839f8915b79/heart-check-for-women.png', 'Package details and pricing to be confirmed by the hospital.', '{}', true, 2),
('Whole Body Check (For Men Above 45 Years)', 'whole-body-check-for-men-above-45-years', '/__l5e/assets-v1/c590a455-ce21-4c62-931e-7259aaf35c51/whole-body-check-for-men-above-45-years.png', 'Package details and pricing to be confirmed by the hospital.', '{}', true, 3),
('Whole Body Check (For Men Below 45 Years)', 'whole-body-check-for-men-below-45-years', '/__l5e/assets-v1/4f06258c-9787-448c-be11-30aaa8550c58/whole-body-check-for-men-below-45-years.png', 'Package details and pricing to be confirmed by the hospital.', '{}', true, 4),
('Whole Body Check (For Women Above 45 Years)', 'whole-body-check-for-women-above-45-years', '/__l5e/assets-v1/857c9aeb-0342-41b6-8e45-f0dccc7ceea8/whole-body-check-for-women-above-45-years.png', 'Package details and pricing to be confirmed by the hospital.', '{}', true, 5),
('Whole Body Check (For Women Below 45 Years)', 'whole-body-check-for-women-below-45-years', '/__l5e/assets-v1/b347dab6-dddc-4a70-abcb-2e11acf390d3/whole-body-check-for-women-below-45-years.png', 'Package details and pricing to be confirmed by the hospital.', '{}', true, 6),
('Health Check General (Male Below 40)', 'health-check-general-male-below-40', '/__l5e/assets-v1/422c62f7-716a-4fca-a108-a385c6af54f1/health-check-general-male-below-40.png', 'Package details and pricing to be confirmed by the hospital.', '{}', true, 7);