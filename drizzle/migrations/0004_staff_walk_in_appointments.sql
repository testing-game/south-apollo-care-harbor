ALTER TABLE public.doctor_appointments ADD COLUMN IF NOT EXISTS appointment_time text;

CREATE OR REPLACE FUNCTION public.staff_book_appointment(
  _doctor_id uuid, _date date, _time text, _name text, _phone text, _age integer, _gender text, _notes text
) RETURNS TABLE(id uuid, appointment_number text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Only staff can book appointments'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.doctors d WHERE d.id = _doctor_id AND d.is_active) THEN RAISE EXCEPTION 'Doctor not available'; END IF;
  IF _date < (now() AT TIME ZONE 'Asia/Dhaka')::date THEN RAISE EXCEPTION 'The appointment date cannot be in the past'; END IF;
  IF _date > (now() AT TIME ZONE 'Asia/Dhaka')::date + 365 THEN RAISE EXCEPTION 'Choose a date within the next year'; END IF;
  IF length(trim(coalesce(_name, ''))) NOT BETWEEN 2 AND 120 THEN RAISE EXCEPTION 'Enter the patient''s name'; END IF;
  IF coalesce(_phone, '') !~ '^01[3-9][0-9]{8}$' THEN RAISE EXCEPTION 'Enter a valid Bangladeshi mobile number (01XXXXXXXXX)'; END IF;
  IF _age IS NULL OR _age < 0 OR _age > 130 THEN RAISE EXCEPTION 'Enter a valid age'; END IF;
  IF _gender NOT IN ('male', 'female', 'other') THEN RAISE EXCEPTION 'Choose a gender'; END IF;
  IF length(coalesce(_time, '')) > 80 OR length(coalesce(_notes, '')) > 500 THEN RAISE EXCEPTION 'Time or notes are too long'; END IF;

  RETURN QUERY
  INSERT INTO public.doctor_appointments AS a (doctor_id, appointment_date, appointment_time, patient_name, patient_phone, patient_age, patient_gender, notes, status)
  VALUES (_doctor_id, _date, nullif(trim(coalesce(_time, '')), ''), trim(_name), _phone, _age, _gender, nullif(trim(coalesce(_notes, '')), ''), 'confirmed')
  RETURNING a.id, a.appointment_number;
END $$;

REVOKE ALL ON FUNCTION public.staff_book_appointment(uuid, date, text, text, text, integer, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.staff_book_appointment(uuid, date, text, text, text, integer, text, text) TO authenticated;