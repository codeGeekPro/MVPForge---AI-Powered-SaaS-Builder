import express, { Request, Response, NextFunction, Router } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router: Router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || 'default_secret';

// Interface pour étendre Request avec user
interface AuthenticatedRequest extends Request {
  user?: {
    username: string;
    iat: number;
    exp: number;
  };
}

// Middleware pour vérifier le token
function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    res.status(401).send({ error: 'Token manquant' });
    return;
  }

  jwt.verify(token, SECRET_KEY, (err: jwt.VerifyErrors | null, user: any) => {
    if (err) {
      res.status(403).send({ error: 'Token invalide' });
      return;
    }
    req.user = user;
    next();
  });
}

// Endpoint pour générer un token
router.post('/login', (req: Request, res: Response): void => {
  const { username } = req.body;
  if (!username) {
    res.status(400).send({ error: 'Nom d\'utilisateur requis' });
    return;
  }

  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
  res.status(200).send({ token });
});

// Exemple d'endpoint sécurisé
router.get('/secure-data', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
  res.status(200).send({ message: 'Données sécurisées', user: req.user });
});

export default router;
