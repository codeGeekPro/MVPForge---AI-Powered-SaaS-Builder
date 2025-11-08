import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

// Schémas de validation
export const generateMvpSchema = z.object({
  prompt: z
    .string({
      required_error: 'Le prompt est requis.',
      invalid_type_error: 'Le prompt doit être une chaîne de caractères.',
    })
    .min(10, 'Le prompt doit faire au moins 10 caractères.')
    .max(2000, 'Le prompt ne peut pas dépasser 2000 caractères.')
    .trim()
    .refine((val) => !val.includes('<script>'), {
      message: 'Les balises script sont interdites.',
    }),
  
  options: z.object({
    businessModel: z.enum(['saas', 'marketplace', 'freemium']).optional(),
    targetMarket: z.string().max(100).optional(),
    techStack: z.array(z.string()).max(10).optional()
  }).optional()
});

export const classifyIdeaSchema = z.object({
  idea: z.string().min(5, 'L\'idée doit faire au moins 5 caractères.').max(500, 'L\'idée ne peut pas dépasser 500 caractères.').trim(),
});

export const authLoginSchema = z.object({
  username: z.string().min(3).max(50),
});

export const userIpSchema = z.string().ip({ message: "Adresse IP invalide." });
export const emailSchema = z.string().email({ message: "Adresse email invalide." });

// Middleware de validation du corps de la requête
export function validateBody<T>(schema: z.ZodSchema<T>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'VALIDATION_ERROR',
          details: error.errors,
        });
      }
      next(error);
    }
  };
}

// Middleware de validation des paramètres de requête
export const validateQueryParams = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.query = await schema.parseAsync(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'INVALID_QUERY_PARAMS',
          details: error.errors,
        });
        return;
      }
      next(error);
    }
  };
};
