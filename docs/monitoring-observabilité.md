# Monitoring & Observabilité# Monitoring & Observabilité



Cette section décrit l'architecture d'observabilité mise en place (logs, métriques, traces, alertes, visualisation) et comment l'étendre rapidement.## Composants

- Sentry (traces + profiling + erreurs backend & frontend)

## Composants- Pino (logs JSON structurés côté backend)

- **Sentry** (traces + profiling + erreurs backend & frontend)- Prometheus (exposition via prom-client sur `/api/metrics`)

- **Pino** (logs JSON structurés côté backend)- Slack (webhook alert sur statut health dégradé)

- **Prometheus** (exposition via prom-client sur `/api/metrics`)- Betterstack (heartbeat uptime optionnel)

- **Slack** (webhook alert sur statut health dégradé)

- **Betterstack** (heartbeat uptime optionnel)## Sentry

- **Grafana** (dashboards + alerting + annotations)- Initialisation backend: `backend/lib/monitoring.ts`

- **OpenTelemetry** (export OTLP traces vers collecteur externe)- Initialisation frontend: `sentry.*.config.ts` (client, server, edge)

- Sourcemaps: upload automatique via `withSentryConfig` dans `next.config.js` (CI + build local si secrets présents)

## Sentry- Variables clés: `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`.

- Initialisation backend: `backend/lib/monitoring.ts`

- Initialisation frontend: `sentry.*.config.ts` (client, server, edge)## Logs (Pino)

- Sourcemaps: upload automatique via `withSentryConfig` dans `next.config.js` (CI + build local si secrets présents)- Format JSON en production, pretty en développement.

- Variables clés: `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`- Inclus: method, url, ip, user-agent, errorId (si exception). 

- Idée future: ajouter `X-Request-Id` et corrélation Sentry.

## Logs (Pino)

- Format JSON en production, pretty en développement## Métriques (Prometheus)

- Inclus: method, url, ip, user-agent, errorId (si exception)- Fichier: `backend/lib/metrics.ts`

- Idée future: ajouter `X-Request-Id` et corrélation Sentry- Metrics exposées:

  - `http_requests_total{method,route,status}`

## Métriques (Prometheus)  - `http_responses_total{method,route,status}`

- Fichier: `backend/lib/metrics.ts`  - `http_response_time_ms_bucket/sum/count{method,route,status}` (Histogram)

- Metrics exposées:  - `cache_hits_total`, `cache_misses_total`, `cache_hit_rate`

  - `http_requests_total{method,route,status}` (compteur requêtes entrantes)  - + Default metrics (process, memory) via `collectDefaultMetrics()`.

  - `http_responses_total{method,route,status}` (compteur réponses émises)- Endpoint scrape: `GET /api/metrics` (Content-Type: Prometheus standard).

  - `http_response_time_ms_bucket/sum/count{method,route,status}` (Histogram latence)

  - `cache_hits_total`, `cache_misses_total`, `cache_hit_rate` (qualité cache interne)## Health Check

  - + Default metrics (process, mémoire, GC) via `collectDefaultMetrics()`- Endpoint: `GET /api/health`

- **Labels par défaut ajoutés**: `app="mvpforge"`, `env` (NODE_ENV) via `register.setDefaultLabels()` pour faciliter les filtres multi-environnements- Champs:

- Endpoint scrape: `GET /api/metrics` (Content-Type: Prometheus standard)  - `status`: `OK` | `DEGRADED`

  - `timestamp` ISO

## Health Check  - `uptime` (sec)

- Endpoint: `GET /api/health`  - `checks.database` (ok/error)

- Champs:  - `checks.redis` (ok/error/missing)

  - `status`: `OK` | `DEGRADED`  - `checks.openai` (ok/missing/error)

  - `timestamp` ISO- Code retour: 200 si OK, 503 sinon.

  - `uptime` (sec)- Slack: envoi webhook si status ≠ OK.

  - `checks.database` (ok/error)- Betterstack heartbeat: ping si configuré et status OK.

  - `checks.redis` (ok/error/missing)

  - `checks.openai` (ok/missing/error)## Alerting Slack

- Code retour: 200 si OK, 503 sinon- Variable: `SLACK_WEBHOOK_URL`

- Slack: envoi webhook si status ≠ OK- Format message: JSON `{ text: "⚠️ Health degraded: ..." }`

- Betterstack heartbeat: ping si configuré et status OK- Amélioration future: regrouper les alertes et ajouter context (version, commit, release). 



## Alerting Slack## Bonnes pratiques futures

- Variable: `SLACK_WEBHOOK_URL`- Ajouter `register.setDefaultLabels({ app: 'mvpforge', env: process.env.NODE_ENV })`.

- Format message: JSON `{ text: "⚠️ Health degraded: ..." }`- Exposer un gauge de mémoire Node.js manuel (si nécessaire) en plus des defaults.

- Amélioration future: regrouper les alertes et ajouter context (version, commit, release)- Intégrer Grafana + dashboards (latence p95/p99, erreurs par route, taux de cache).

- Ajouter OTLP export (OpenTelemetry) pour ingestion traces unifiées (Sentry ou autre backend tracing).

## Dashboard Grafana

## Dashboard Grafana exemple

Dashboard prêt à importer: **`docs/grafana-dashboard.json`**

Un dashboard prêt à importer est fourni: `docs/grafana-dashboard.json`.

### Import rapide

