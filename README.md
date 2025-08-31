# AcceleraQA

Netlify-hosted SPA (Vite + React + TS + Tailwind) with serverless functions and Netlify Blobs storage.

## Goals

- Pharma Quality & Compliance learning assistant
- Concise chat answers + 3–6 **Further learning** resources (side pane)
- Admin: edit system prompt, manage simple RAG docs, view/export logs
- Users: 30‑day history ("Notebook") and CSV export

## Stack

- **Frontend:** Vite + React + TypeScript + Tailwind
- **Auth:** Netlify Identity (admin role or email allowlist)
- **Serverless:** Netlify Functions (TypeScript, esbuild bundler)
- **Storage:** Netlify Blobs (`settings-store`, `rag-store`, `logs-store`)
- **LLM:** OpenAI (Chat Completions first, fallback to Responses API)

## Quickstart

```bash
npm install
cp .env.example .env   # fill in OPENAI_API_KEY and allowlist emails
npm run dev            # runs `netlify dev` (frontend + functions)
```

Deploy to Netlify by connecting the repo. Ensure environment variables are set in **Site settings → Environment variables**.

## netlify.toml

- `build.command = npm run build`
- `publish = dist`
- `functions = netlify/functions`
- `node_bundler = esbuild`
- `external_node_modules = ["openai", "@netlify/blobs"]`
- Redirects:
  - `/api/* -> /.netlify/functions/:splat` (200)
  - `/* -> /index.html` (200)

## Auth

- Enable **Identity** on your Netlify site.
- Optionally configure role `admin` for your account in Identity.
- OR use email allowlist (set `ADMIN_EMAILS`/`VITE_ADMIN_EMAILS` as comma‑separated list).

## Environment

- `OPENAI_API_KEY` – required.
- `OPENAI_COMPLETIONS_MODEL` – default `gpt-4o-mini`.
- `OPENAI_MODEL` – fallback for Responses API, default `gpt-4.1-mini`.
- `CHAT_REQUIRE_AUTH` – `"true"` to require login for `/api/chat`.
- `DEBUG_ERROR_DETAILS` – `"true"` to include detailed errors in 500 JSON (do not enable in prod).
- `ADMIN_EMAILS` – server-side allowlist; `VITE_ADMIN_EMAILS` – frontend check.

## PowerShell smoke tests

Replace URL with your deployed site.

```powershell
$SITE = "https://YOUR-SITE.netlify.app"

# Should return 200 OK JSON
Invoke-RestMethod -Method GET  -Uri "$SITE/.netlify/functions/ping"

# Health
Invoke-RestMethod -Method GET  -Uri "$SITE/.netlify/functions/health"

# Chat (unauthenticated if CHAT_REQUIRE_AUTH=false)
Invoke-RestMethod -Method POST -Uri "$SITE/.netlify/functions/chat" -Body (@{ message="What is 21 CFR Part 11?" } | ConvertTo-Json) -ContentType "application/json"
```

## Troubleshooting

- **ETARGET or missing deps in functions**: ensure `netlify.toml` includes `external_node_modules` for `openai` and `@netlify/blobs` and they are present in `dependencies` (not devDependencies).
- **ES module syntax errors in functions**: leave `"type"` **unset** in `package.json` (CommonJS by default). Netlify will bundle TypeScript with esbuild; do not manually set `"type": "module"`.
- **Identity not available locally**: `netlify dev` injects Identity & functions. Make sure the Identity script is present in `index.html`.
- **CORS**: Not needed for same-origin SPA + functions. If calling from external origin, add appropriate headers.
- **Blank bubbles**: `SafeMarkdown` defends against empty content and sanitizes HTML.

## Folder Layout

```
/src                # Vite app
/netlify/functions  # Serverless functions (TypeScript)
/dist               # Built assets (Netlify publishes)
```

## License

MIT
