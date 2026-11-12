CREATE OR REPLACE FUNCTION public.book_appointment(_doctor_id uuid, _date date, _name text, _phone text, _age int, _gender text, _notes text)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE num text; d public.doctors; dhaka_now timestamp := now() AT TIME ZONE 'Asia/Dhaka'; dhaka_today date := (now() AT TIME ZONE 'Asia/Dhaka')::date;
BEGIN
  SELECT * INTO d FROM public.doctors WHERE id = _doctor_id AND is_active;
  IF NOT FOUND THEN RAISE EXCEPTION 'Doctor not available'; END IF;
  IF _date < dhaka_today OR _date > dhaka_today + 90 THEN RAISE EXCEPTION 'Choose a date within the next 90 days'; END IF;
  IF _date = dhaka_today AND dhaka_now::time >= time '21:00' THEN
    RAISE EXCEPTION 'Same-day online appointments close at 9:00 PM. Please select tomorrow or a future date, or call our helpline (+8801913240139) for urgent assistance.';
  END IF;
  IF cardinality(d.visiting_days) > 0 AND NOT (trim(to_char(_date,'FMDay')) = ANY(d.visiting_days)) THEN RAISE EXCEPTION 'Doctor does not visit on that day'; END IF;
  INSERT INTO public.doctor_appointments(doctor_id, appointment_date, patient_name, patient_phone, patient_age, patient_gender, notes)
  VALUES (_doctor_id, _date, trim(_name), trim(_phone), _age, _gender, nullif(trim(coalesce(_notes,'')),''))
  RETURNING appointment_number INTO num;
  RETURN num;
END $$;

REVOKE ALL ON FUNCTION public.book_appointment(uuid,date,text,text,int,text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.book_appointment(uuid,date,text,text,int,text,text) TO anon, authenticated;