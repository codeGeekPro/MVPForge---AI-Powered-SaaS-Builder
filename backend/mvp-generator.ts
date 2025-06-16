// Générateur de code complet pour MVPForge
import { AIAgentSystem } from './ai-agents';
import archiver from 'archiver';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';

interface MVPGenerationRequest {
  idea: string;
  targetMarket?: string;
  businessModel?: 'freemium' | 'subscription' | 'marketplace' | 'saas';
  techPreferences?: string[];
}

interface GeneratedMVP {
  projectName: string;
  files: Array<{
    path: string;
    content: string;
    type: 'component' | 'page' | 'api' | 'config' | 'database';
  }>;
  deploymentConfig: {
    vercel?: any;
    railway?: any;
    env: Record<string, string>;
  };
  businessPlan: any;
  architecture: any;
  nextSteps: string[];
}

export class MVPGenerator {
  private aiAgents: AIAgentSystem;

  constructor(openaiKey: string) {
    this.aiAgents = new AIAgentSystem(openaiKey);
  }

  async generateCompleteMVP(request: MVPGenerationRequest): Promise<GeneratedMVP> {
    const { idea, targetMarket, businessModel = 'saas' } = request;
    
    // 1. Génération en parallèle avec tous les agents
    const [uiResult, backendResult, archResult, businessResult] = await Promise.all([
      this.aiAgents.generateUI(idea, this.extractFeatures(idea)),
      this.aiAgents.generateBackend(idea, this.extractFeatures(idea)),
      this.aiAgents.generateArchitecture(idea),
      this.aiAgents.generateBusinessPlan(idea)
    ]);

    // 2. Génération des fichiers de configuration
    const configFiles = this.generateConfigFiles(idea, businessModel);
    
    // 3. Assemblage du projet complet
    const projectName = this.generateProjectName(idea);
    const files = [
      ...this.processUIFiles(uiResult.files || []),
      ...this.processBackendFiles(backendResult.files || []),
      ...configFiles
    ];

    // 4. Configuration de déploiement
    const deploymentConfig = this.generateDeploymentConfig(projectName);

    return {
      projectName,
      files,
      deploymentConfig,
      businessPlan: businessResult.data,
      architecture: archResult.data,
      nextSteps: this.generateNextSteps(businessResult.data, archResult.data)
    };
  }

  private extractFeatures(idea: string): string[] {
    // IA simple pour extraire les fonctionnalités clés
    const commonFeatures = [
      'authentification',
      'dashboard',
      'profil utilisateur',
      'paiements',
      'notifications'
    ];
    
    // À améliorer avec une vraie extraction IA
    return commonFeatures;
  }

  private generateProjectName(idea: string): string {
    // Génère un nom de projet basé sur l'idée
    const words = idea.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(' ')
      .filter(word => word.length > 2)
      .slice(0, 2);
    
    return words.join('-') + '-mvp';
  }

  private processUIFiles(files: Array<{name: string, content: string}>): Array<{path: string, content: string, type: any}> {
    return files.map(file => ({
      path: `src/components/${file.name}`,
      content: this.enhanceUIComponent(file.content),
      type: 'component' as const
    }));
  }

  private processBackendFiles(files: Array<{name: string, content: string}>): Array<{path: string, content: string, type: any}> {
    return files.map(file => ({
      path: `api/${file.name}`,
      content: this.enhanceAPICode(file.content),
      type: 'api' as const
    }));
  }

  private enhanceUIComponent(content: string): string {
    // Ajoute des améliorations automatiques aux composants
    const enhancements = `
// Auto-générés par MVPForge
import { useColorModeValue, useToast } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const MotionBox = motion(Box);
`;
    
    return enhancements + '\n' + content;
  }

  private enhanceAPICode(content: string): string {
    // Ajoute des améliorations automatiques aux APIs
    const enhancements = `
// Auto-générés par MVPForge
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { z } from 'zod';

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
`;
    
    return enhancements + '\n' + content;
  }

