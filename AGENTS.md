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
