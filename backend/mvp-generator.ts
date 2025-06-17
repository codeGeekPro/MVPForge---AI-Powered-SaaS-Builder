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

interface GeneratedFile {
  path: string;
  content: string;
  type: 'component' | 'page' | 'api' | 'config' | 'database';
}

interface DeploymentConfig {
  vercel?: {
    projectId: string;
    teamId: string;
  };
  railway?: {
    projectId: string;
    serviceId: string;
  };
  env: Record<string, string>;
}

interface BusinessPlan {
  marketSize: string;
  targetAudience: string[];
  revenueModel: string;
  pricingStrategy: {
    tiers: Array<{
      name: string;
      price: number;
      features: string[];
    }>;
  };
  marketingStrategy: string[];
  growthMetrics: string[];
}

interface Architecture {
  frontend: {
    framework: string;
    components: string[];
    stateManagement: string;
  };
  backend: {
    framework: string;
    database: string;
    apis: string[];
  };
  infrastructure: {
    hosting: string;
    cdn: string;
    monitoring: string[];
  };
}

interface GeneratedMVP {
  projectName: string;
  files: GeneratedFile[];
  deploymentConfig: DeploymentConfig;
  businessPlan: BusinessPlan;
  architecture: Architecture;
  nextSteps: string[];
}

interface UIFile {
  name: string;
  content: string;
}

interface BackendFile {
  name: string;
  content: string;
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
      businessPlan: businessResult.data as BusinessPlan,
      architecture: archResult.data as Architecture,
      nextSteps: this.generateNextSteps(businessResult.data as BusinessPlan, archResult.data as Architecture)
    };
  }

  private extractFeatures(idea: string): string[] {
    const commonFeatures = [
      'authentification',
      'dashboard',
      'profil utilisateur',
      'paiements',
      'notifications'
    ];
    
    return commonFeatures;
  }

  private generateProjectName(idea: string): string {
    const words = idea.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(' ')
      .filter(word => word.length > 2)
      .slice(0, 2);
    
    return words.join('-') + '-mvp';
  }

  private processUIFiles(files: UIFile[]): GeneratedFile[] {
    return files.map(file => ({
      path: `src/components/${file.name}`,
      content: this.enhanceUIComponent(file.content),
      type: 'component'
    }));
  }

  private processBackendFiles(files: BackendFile[]): GeneratedFile[] {
    return files.map(file => ({
      path: `api/${file.name}`,
      content: this.enhanceAPICode(file.content),
      type: 'api'
    }));
  }

  private enhanceUIComponent(content: string): string {
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

  private generateConfigFiles(idea: string, businessModel: string): GeneratedFile[] {
    const files: GeneratedFile[] = [];

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
      type: 'config'
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
      type: 'config'
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
      type: 'config'
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
  user   User   @relation(fields: [userId], references: [id])
  plan   String
  status String
  startDate DateTime @default(now())
  endDate   DateTime?
}` : ''}

${businessModel === 'marketplace' ? `
model Listing {
  id          String   @id @default(cuid())
  title       String
  description String
  price       Float
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}` : ''}`,
      type: 'database'
    });

    return files;
  }

  private generateDeploymentConfig(projectName: string): DeploymentConfig {
    return {
      vercel: {
        projectId: `mvp-${projectName}`,
        teamId: process.env.VERCEL_TEAM_ID || ''
      },
      env: {
        DATABASE_URL: process.env.DATABASE_URL || '',
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || '',
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || ''
      }
    };
  }

  private generateNextSteps(businessPlan: BusinessPlan, architecture: Architecture): string[] {
    return [
      'Configurer les variables d\'environnement',
      'Déployer la base de données',
      'Mettre en place l\'authentification',
      'Configurer les paiements',
      'Déployer sur Vercel'
    ];
  }

  async createProjectZip(mvp: GeneratedMVP): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const archive = archiver('zip', {
        zlib: { level: 9 }
      });

      const chunks: Buffer[] = [];
      archive.on('data', (chunk: Buffer) => chunks.push(chunk));
      archive.on('end', () => resolve(Buffer.concat(chunks)));
      archive.on('error', (err: Error) => reject(err));

      // Ajouter tous les fichiers au zip
      mvp.files.forEach(file => {
        archive.append(file.content, { name: file.path });
      });

      // Ajouter le README
      archive.append(this.generateREADME(mvp), { name: 'README.md' });

      archive.finalize();
    });
  }

  private generateREADME(mvp: GeneratedMVP): string {
    return `# ${mvp.projectName}

## Description
Projet MVP généré automatiquement par MVPForge.

## Installation
\`\`\`bash
npm install
\`\`\`

## Configuration
1. Copiez \`.env.example\` vers \`.env\`
2. Configurez les variables d'environnement

## Développement
\`\`\`bash
npm run dev
\`\`\`

## Déploiement
\`\`\`bash
npm run deploy
\`\`\`

## Prochaines étapes
${mvp.nextSteps.map(step => `- ${step}`).join('\n')}
`;
  }
}
