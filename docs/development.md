# Guide Développement

## Prérequis
- Node.js 20+
- pnpm
- Docker (si usage Postgres/Redis local)

## Installation
```bash
pnpm install
cd backend && pnpm install
```

## Démarrage (dev)
```bash
# Backend + Frontend simultanés
pnpm dev:all
# Ou séparément
pnpm dev          # frontend
cd backend && pnpm dev  # backend
```

## Base de données
- Postgres recommandé (docker-compose fourni).
```bash
docker compose up -d postgres
cd backend
pnpm prisma migrate dev --name init_v2
pnpm prisma db seed
```

## Tests
```bash
pnpm test:backend
pnpm test:frontend
pnpm test:all
```

## Migrations Prisma
- Schéma dans `backend/prisma/schema.prisma`.
- Génération client automatique via `postinstall`.

## Rate Limiting
- Configuré dans `backend/middleware/rate-limit.ts`.
- Redis si `REDIS_URL`, sinon fallback mémoire.

## Monitoring
- Sentry (frontend + backend) : configs sentry.*.config.ts.
- Pino logs: console + format JSON.
- Prometheus: `/api/metrics` (prom-client).
- Health: `/api/health`.

## Génération IA
- Fallback automatique OpenAI → OpenRouter si échec.
- Tests mockent OpenAI dans `backend/jest.setup.ts`.

## Environnement
- `.env.example` (racine): variables frontend & Sentry.
- `backend/.env.example`: backend (DB, OpenAI, Redis, Slack, Betterstack).

## Ajout d'un endpoint
1. Créer route dans `backend/index.ts` ou un fichier dans `backend/routes/`.
2. Ajouter validation Zod (ex: `validateBody(z.object({...}))`).
3. Ajouter rate limiting si IA ou coûteux.
4. Ajouter logs (automatique via middleware) + metrics (automatique via middleware).

## Build Production
```bash
pnpm build        # Next.js + sourcemaps Sentry (si secrets)
cd backend && pnpm build  # Transpile TypeScript backend
```

## Déploiement (actuel)
- Frontend: Vercel (`deploy.yml`).
- Backend: à containeriser (Dockerfile futur) et déployer (Railway/Fly.io...).

## Lint & Qualité (suggestion future)
- Ajouter `pnpm lint` + ESLint CI gate.
- Ajouter test coverage (Jest --coverage) + Codecov.

## Prochaines optimisations
- Error Boundary React + Sentry user feedback.
- X-Request-Id middleware.
- OpenTelemetry traces (OTLP exporter).
- Caching intelligent (Redis clé résultat IA).