1. Grafana > Dashboards > Import### Import rapide

2. Coller le JSON ou uploader le fichier1. Ouvrir Grafana > Dashboards > Import.

3. Sélectionner datasource Prometheus (`prometheus`)2. Coller le contenu JSON ou sélectionner le fichier.

4. (Optionnel) Préfixer les variables si multi-env3. Choisir la datasource Prometheus utilisée par votre instance (`prometheus`).

5. Valider4. Valider; le dashboard "MVPForge - API Observability" apparaît.



### Panneaux inclus### Panneaux inclus

- **RPS par route** (rate `http_responses_total`)- Requêtes par seconde (par route)

- **Latence p50/p95/p99** (quantiles histogram `http_response_time_ms_bucket`)- Latence p50/p95/p99 (histogram_quantile sur `http_response_time_ms_bucket`)

- **Taux d'erreurs (5xx%)** global- Taux d'erreurs (5xx %) global

- **Hit ratio cache** (`cache_hit_rate`)- Taux de hit cache (%) via `cache_hit_rate`

- **Distribution codes HTTP**- Distribution des codes réponse

- **Requêtes par méthode**- Requêtes par méthode

- **CPU process** (user+system seconds rate)

- **Mémoire RSS process**### Extension suggérée

- Ajouter un panneau pour saturation (CPU, mémoire) à partir de `process_*` metrics.

### Alertes Grafana- Ajouter une alerte Grafana: p95 latence > 500ms sur 5m ou error rate > 2%.

- Fichier d'exemple: **`docs/grafana-alerts.yaml`**- Ajouter annotation déploiements (webhook ou Grafana API).

  - Latence p95 > 500ms pendant 5m

  - Error rate > 2% pendant 5m## Diagramme Architecture

  - CPU > ~70% pendant 5mVoir le diagramme Mermaid dans `docs/architecture.md` (section "Diagramme (Mermaid)") pour la vision complète flux UI -> Backend -> Observabilité.

  - RSS > ~800MB pendant 5m
- Import via Alerting > Alert rules (Grafana v9+) ou via provisioning
- Adapter l'UID datasource si différent de `prometheus`

### Annotations de déploiement
- Script fourni: **`scripts/post-deploy-annotation.sh`**
- Requiert: `GRAFANA_URL`, `GRAFANA_API_TOKEN`
- À déclencher en fin de pipeline CI/CD pour tracer les releases (corrélation perf vs déploiements)
- Exemple d'utilisation:
  ```bash
  export GRAFANA_URL=https://grafana.example.com
  export GRAFANA_API_TOKEN=glsa_xxx
  export ENVIRONMENT=production
  export VERSION=${GITHUB_SHA}
  ./scripts/post-deploy-annotation.sh
  ```

## OTLP (Traces OpenTelemetry)
- Code: **`backend/telemetry.ts`** (auto-instrumentations Node + exporter OTLP HTTP)
- Initialisation: `initTelemetry()` importé au début de `backend/index.ts`
- Variables d'environnement:
  - `OTEL_EXPORTER_OTLP_ENDPOINT` (ex: https://collector.example.com/v1/traces)
  - `OTEL_EXPORTER_OTLP_HEADERS` (format `key=value,key2=value2`, ex: `x-honeycomb-team=XXXX,x-honeycomb-dataset=mvpforge`)
  - `OTEL_SERVICE_NAME` (ex: `mvpforge-backend`)
- Désactivation sélective instrumentation FS pour réduire le bruit

### Intégration Sentry & OTLP
- Sentry reste la source d'erreurs + profils
- OTLP fournit traces distribuées (extensible à bases ou autres services)
- Possibilité d'ajouter `@opentelemetry/instrumentation-express` (déjà inclus via auto-instrumentations) pour spans par route

## Bonnes pratiques futures
- **Corrélation**: ajouter `X-Request-Id` injecté dans chaque requête et propagé dans logs + Sentry + traces
- **Améliorer cache**: exposer en plus un gauge `cache_items` et un counter `cache_evictions_total`
- **Mémoire avancée**: ajouter gauge custom `heap_used_percent` si saturation fréquente
- **Alertes adaptatives**: créer des alertes dynamiques (ex: basées sur p95 baseline + écart)
- **Export métriques**: vers un backend longue rétention (VictoriaMetrics / Thanos) si croissance forte

## Récapitulatif des mises à jour récentes

✅ **Labels par défaut Prometheus** (`app`, `env`) configurés dans `backend/lib/metrics.ts`  
✅ **Dashboard enrichi** avec panneaux CPU & mémoire (process_cpu_*, process_resident_memory_bytes)  
✅ **Fichier d'alertes Grafana** prêt à l'emploi (`docs/grafana-alerts.yaml`)  
✅ **Script annotations de déploiement** (`scripts/post-deploy-annotation.sh`)  
✅ **Export traces OTLP** configurable (fichier `backend/telemetry.ts`)  
✅ **Variables OTLP** ajoutées aux `.env.example` (racine + backend)  
✅ **Tests backend** avec couverture >80% (statements, branches, lines, functions)

## Diagramme Architecture
Voir le diagramme Mermaid dans `docs/architecture.md` (section "Diagramme (Mermaid)") pour la vision complète flux UI → Backend → Observabilité.

---
**Pour aller plus loin**: ajouter OpenTelemetry metrics + logs unifiés, puis corrélation multi-services si vous scindez l'API.
