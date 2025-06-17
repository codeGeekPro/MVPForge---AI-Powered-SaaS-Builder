import express, { Router } from 'express';
import archiver from 'archiver';
import fs from 'fs';
import { OpenAI } from 'openai';

const router: Router = express.Router();

// Endpoint : Génération de code téléchargeable (ZIP)
router.post('/api/ai/generate-code-zip', async (req, res) => {
  const { idea } = req.body;
  if (!idea) {
    res.status(400).json({ error: 'Champ "idea" requis' });
    return;
  }
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    // Génération de code (exemple simple, à enrichir)
    const prompts = [
      {
        filename: 'frontend.jsx',
        prompt: `Génère un composant React fonctionnel pour : ${idea}`
      },
      {
        filename: 'backend.js',
        prompt: `Génère un endpoint Express.js pour : ${idea}`
      },
      {
        filename: 'README.md',
        prompt: `Rédige un README pour un MVP SaaS : ${idea}`
      }
    ];

    // Génère chaque fichier en parallèle
    const files = await Promise.all(prompts.map(async ({ filename, prompt }) => {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 700
      });
      return {
        filename,
        content: completion.choices[0]?.message?.content || ''
      };
    }));

    // Création du ZIP en mémoire
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="mvp-code.zip"');
    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(res);
    files.forEach(file => {
      archive.append(file.content, { name: file.filename });
    });
    archive.finalize();
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    res.status(500).json({ error: 'Erreur génération ZIP', details: errorMessage });
  }
});

export default router;
