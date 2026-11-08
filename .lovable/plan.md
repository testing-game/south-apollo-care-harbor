# South Apollo: Live Data, Bookings and Admin Portal

Your blueprint is large, so it is delivered in five phases. Each phase ends with a working, tested result before the next one starts. Approving this plan starts Phase 1 and continues through the phases in order.

## Phase 1 — Backend foundation
- Turn on Lovable Cloud (database, logins, file storage).
- Create all nine tables from the blueprint: banners, specialities, doctors, health packages, patient stories, news & blogs (one table with a news/blog type), doctor appointments, test bookings, and queries.
- Access rules: the public can read only active content and can submit appointments, test bookings and queries. Only admins can see bookings and queries or edit anything.
- Admin role stored in its own table (never on a profile), checked by the server.
- Public `hospital-media` image storage. Every admin upload is converted to WebP in the browser before it is saved.
- Starting content: the 44 specialities (with their current artwork) and the 8 current health packages. Banners, doctors, stories and news start empty until you add them.

## Phase 2 — Admin portal at `/hospital-admin-portal`
- Email and password sign-in. Only accounts marked as admin get in.
- Sidebar layout with the hospital logo; it collapses on mobile.
- Dashboard cards: today's appointments, today's test bookings, doctors on duty today (from their visiting days), and total doctors. Lists of today's schedule and unread queries.
- Doctor management: add, edit and deactivate doctors, pick visiting days and hours, and upload a photo.
- Health package management: price, image and the list of included tests.

## Phase 3 — Public booking flows
- `/request-appointment`: four steps (speciality, doctor, visiting day, patient details), then a confirmation with the appointment number and a PDF download.
- `/health-checkup-all-packages`: every package with its included tests and a "Book Test" window that issues a booking number and PDF.
- `/send-query`: a contact form. The header and banner "Send Query" buttons will open it.

## Phase 4 — Admin bookings and printing
- Appointments table: date filter (today by default), doctor and status filters, search by name, phone or number, and status changes.
- Test bookings table with the same tools.
- Printable daily sheets as PDFs: one per doctor for appointments, one per day for bookings.
- Patient history search with separate Appointments and Test Bookings tabs.
- Editors for stories (with YouTube links), news, blogs and banners.

## Phase 5 — Live public pages
- Home banner rotates every 3 seconds using active banners. The current banner image is shown while no banners exist.
- Quick actions: Find a Doctor goes to `/doctors`, Request an Appointment to `/request-appointment`, Online Report to the external report site, Tele-Online calls +880 1913-240139, and Patient & Visitors Guide goes to `/patient-guide`.
- Home sections for packages, stories, news, "Our Esteemed Doctors" and blogs use live content, each with a "View All" link.
- New pages: `/doctors` (search plus speciality filter), `/stories` and `/stories/:slug`, `/news` and `/news/:slug`, `/blogs` and `/blogs/:slug`, and `/patient-guide`.
- Header menu links go to the matching new pages.

## Things you will need to provide
- The email address for the first admin account. After you sign up, I will mark that account as admin.
- The real doctors, banners, stories, news and the Patient Guide text. You can add these through the admin portal. I will write placeholder guide text and label it as a placeholder.

## Technical details
- Data access goes through `createServerFn`. Public reads use a publishable-key client with narrow anon SELECT policies. Admin functions use `requireSupabaseAuth` plus `has_role(auth.uid(),'admin')`.
- Anyone can insert bookings and queries, but no one can read them back except admins. Appointment and booking numbers come from a database sequence and trigger, for example `SA-A-000123`.
- Every migration includes GRANTs, enables RLS and adds policies. Seed rows are inserted in the migrations themselves.
- `browser-image-compression` handles WebP conversion and `jsPDF` with `jspdf-autotable` generates the PDFs.
- Admin routes live under `_authenticated/hospital-admin-portal.*` with a role check. The existing landing components move to loader + `useSuspenseQuery` data.
- Specialities keep their current artwork. `icon_url` points to the existing CDN images.
- Vitest covers the booking-number format, the "doctors on duty today" weekday logic and the WebP conversion helper. roadmap.md tracks the phases.
