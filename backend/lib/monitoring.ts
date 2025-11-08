import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import pino from 'pino';
import type { Request, Response, NextFunction } from 'express';

// Init Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});

// Logger structuré avec Pino
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  ...(process.env.NODE_ENV !== 'production'
    ? {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        },
      }
    : {}),
});

// Middleware de logging basique (requêtes)
export function requestLogger(req: Request, _res: Response, next: NextFunction) {
  logger.info({ method: req.method, url: req.url, ip: req.ip, ua: req.headers['user-agent'] }, 'HTTP request');
  next();
}

// Middleware error handler
export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  const errorId = Sentry.captureException(err);

  const userId = (req as any)?.user?.id || null;
  logger.error(
    {
      errorId,
      error: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
      userId,
    },
    'Unhandled error'
  );

  res.status(500).json({
    error: 'INTERNAL_ERROR',
    message: "Une erreur est survenue",
    errorId, // Pour le support
    support: 'support@mvpforge.com',
  });
}

export { Sentry };
