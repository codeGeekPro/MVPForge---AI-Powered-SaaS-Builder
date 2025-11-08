# Environnements & Variables

## Fichiers `.env`
- Racine: `.env` pour variables frontend (Next.js) + partagées (Sentry).
- Backend: `backend/.env` pour API keys sensibles.
- Exemples fournis: `.env.example` (racine) et `backend/.env.example`.

## Variables principales
| Nom | Description | Scope |
|-----|-------------|-------|
| NEXT_PUBLIC_API_URL | Base URL backend pour le frontend | Frontend |
| NEXT_PUBLIC_SENTRY_DSN | DSN Sentry client (navigateur) | Frontend |
| SENTRY_DSN | DSN Sentry backend | Backend |
| SENTRY_ORG / SENTRY_PROJECT / SENTRY_AUTH_TOKEN | Upload sourcemaps Sentry (CI) | CI |
| OPENAI_API_KEY | Clé OpenAI génération IA | Backend |
| OPENROUTER_API_KEY | Fallback IA secondaire | Backend |
| REDIS_URL | Redis pour rate limiting | Backend |
| DATABASE_URL | Connexion Postgres Prisma | Backend |
| SLACK_WEBHOOK_URL | Alertes health | Backend |
| BETTERSTACK_HEARTBEAT_URL | Ping de heartbeat uptime | Backend |
| LOG_LEVEL | Niveau logs Pino | Backend |

## Secrets à ne jamais commiter
- Toutes les clés API (OpenAI, OpenRouter, Sentry token, Slack webhook, DB credentials).
- Utiliser GitHub Actions Secrets pour CI/CD.

## Postgres (dev vs prod)
- Dev: `postgresql://postgres:postgres@localhost:5432/mvpforge_dev?schema=public`
- Prod: Fournir URL managée (Railway, Neon, RDS...) avec SSL et sauvegardes.

## Rotation de secrets
- Prévoir rotation trimestrielle (OpenAI + Sentry token + Slack webhook).
- Centralisation future via Vault / AWS Parameter Store.

## Bonnes pratiques
- Ajouter un script de vérification .env (lint variables manquantes).
- Définitions Typescript pour process.env via un wrapper (safe access).
