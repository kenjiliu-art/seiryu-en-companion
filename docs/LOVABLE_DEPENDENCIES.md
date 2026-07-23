# Lovable-Specific Dependencies

Things in this project that came from Lovable's template or hosting. None
of them prevent the app from running outside Lovable, but you'll want to
be aware of them if you fully migrate off the platform.

| Item | Where | Impact if you leave Lovable | Replacement |
|---|---|---|---|
| `@lovable.dev/vite-tanstack-config` | `devDependencies` in `package.json`, referenced by `vite.config.ts` | Vite config won't load. | Replace `vite.config.ts` with a standard TanStack Start setup — `@tanstack/router-plugin`, `@vitejs/plugin-react`, `@tailwindcss/vite`, `vite-tsconfig-paths`, and (optionally) `@cloudflare/vite-plugin`. Remove the `@lovable.dev/...` dependency. |
| Preview / published `.lovable.app` URLs | Cosmetic; documented in `TECHNICAL_HANDOFF.md` | None — just marketing. | Any custom domain via your new host. |
| Lovable project ID `e8cdb473-…` in `.lovable/project.json` | Local metadata only | None at runtime. | Delete `.lovable/` after your final Lovable sync if desired. |
| Cloudflare Worker target (`@cloudflare/vite-plugin`, `wrangler.jsonc`) | Not strictly Lovable-specific, but that's where Lovable's hosting deploys to | None if you also deploy to Cloudflare; otherwise ignored on Vercel / Netlify. | Optional — see `docs/DEPLOYMENT.md`. |
| Lovable-injected `<script>` in preview | Only added by the Lovable preview iframe; not in your source | None; it never ships to prod. | — |

Not present in this project (so no migration needed):

- **Lovable Cloud (Supabase)** — not enabled.
- **Lovable AI Gateway** — not used.
- **`LOVABLE_API_KEY`** — not required.
- **Standard connectors** (Slack, GitHub API, etc. through Lovable's gateway) — none linked.
- **Auth / user tables** — none.
- **Injected analytics / tracking** — none.
- **Backend functions / edge functions** — none authored; only the default TanStack Start SSR entry.

The final exported application does not require Lovable to run locally or
in production.