  private generateConfigFiles(idea: string, businessModel: string): Array<{path: string, content: string, type: any}> {
    const files = [];

    // Package.json
    files.push({
      path: 'package.json',
      content: JSON.stringify({
        name: this.generateProjectName(idea),
        version: '1.0.0',
        private: true,
        scripts: {
          dev: 'next dev',
          build: 'next build',
          start: 'next start',
          lint: 'next lint',
          deploy: 'vercel --prod'
        },
        dependencies: {
          '@chakra-ui/react': '^3.21.0',
          '@emotion/react': '^11.14.0',
          '@emotion/styled': '^11.14.0',
          'framer-motion': '^12.18.1',
          'next': '^15.3.1',
          'react': '^18.2.0',
          'react-dom': '^18.2.0',
          'axios': '^1.6.0',
          'next-auth': '^4.24.0',
          '@stripe/stripe-js': '^4.4.0',
          'prisma': '^5.20.0',
          '@prisma/client': '^5.20.0'
        },
        devDependencies: {
          '@types/node': '^20.0.0',
          '@types/react': '^18.2.0',
          'typescript': '^5.0.0',
          'eslint': '^9.29.0',
          'eslint-config-next': '^15.3.3'
        }
      }, null, 2),
      type: 'config' as const
    });

    // Next.js config
    files.push({
      path: 'next.config.js',
      content: `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

module.exports = nextConfig`,
      type: 'config' as const
    });

    // Vercel.json
    files.push({
      path: 'vercel.json',
      content: JSON.stringify({
        version: 2,
        builds: [
          {
            src: 'package.json',
            use: '@vercel/next'
          }
        ],
        env: {
          NODE_ENV: 'production'
        }
      }, null, 2),
      type: 'config' as const
    });

    // Prisma schema
    files.push({
      path: 'prisma/schema.prisma',
      content: `// Auto-généré par MVPForge
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations basées sur le business model
  ${businessModel === 'subscription' ? 'subscription Subscription?' : ''}
  ${businessModel === 'marketplace' ? 'listings Listing[]' : ''}
}

${businessModel === 'subscription' ? `
model Subscription {
  id     String @id @default(cuid())
  userId String @unique
  plan   String
  status String
  user   User   @relation(fields: [userId], references: [id])
}` : ''}

${businessModel === 'marketplace' ? `
model Listing {
  id          String   @id @default(cuid())
  title       String
  description String
  price       Float
  userId      String
  createdAt   DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id])
}` : ''}`,
      type: 'database' as const
    });

    return files;
  }

  private generateDeploymentConfig(projectName: string) {
    return {
      vercel: {
        name: projectName,
        version: 2,
        builds: [{ src: 'package.json', use: '@vercel/next' }]
      },
      railway: {
        build: {
          builder: 'nixpacks'
        },
        deploy: {
          startCommand: 'npm start'
        }
      },
      env: {
        NODE_ENV: 'production',
        NEXTAUTH_SECRET: 'your-secret-here',
        NEXTAUTH_URL: 'https://your-domain.vercel.app',
        DATABASE_URL: 'postgresql://username:password@localhost:5432/database',
        STRIPE_PUBLIC_KEY: 'pk_test_...',
        STRIPE_SECRET_KEY: 'sk_test_...'
      }
    };
  }

  private generateNextSteps(businessPlan: any, architecture: any): string[] {
    return [
      '🔧 Configurer les variables d\'environnement',
      '💾 Déployer la base de données (Railway/Supabase)',
      '🚀 Déployer le frontend sur Vercel',
      '💳 Configurer Stripe pour les paiements',
      '📧 Intégrer un service d\'email (Resend/SendGrid)',
      '📊 Ajouter l\'analytics (Vercel Analytics/Posthog)',
      '🔒 Configurer l\'authentification (NextAuth)',
      '🧪 Lancer des tests utilisateur',
      '📈 Implémenter les métriques business',
      '🎯 Optimiser pour le SEO et la performance'
    ];
  }

  // Méthode pour créer un ZIP du projet
  async createProjectZip(mvp: GeneratedMVP): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const archive = archiver('zip', { zlib: { level: 9 } });
      const chunks: Buffer[] = [];

      archive.on('data', (chunk) => chunks.push(chunk));
      archive.on('end', () => resolve(Buffer.concat(chunks)));
      archive.on('error', reject);

      // Ajouter tous les fichiers au ZIP
      mvp.files.forEach(file => {
        archive.append(file.content, { name: file.path });
      });

      // Ajouter le README
      archive.append(this.generateREADME(mvp), { name: 'README.md' });
      
      // Ajouter le plan business
      archive.append(
        JSON.stringify(mvp.businessPlan, null, 2), 
        { name: 'business-plan.json' }
      );

      archive.finalize();
    });
  }

  private generateREADME(mvp: GeneratedMVP): string {
    return `# ${mvp.projectName}

🚀 **Généré automatiquement par MVPForge**

## Quick Start

\`\`\`bash
npm install
npm run dev
\`\`\`

## Déploiement

\`\`\`bash
npm run deploy
\`\`\`

## Next Steps

${mvp.nextSteps.map(step => `- [ ] ${step}`).join('\n')}

## Architecture

${JSON.stringify(mvp.architecture, null, 2)}

---
*Généré avec ❤️ par MVPForge*
`;
  }
}
