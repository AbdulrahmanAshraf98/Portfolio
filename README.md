# Portfolio platform — split JSON + microservices

Public site and dashboard stay dynamic: each content part is its own JSON file, certificates are a dedicated service, and uploads are a dedicated files service. Uploaded file URLs are saved back into JSON from the dashboard.

## Apps

| App | URL (local) | Role |
|---|---|---|
| `apps/web` | :3000 | Public PWA |
| `apps/dashboard` | :3004 | Admin CMS (one user, no register) |

## Services (independent Vercel deployments)

| Service | Port | JSON / storage | Role |
|---|---|---|---|
| `services/identity` | 3001 | env only | Admin login / JWT |
| `services/catalog-query` | 3002 | split JSON parts | CQRS read: profile, experience, education, skills, projects, highlights, socials, contacts, settings |
| `services/catalog-command` | 3005 | split JSON parts | CQRS write for catalog parts |
| `services/graphql` | 3003 | — | Gateway: public reads + admin mutations |
| `services/certificates` | 3006 | `certificates.json` | Licenses & certifications |
| `services/files` | 3007 | disk `/tmp` or Vercel Blob | Multipart uploads; returns a public URL to store in JSON |

Catalog JSON is split on disk:

`profile.json` · `experiences.json` · `educations.json` · `skills.json` · `projects.json` · `socials.json` · `contacts.json` · `highlights.json` · `settings.json`

## Local run

Copy `.env.example` to `.env.local` (root) and into `apps/web/.env.local` + `apps/dashboard/.env.local` with at least `GRAPHQL_URL`, `INTERNAL_API_SECRET`, `ALLOWED_ORIGINS`, and for the dashboard also `FILES_URL`.

```bash
npm install
npm run dev:identity
npm run dev:command
npm run dev:query
npm run dev:certificates
npm run dev:files
npm run dev:graphql
npm run dev:web
npm run dev:dashboard
```

Dashboard: upload a file on a field (photo, CV, certificate, featured media). The files service returns a URL, the dashboard saves that URL into the matching JSON part, GraphQL merges everything for the public site.
