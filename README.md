# SaasForge - Générateur de MVP SaaS avec IA

SaasForge transforme instantanément vos idées en MVP SaaS complets grâce à une interface Next.js moderne, un backend Node.js/Express, une base de données Prisma/SQLite, et une IA multi-agents (OpenAI + fallback OpenRouter).

## Notre proposition de valeur
Transformez votre idée en MVP SaaS complet en moins de temps qu'il ne faut pour commander un café. Notre IA révolutionnaire comprend votre vision et la transforme en réalité, vous permettant de valider votre concept en quelques minutes plutôt qu'en plusieurs mois.

## Fonctionnalités principales
- Génération automatique de MVP SaaS à partir d'un prompt
- Multi-agents IA (UI/UX, Backend, Business, Analytics)
- Génération de code téléchargeable (ZIP)
- Aperçu interactif du MVP généré
- Tableau de bord analytique (utilisateurs, MRR, disponibilité, builds)
- Plans et Tarifs (monétisation)
- Section témoignages et preuves sociales
- Logs backend accessibles depuis le frontend
- Internationalisation (FR/EN)
- Accessibilité et SEO optimisés
- Tests unitaires (Jest/Supertest)
- CI/CD GitHub Actions
- Rate limiting et monitoring (Sentry + Pino)

## Installation
```bash
pnpm install
cd backend && pnpm install
```

## Lancement en développement
```bash
pnpm dev:all
```
- Frontend : http://localhost:3000
- Backend API : http://localhost:4000

## Configuration
- Placez vos clés API dans `backend/.env` (utilisez `backend/.env.example` comme modèle) :

## Documentation
Une documentation détaillée est disponible dans le dossier `docs/` :

- `docs/architecture.md` : Vue d'ensemble technique
- `docs/monitoring-observabilité.md` : Sentry, Pino, Prometheus, alertes
- `docs/environment.md` : Variables d'environnement & secrets
- `docs/ci-cd.md` : Workflows GitHub Actions & déploiement
- `docs/api-reference.md` : Endpoints backend principaux
- `docs/development.md` : Guide installation & développement

Gardez ces fichiers à jour lors de toute évolution majeure.

### Monitoring & Sentry

Le projet est instrumenté avec Sentry (profiling + tracing) et Pino pour les logs structurés.

Variables d'environnement (local et CI):

```
# Frontend
NEXT_PUBLIC_SENTRY_DSN=VotreDSN

# Backend
SENTRY_DSN=VotreDSN

# Upload sourcemaps (CI)
SENTRY_ORG=votre-org
SENTRY_PROJECT=votre-projet
SENTRY_AUTH_TOKEN=token-avec-scopes
```

Sourcemaps: le build Next.js est wrapé par `withSentryConfig` (voir `next.config.js`). Lors de `pnpm build`, Sentry CLI uploade automatiquement les sourcemaps si ces variables sont définies (ou via `sentry.properties`).

Logs backend: `pino` (pretty en dev, JSON en prod). Le middleware d'erreurs renvoie un `errorId` traçable (Sentry).

## Déploiement one-click
- Bouton "Déployer sur Vercel" intégré à la page d'accueil

## Aperçu et Analytics
- Aperçu interactif du MVP généré
- Tableau de bord analytique en temps réel simulé

## Sécurité et Accessibilité
- Rate limiting, logs Winston, monitoring
- Accessibilité ARIA, SEO, responsive, mode sombre

---

**Auteur :** [DOUTI Lamoussa]
