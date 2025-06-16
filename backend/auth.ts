import express, { Request, Response, NextFunction, Router } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router: Router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || 'default_secret';

// Interface pour étendre Request avec user
interface AuthenticatedRequest extends Request {
  user?: any;
}

// Middleware pour vérifier le token
function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Token manquant' });
    return;
  }

  jwt.verify(token, SECRET_KEY, (err: any, user: any) => {
    if (err) {
      res.status(403).json({ error: 'Token invalide' });
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
    res.status(400).json({ error: 'Nom d\'utilisateur requis' });
    return;
  }

  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

// Exemple d'endpoint sécurisé
router.get('/secure-data', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
  res.json({ message: 'Données sécurisées', user: req.user });
});

export default router;
