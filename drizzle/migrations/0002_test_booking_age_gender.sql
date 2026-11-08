ALTER TABLE public.test_bookings ADD COLUMN IF NOT EXISTS patient_age smallint;
ALTER TABLE public.test_bookings ADD COLUMN IF NOT EXISTS patient_gender text;
ALTER TABLE public.test_bookings ADD CONSTRAINT test_bookings_age_range CHECK (patient_age IS NULL OR patient_age BETWEEN 0 AND 120);
ALTER TABLE public.test_bookings ADD CONSTRAINT test_bookings_gender_values CHECK (patient_gender IS NULL OR patient_gender IN ('Male','Female','Other'));

DROP FUNCTION IF EXISTS public.book_test(uuid, date, text, text);

CREATE OR REPLACE FUNCTION public.book_test(_package_id uuid, _date date, _name text, _phone text, _age int DEFAULT NULL, _gender text DEFAULT NULL)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE num text;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.health_packages WHERE id = _package_id AND is_active) THEN RAISE EXCEPTION 'Package not available'; END IF;
  IF _date < current_date OR _date > current_date + 90 THEN RAISE EXCEPTION 'Choose a date within the next 90 days'; END IF;
  IF _age IS NOT NULL AND (_age < 0 OR _age > 120) THEN RAISE EXCEPTION 'Enter a valid age'; END IF;
  IF _gender IS NOT NULL AND _gender NOT IN ('Male','Female','Other') THEN RAISE EXCEPTION 'Choose a gender'; END IF;
  INSERT INTO public.test_bookings(package_id, booking_date, patient_name, patient_phone, patient_age, patient_gender)
  VALUES (_package_id, _date, trim(_name), trim(_phone), _age, _gender) RETURNING booking_number INTO num;
  RETURN num;
END $$;

REVOKE ALL ON FUNCTION public.book_test(uuid, date, text, text, int, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.book_test(uuid, date, text, text, int, text) TO anon, authenticated;