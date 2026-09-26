# MUHAFIZ AI — Frontend

Developer security platform frontend (React + Vite + TypeScript + Tailwind).
This is the **frontend only** — pair it with the existing MUHAFIZ AI backend API.

## What's in this version

- Redesigned UI: branded shield/"M" logo, top status bar (Audit Daemon status, live
  security score, quick search), sidebar with live badge counts on Scan Results and
  Auto-Fix, and a richer Dashboard (composite health card with score trend + compliance
  target, threat severity breakdown, recent scans).
- All original functionality kept: Login / Signup, Code Scanner, Scan Results, Auto-Fix,
  Detailed Report (CSV export), Projects, Integrations, Settings, and About.
- "Meet the Team" section on the About page with the real team and photos.

## Getting started

```bash
npm install
npm run dev
```

The app runs at http://localhost:5173 by default.

## Connecting to your backend

Set the API URL in `.env`:

```
VITE_API_URL=http://localhost:5000/api
```

The app expects the same REST API contract as before (`/auth`, `/scans`, `/issues`,
`/projects`, `/security-score`, `/scan/code`, `/integrations`) — no backend changes
needed.

## Build for production

```bash
npm run build
```

Output goes to `dist/`, ready to deploy to any static host (with your API reachable
at the configured `VITE_API_URL`).
