<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- Landing page sections live in src/components/landing; design images are CDN pointers in src/assets/site resolved via asset() in src/lib/asset.ts, so images stay out of the repo.
- Footer scroll reveals use Framer Motion one-shot viewport variants with nested staggerChildren; CSS handles ambient and hover effects, with reduced-motion overrides in both layers.
- The landing header uses a shared scroll-direction hook and one fixed wrapper for both bars; a breakpoint-matched spacer reserves the collapsed bar heights so hiding the header never shifts page content. Mobile dropdowns overlay content and scroll within the viewport.
- Shared hospital navigation and footer live around the root Outlet; content pages use individual file routes with page-specific metadata so navigation and page identity stay consistent.
- Homepage and directory specialities use one shared catalogue, filtering/paging helpers and card component so both views preserve consistent titles and interactions.
- News, Blogs and Patient Stories listings share the ListingSearch box (same styling as the Specialities search) and in-browser filter rules in src/lib/article-search.ts, so all searchable listings behave alike.
- SpecialityIcon renders original uploaded artwork with explicit composite-layer geometry; catalogue image references are mandatory, so no generic icon fallback can silently replace a missing export.
- Public content reads go through createServerFn with a publishable-key client (src/lib/public-data.functions.ts) so SSR pages have data; bookings and queries are written only via SECURITY DEFINER RPCs that return just the new number, so anonymous visitors can never read other patients' records.
- The staff portal (/hospital-admin-portal) is client-only and talks to the database with the browser client; every privileged read/write is enforced by RLS via has_role(auth.uid(),'admin'), roles live in user_roles.
- The hospital-media bucket is private (workspace blocks public buckets); uploads are converted to WebP in the browser and stored as long-lived signed URLs.
- Typography is set once: @font-face for self-hosted faces (CDN asset URLs) plus --font-sans/--font-bangla in src/styles.css, with font files preloaded in __root head; components inherit and never set font families themselves.
- Footer social links are rows in social_links (one per fixed platform, seeded by migration) edited from the staff portal; the public footer reads only active rows via a server function, so staff changes appear without code edits.
- Long-form info pages (patient guide, privacy policy) share DocLayout: sticky quick-navigation plus numbered section cards, so both stay structurally identical and scroll-spy works the same.
- All PDFs (patient slips, staff manifests) are drawn by src/lib/pdf.ts with jsPDF: Brown Pro is embedded as TTF conversions of the uploaded OTFs (jsPDF can't read CFF), and any non-Latin text such as Bengali is shaped by the browser canvas with Hind Siliguri and placed as an image, because jsPDF has no complex-script shaping; layout rules and labels live in pdf-model.ts so they stay testable.
- Patient SMS goes through the sendAppointmentSms server function (src/lib/sms.functions.ts), not an Edge Function: it rechecks the admin role and reads appointment details from the database so the browser can never send arbitrary texts, and the SMS provider key stays server-side (provider calls live in src/lib/sms.server.ts); phone formatting and message wording live in src/lib/sms.ts so they stay testable.
- Staff walk-in bookings go through the admin-checked staff_book_appointment SECURITY DEFINER function (not a table INSERT policy), so doctor_appointments stays insert-denied for everyone and the same server-side validation applies; walk-in form rules live in src/lib/walk-in.ts.
- Staff Patient Search pages through full booking history on the database side (range + exact count, newest first) so it stays fast as records grow; its filter and paging rules live in src/lib/patient-search.ts. Date-scoped admin tables page in the browser with the shared Pagination component.
- The Career page lists job_circulars rows that are active and not past their Dhaka-date deadline (rule in src/lib/careers.ts, applied in the public server function); staff manage them from the Content section with the browser client under admin RLS.
- Doctor cards (homepage and /doctors) link whole-card to /doctors/$id; schedule and booking live only on that profile page, whose Book button reuses /request-appointment?doctor= preselection, and visiting-day ordering/bio paragraphs live in src/lib/doctors.ts so they stay testable.
- Doctor lists (public and staff) sort by display_order then created_at in the database query; Up/Down reorder renumbers serials 1..n via src/lib/doctor-order.ts so ties never leave a move ambiguous.
- The public same-day booking cutoff lives in src/lib/booking-cutoff.ts and is re-enforced inside the book_appointment database function (Dhaka time), so a stale page can't bypass it; staff_book_appointment deliberately has no cutoff.
