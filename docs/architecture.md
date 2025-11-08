# Architecture

## Vue d'ensemble
Le projet MVPForge est composé de deux parties principales:
- Frontend: Next.js (App Router), Chakra UI, Framer Motion, intégration Sentry.
- Backend: Express + TypeScript, Prisma (PostgreSQL en prod), OpenAI + fallback, rate limiting Redis, validation Zod.

### Frontend
- Pages App Router (`src/app/*`).
- Client API typé dans `src/lib/api.ts` (utilise `NEXT_PUBLIC_API_URL`).
- Sentry initialisé via `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`.
- Thème Chakra dans `src/theme.ts`.

### Backend
- Point d'entrée: `backend/index.ts`.
- Validation: `backend/validation.ts` (middleware `validateBody`).
- Auth: `backend/auth.ts` (JWT).
- IA & Fallback: `backend/free-api-manager.ts` (OpenAI puis OpenRouter).
- Rate limiting: `backend/middleware/rate-limit.ts` (Redis ou mémoire). 
- Prisma: `backend/prisma/schema.prisma` (modèles User, Mvp, ApiKey).
- Monitoring: `backend/lib/monitoring.ts` (Sentry + Pino).
- Métriques: `backend/lib/metrics.ts` (prom-client).
- Health & Metrics endpoints: `backend/routes/health.ts`.

### Base de données
- Prisma avec provider PostgreSQL.
- Migration initiale: `init_v2` (User, Mvp, ApiKey).
- Seed: `backend/prisma/seed.ts` (utilisateurs de démo + propriétaire).

### Sécurité & Robustesse
- Validation stricte Zod sur toutes les entrées sensibles.
- Rate limiting IP + stricte sur endpoints IA.
- Logging structuré + Sentry pour traçabilité.
- Proxy Next.js obsolète supprimé pour éviter duplication.

### Flux d'appel
1. Frontend appelle directement le backend (`NEXT_PUBLIC_API_URL`).
2. Backend effectue validation + (rate limit + logging + métriques).
3. IA générative via `FreeAPIManager` (fallback).
4. Réponse JSON renvoyée, logguée, métriques agrégées.

## Diagramme simplifié
```
[Next.js UI] --> [API Client] --> [Express Backend]
   |                |              |-> Validation Zod
   |                |              |-> Rate Limit (Redis)
   |                |              |-> Sentry + Pino
   |                |              |-> Prometheus metrics
   |                |              |-> Prisma (Postgres)
   |                |              |-> OpenAI / OpenRouter
```

## Diagramme (Mermaid)

```mermaid
flowchart LR
   subgraph Frontend
      UI[Next.js (App Router)] --> APIClient[Client API typé]
   end

   APIClient -- HTTPS --> BE[Express Backend]

   subgraph Backend
      BE --> Zod[Validation Zod]
      BE --> RL[Rate Limit (Redis)]
      BE --> Pino[Sentry + Pino]
      BE --> Prom[Prometheus /api/metrics]
      BE --> DB[(PostgreSQL via Prisma)]
      BE --> AI[OpenAI → OpenRouter (fallback)]
      BE --> Health[/Health Check /api/health/]
   end

   Prom -- scrape --> PromSrv[(Prometheus Server)]
   PromSrv --> Grafana[Grafana Dashboards]
   Health -- webhook --> Slack[Slack Alerts]
   Health -- heartbeat --> Betterstack[Betterstack Uptime]

   classDef svc fill:#eef,stroke:#88a,stroke-width:1px;
   classDef ext fill:#efe,stroke:#8a8,stroke-width:1px;
   class UI,APIClient,BE,DB,Prom,Health,RL,Pino,AI svc;
   class PromSrv,Grafana,Slack,Betterstack ext;
```

## Points d'amélioration futurs
- Introduire un API Gateway / BFF si croissance multi-services.
- Ajouter un système d'événements (Kafka ou Redis Streams) pour traitement asynchrone.
- Externaliser la configuration vers un service central (Vault / Parameter Store).
