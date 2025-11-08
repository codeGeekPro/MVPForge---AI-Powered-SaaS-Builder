# CI/CD

## Workflows GitHub Actions
- `ci-backend.yml`: Build & tests backend (initial).
- `ci-full.yml`: Tests backend + frontend, migrations Prisma (Postgres service), seed, build Next.js (upload sourcemaps Sentry).
- `deploy.yml`: Build et déploiement sur Vercel (sourcemaps Sentry + tests frontend avant build).

## Étapes principales (ci-full.yml)
1. Checkout
2. Setup Node + pnpm
3. Install deps (monorepo)
4. Prisma generate, migrate deploy, seed
5. Tests backend (`pnpm test:backend`)
6. Tests frontend (`pnpm test:frontend`)
7. Build Next.js (`pnpm build`) → upload sourcemaps Sentry
8. Artifact build `.next` (optionnel)

## Variables nécessaires (Secrets)
| Variable | Usage |
|----------|-------|
| SENTRY_DSN | Capture erreurs & traces |
| SENTRY_AUTH_TOKEN | Upload sourcemaps |
| SENTRY_ORG / SENTRY_PROJECT | Identité Sentry |
| VERCEL_TOKEN / VERCEL_ORG_ID / VERCEL_PROJECT_ID | Déploiement Vercel |
| DATABASE_URL | Migrations Prisma |

## Release & Observabilité
- Chaque build Next.js = release Sentry (sourcemaps). Possibilité d'ajouter `SENTRY_RELEASE` (hash git) pour corrélation avancée.
- Ajouter step future: `export SENTRY_RELEASE=$GITHUB_SHA`.

## Optimisations futures
- Cache pnpm (déjà via `actions/setup-node`).
- Job matrix (Node 18/20) si compat multi-versions.
- Scan sécurité (npm audit, OSV).
- Upload rapport de couverture tests (Codecov).

## Déploiement
- Actuel: Vercel (frontend). Backend non déployé dans ce workflow (à prévoir: Railway/Fly.io/Render).
- Avenir: workflow distinct infra (Docker build + push + déploiement).
