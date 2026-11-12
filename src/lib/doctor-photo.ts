/**
 * Doctor photo shape. Homepage "Our Esteemed Doctors", /doctors (DoctorCard) and the /doctors/$id profile
 * photo card all crop to 4:3 with object-top. The size is 2x the widest the card is ever shown
 * (single-column phone layout, ~600px) so photos stay sharp on high-density screens.
 * Keep in sync with the aspect classes in src/components/site/DoctorCard.tsx and src/routes/doctors.$id.tsx.
 */
export const DOCTOR_PHOTO_SIZE = { ratio: "4:3", width: 1200, height: 900, minWidth: 800, minHeight: 600 } as const;

export const DOCTOR_PHOTO_HINT =
  `Recommended ${DOCTOR_PHOTO_SIZE.width} × ${DOCTOR_PHOTO_SIZE.height} px (${DOCTOR_PHOTO_SIZE.ratio} landscape), minimum ${DOCTOR_PHOTO_SIZE.minWidth} × ${DOCTOR_PHOTO_SIZE.minHeight} px. ` +
  "Centre the doctor, leave a little space above the head, and include head and shoulders down to mid-chest.";
