#!/usr/bin/env bash
set -euo pipefail

# Create a Grafana annotation on deploys
# Required env: GRAFANA_URL, GRAFANA_API_TOKEN
# Optional: DASHBOARD_UID, PANEL_ID, ENVIRONMENT, VERSION, GITHUB_SHA

: "${GRAFANA_URL:?GRAFANA_URL is required (e.g., https://grafana.example.com)}"
: "${GRAFANA_API_TOKEN:?GRAFANA_API_TOKEN is required (Grafana API Key with annotations:write)}"

ENVIRONMENT=${ENVIRONMENT:-${NODE_ENV:-production}}
VERSION=${VERSION:-${GITHUB_SHA:-unknown}}
DASHBOARD_UID=${DASHBOARD_UID:-}
PANEL_ID=${PANEL_ID:-}

BODY=$(jq -n \
  --arg time "$(date +%s%3N)" \
  --arg text "Deploy $ENVIRONMENT @ $VERSION" \
  --argjson tags "[\"deploy\", \"$ENVIRONMENT\"]" \
  --arg dashboardUid "$DASHBOARD_UID" \
  --arg panelId "$PANEL_ID" \
  '{time: ($time|tonumber), text: $text, tags: $tags} + ( ($dashboardUid|length)>0 and {dashboardUID:$dashboardUid} or {} ) + ( ($panelId|length)>0 and {panelId: ($panelId|tonumber)} or {} )')

curl -sS -X POST "$GRAFANA_URL/api/annotations" \
  -H "Authorization: Bearer $GRAFANA_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$BODY" | jq '.'

echo "Annotation created: $ENVIRONMENT @ $VERSION"
