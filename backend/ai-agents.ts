// Système d'agents IA spécialisés pour MVPForge
import { OpenAI } from 'openai';

interface AgentResponse {
  success: boolean;
  data: any;
  code?: string;
  files?: Array<{name: string, content: string}>;
}

export class AIAgentSystem {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  // Agent UI/UX - Génère les composants React + Chakra UI
  async generateUI(idea: string, features: string[]): Promise<AgentResponse> {
    const prompt = `
Génère les composants React avec Chakra UI pour cette idée SaaS: ${idea}

Fonctionnalités requises: ${features.join(', ')}

Retourne UNIQUEMENT du code TypeScript/JSX valide pour:
1. Page d'accueil moderne avec hero section
2. Dashboard utilisateur 
3. Composants de navigation
4. Pages de fonctionnalités principales

Utilise Chakra UI v3, TypeScript, et des animations Framer Motion.
`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });

      return {
        success: true,
        data: response.choices[0].message.content,
        files: this.parseCodeFiles(response.choices[0].message.content || '')
      };
    } catch (error) {
      return { success: false, data: error };
    }
  }

  // Agent Backend - API REST + Base de données
  async generateBackend(idea: string, features: string[]): Promise<AgentResponse> {
    const prompt = `
Génère une API REST complète pour cette idée SaaS: ${idea}

Fonctionnalités: ${features.join(', ')}

Retourne du code Node.js/Express/TypeScript avec:
1. Routes API pour toutes les fonctionnalités
2. Modèles de données (Prisma/MongoDB)
3. Authentification JWT
4. Validation des données (Zod)
5. Middleware de sécurité

Code production-ready avec gestion d'erreurs.
`;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    return {
      success: true,
      data: response.choices[0].message.content,
      files: this.parseCodeFiles(response.choices[0].message.content || '')
    };
  }

  // Agent Architecture - Plan technique complet
  async generateArchitecture(idea: string): Promise<AgentResponse> {
    const prompt = `
Crée un plan d'architecture technique complet pour: ${idea}

Inclus:
1. Stack technologique optimale
2. Architecture des données
3. Plan de déploiement (Vercel/Railway/AWS)
4. Stratégie de sécurité
5. Plan de scalabilité
6. Estimation des coûts
7. Roadmap technique

Format JSON structuré.
`;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    return {
      success: true,
      data: JSON.parse(response.choices[0].message.content || '{}')
    };
  }

  // Agent Business - Analyse de marché et stratégie
  async generateBusinessPlan(idea: string): Promise<AgentResponse> {
    const prompt = `
Analyse business complète pour: ${idea}

Génère:
1. Analyse de marché et concurrence
2. Persona utilisateur détaillé
3. Modèle économique (freemium, subscription, etc.)
4. Stratégie de pricing
5. Plan marketing initial
6. Métriques clés à suivre
7. Risques et opportunités

Format JSON structuré avec des données actionnables.
`;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
    });

    return {
      success: true,
      data: JSON.parse(response.choices[0].message.content || '{}')
    };
  }

  private parseCodeFiles(content: string): Array<{name: string, content: string}> {
    const files: Array<{name: string, content: string}> = [];
    const codeBlocks = content.match(/```[\s\S]*?```/g) || [];
    
    codeBlocks.forEach((block, index) => {
      const lines = block.split('\n');
      const firstLine = lines[0];
      let filename = `generated-${index + 1}`;
      
      // Détecter le type de fichier
      if (firstLine.includes('tsx') || firstLine.includes('jsx')) {
        filename += '.tsx';
      } else if (firstLine.includes('ts')) {
        filename += '.ts';
      } else if (firstLine.includes('json')) {
        filename += '.json';
      } else {
        filename += '.txt';
      }

      const content_code = lines.slice(1, -1).join('\n');
      files.push({ name: filename, content: content_code });
    });

    return files;
  }
}
