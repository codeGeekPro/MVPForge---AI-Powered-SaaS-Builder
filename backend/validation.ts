import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

// Schémas de validation
export const generateMvpSchema = z.object({
  prompt: z.string().min(10).max(1000),
});

export const classifyIdeaSchema = z.object({
  idea: z.string().min(5).max(500),
});

export const authLoginSchema = z.object({
  username: z.string().min(3).max(50),
});

// Middleware de validation
export function validateRequest(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).send({
          error: 'Données invalides',
          details: error.errors,
        });
        return;
      }
      next(error);
    }
  };
}

// Validation des paramètres de requête
export const validateQueryParams = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).send({
          error: 'Paramètres invalides',
          details: error.errors,
        });
        return;
      }
      next(error);
    }
  };
};
