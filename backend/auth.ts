import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || 'default_secret';

// Middleware pour vérifier le token
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token manquant' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token invalide' });
    req.user = user;
    next();
  });
}

// Endpoint pour générer un token
router.post('/login', (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'Nom d’utilisateur requis' });

  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

// Exemple d’endpoint sécurisé
router.get('/secure-data', authenticateToken, (req, res) => {
  res.json({ message: 'Données sécurisées', user: req.user });
});

export default router;
