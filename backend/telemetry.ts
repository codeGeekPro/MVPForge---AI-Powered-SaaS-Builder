// Initialisation paresseuse pour éviter dépendances manquantes en dev/test
export function initTelemetry() {
  if (!process.env.OTEL_EXPORTER_OTLP_ENDPOINT) return;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { NodeSDK } = require('@opentelemetry/sdk-node');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Resource } = require('@opentelemetry/resources');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

    const traceExporter = new OTLPTraceExporter({
      url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
      headers: process.env.OTEL_EXPORTER_OTLP_HEADERS ? Object.fromEntries(
        process.env.OTEL_EXPORTER_OTLP_HEADERS.split(',').map((kv: string) => {
          const [k, v] = kv.split('=');
          return [k.trim(), v.trim()];
        })
      ) : {},
    });

    const sdk = new NodeSDK({
      resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || 'mvpforge-backend',
        [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || 'development',
      }),
      traceExporter,
      instrumentations: [getNodeAutoInstrumentations({
        '@opentelemetry/instrumentation-fs': { enabled: false },
      })],
    });

    sdk.start().then(() => {
      // eslint-disable-next-line no-console
      console.log('[telemetry] OpenTelemetry SDK started');
    }).catch((err: any) => {
      console.error('[telemetry] Error starting OpenTelemetry SDK', err);
    });

    process.on('SIGTERM', () => {
      sdk.shutdown().then(() => {
        console.log('[telemetry] SDK shutdown complete');
      }).catch((err: any) => {
        console.error('[telemetry] Error during shutdown', err);
      }).finally(() => process.exit(0));
    });
  } catch (e) {
    console.warn('[telemetry] OpenTelemetry packages not installed or failed to init:', (e as Error).message);
  }
}
