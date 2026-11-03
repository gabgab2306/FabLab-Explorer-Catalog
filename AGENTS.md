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

- Catalog data lives in `src/lib/catalog.ts` (types, seed, localStorage store via useSyncExternalStore); all pages read through `useCatalog()` so a future backend can replace the store in one place.
- Seed records must never carry invented prices, specs or "verified" status; unknowns stay null / "Por verificar".
