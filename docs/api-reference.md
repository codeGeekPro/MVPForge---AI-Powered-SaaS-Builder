# API Reference

Base URL (dev): `http://localhost:4000`

## Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/login | Authentification utilisateur (JWT) |
| POST | /api/auth/register | Création de compte (selon implémentation) |

## IA / Génération
| Method | Path | Body | Description |
|--------|------|------|-------------|
| POST | /api/ai/generate | { prompt } | Génère un MVP (résumé + features + stack) |
| POST | /api/ai/classify | { idea } | Analyse secteur, viabilité, suggestions |
| POST | /api/ai/multi-agents | { idea } | 4 agents parallèles (UI/UX, Backend, Business, Analytics) |
| POST | /api/ai/generate-full-mvp | { idea } | MVP structuré complet (JSON) |
| POST | /api/ai/generate-code-zip | { idea } | Génère et renvoie un ZIP de code (stream) |
| POST | /api/ai/experiments | { idea } | Liste d'expérimentations A/B |

## Code & MVP
| Method | Path | Body | Description |
|--------|------|------|-------------|
| POST | /api/code/download-mvp | { projectName?, idea } | Fichiers JSON du projet (source) |
| POST | /api/mvp/save | { idea, result } | Sauvegarde MVP (assoc. utilisateur démo) |
| GET  | /api/mvp/history | - | Historique des MVPs générés |

## Santé & Observabilité
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/health | Health check complet (DB, Redis, OpenAI, uptime) |
| GET | /api/metrics | Metrics Prometheus (counters, histograms) |
| GET | /api/logs | Derniers logs Pino (via fichier) |

## Validation & Erreurs
- Toutes les entrées sont validées via Zod (erreur 400 si schéma non respecté).
- Rate limiting (429) pour endpoints IA (clé `error: 'Too many requests'`).
- Erreurs serveur: format `{ error: 'INTERNAL_ERROR', errorId }` (capturé Sentry).

## Codes de statut principaux
| Code | Usage |
|------|-------|
| 200 | Succès standard |
| 400 | Validation échouée |
| 401 | Auth manquante/incorrecte |
| 429 | Rate limiting |
| 500 | Erreur interne capturée |
| 503 | Health dégradée (endpoint /health) |

## Headers futurs (suggestion)
| Header | Description |
|--------|-------------|
| X-Request-Id | Corrélation requêtes/logs/traces |
| X-RateLimit-Remaining | Restant avant blocage |
| X-Trace-Id | Intégration OpenTelemetry/Sentry |

## Sécurité
- Input trimming & interdiction de `<script>` dans prompts.
- JWT recommandé pour endpoints sensibles (ex: save MVP). 
- À ajouter: signature des requêtes, contrôle RBAC (admin vs user).
