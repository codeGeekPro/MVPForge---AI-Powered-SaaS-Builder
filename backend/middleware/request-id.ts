import type { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { logger, Sentry } from '../lib/monitoring';

// Génère un ID robuste (UUID v4) avec fallback si indisponible
function generateId(): string {
  try {
    return randomUUID();
  } catch {
    // Fallback simple: timestamp + aléatoire base36
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }
}

// Validation basique d'un ID fourni (éviter valeurs trop longues ou injection)
function isValidIncoming(id: string): boolean {
  return /^[A-Za-z0-9._\-]{8,128}$/.test(id);
}

/**
 * Middleware de corrélation: injecte X-Request-Id si absent et le propage
 * - Lit l'entête entrant `x-request-id` si valide
 * - Sinon génère un nouvel ID
 * - Attache `req.requestId` & réponse header `X-Request-Id`
 * - Crée un logger enfant lié à l'ID disponible sous `req.log`
 * - Ajoute un tag Sentry `request_id` pour corrélation traces/erreurs
 */
export function correlationMiddleware(req: Request, res: Response, next: NextFunction) {
  const incoming = (req.headers['x-request-id'] || req.headers['X-Request-Id']) as string | undefined;
  const requestId = incoming && isValidIncoming(incoming) ? incoming : generateId();

  // Attache sur l'objet requête (cast pour éviter TS error sans déclaration globale)
  (req as any).requestId = requestId;
  const child = (logger as any)?.child ? (logger as any).child({ requestId }) : logger;
  (req as any).log = child;

  // Entête de réponse standard
  res.setHeader('X-Request-Id', requestId);

  // Tag Sentry (ne crée pas de transaction ici, juste un tag global de scope)
  try {
    const scope = Sentry.getCurrentHub().getScope();
    scope?.setTag('request_id', requestId);
  } catch {
    // Ignorer silencieusement si Sentry non initialisé
  }

  next();
}
