// ai-engine/generateMvp.ts
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateMvpDescription(idea: string): Promise<string> {
  const prompt = `Tu es un expert SaaS. Génère une description détaillée de MVP pour l'idée suivante : ${idea}`;
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'Tu es un assistant SaaS.' },
      { role: 'user', content: prompt }
    ],
    max_tokens: 512
  });
  return completion.choices[0]?.message?.content || '';
}

// Exemple d'utilisation (à appeler depuis le backend ou un script)
// generateMvpDescription('CRM pour freelances').then(console.log);

// Exemple d'utilisation directe (exécutable en ligne de commande)
if (require.main === module) {
  const idea = process.argv[2] || "CRM pour freelances";
  generateMvpDescription(idea).then(result => {
    console.log("Description générée :\n", result);
  }).catch(console.error);
}
