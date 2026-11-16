ALTER TABLE public.health_packages ADD COLUMN IF NOT EXISTS preparation text NOT NULL DEFAULT '';
ALTER TABLE public.test_bookings ADD COLUMN IF NOT EXISTS notes text NOT NULL DEFAULT '';
ALTER TABLE public.test_bookings ADD CONSTRAINT test_bookings_notes_length CHECK (char_length(notes) <= 500);

DROP FUNCTION IF EXISTS public.book_test(uuid, date, text, text, int, text);

CREATE OR REPLACE FUNCTION public.book_test(_package_id uuid, _date date, _name text, _phone text, _age int DEFAULT NULL, _gender text DEFAULT NULL, _notes text DEFAULT NULL)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE num text;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.health_packages WHERE id = _package_id AND is_active) THEN RAISE EXCEPTION 'Package not available'; END IF;
  IF _date < current_date OR _date > current_date + 90 THEN RAISE EXCEPTION 'Choose a date within the next 90 days'; END IF;
  IF _age IS NOT NULL AND (_age < 0 OR _age > 120) THEN RAISE EXCEPTION 'Enter a valid age'; END IF;
  IF _gender IS NOT NULL AND _gender NOT IN ('Male','Female','Other') THEN RAISE EXCEPTION 'Choose a gender'; END IF;
  IF char_length(coalesce(_notes, '')) > 500 THEN RAISE EXCEPTION 'Notes must be 500 characters or fewer'; END IF;
  INSERT INTO public.test_bookings(package_id, booking_date, patient_name, patient_phone, patient_age, patient_gender, notes)
  VALUES (_package_id, _date, trim(_name), trim(_phone), _age, _gender, trim(coalesce(_notes, ''))) RETURNING booking_number INTO num;
  RETURN num;
END $$;

REVOKE ALL ON FUNCTION public.book_test(uuid, date, text, text, int, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.book_test(uuid, date, text, text, int, text, text) TO anon, authenticated;