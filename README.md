# Primal Nutrition

Monorepo containing the full stack for [primalnutrition.in](https://primalnutrition.in).

```
├── frontend/   Storefront — Vite + React + Tailwind   → deployed to Netlify
└── api/        Backend — Node.js + Express + Supabase  → deployed to Render
```

## Live URLs

| Surface | URL |
|---|---|
| Storefront | https://primalnutrition.in |
| Backend API | https://primal-nutrition-website.onrender.com |
| Admin dashboard | (not yet deployed) |

## Local development

### Frontend
```bash
cd frontend
npm install
npm run dev      # http://localhost:5002
```

Set `VITE_API_URL` in `frontend/.env.local` to point at your backend (defaults to `http://localhost:8080`).

### Backend
```bash
cd api
npm install
cp .env.example .env       # fill in keys
npm run dev                # http://localhost:8080
```

See `api/README.md` for the full env var list and Supabase setup.

## Deployment

- **Frontend** auto-deploys to Netlify on push to `main` (when GitHub integration is connected) or manually via `netlify deploy --dir=dist --prod` from `frontend/`.
- **Backend** auto-deploys to Render on push to `main`. The `render.yaml` at the repo root tells Render the service code lives in `api/` (via `rootDir: api`).
