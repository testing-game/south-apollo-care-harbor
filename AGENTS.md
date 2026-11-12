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
- SpecialityIcon renders original uploaded artwork with explicit composite-layer geometry; catalogue image references are mandatory, so no generic icon fallback can silently replace a missing export.
- Public content reads go through createServerFn with a publishable-key client (src/lib/public-data.functions.ts) so SSR pages have data; bookings and queries are written only via SECURITY DEFINER RPCs that return just the new number, so anonymous visitors can never read other patients' records.
- The staff portal (/hospital-admin-portal) is client-only and talks to the database with the browser client; every privileged read/write is enforced by RLS via has_role(auth.uid(),'admin'), roles live in user_roles.
- The hospital-media bucket is private (workspace blocks public buckets); uploads are converted to WebP in the browser and stored as long-lived signed URLs.
- Typography is set once: @font-face for self-hosted faces (CDN asset URLs) plus --font-sans/--font-bangla in src/styles.css, with font files preloaded in __root head; components inherit and never set font families themselves.
- Footer social links are rows in social_links (one per fixed platform, seeded by migration) edited from the staff portal; the public footer reads only active rows via a server function, so staff changes appear without code edits.
- Long-form info pages (patient guide, privacy policy) share DocLayout: sticky quick-navigation plus numbered section cards, so both stay structurally identical and scroll-spy works the same.
