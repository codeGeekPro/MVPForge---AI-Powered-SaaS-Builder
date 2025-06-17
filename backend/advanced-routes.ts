// API routes avancées pour MVPForge
import express, { Request, Response, NextFunction, Router } from 'express';
import { MVPGenerator } from './mvp-generator';
import { AIAgentSystem } from './ai-agents';

interface GenerateCompleteRequest {
  prompt: string;
  targetMarket: string;
  businessModel: string;
  techPreferences: string[];
}

interface Competitor {
  name: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  pricing: string;
  url: string;
}

interface CompetitionAnalysis {
  competitors: Competitor[];
  marketSize: string;
  competitionLevel: 'low' | 'medium' | 'high';
  opportunities: string[];
}

interface MarketGaps {
  featureGaps: string[];
  pricingGaps: string[];
  targetGaps: string[];
}

interface UserPersona {
  name: string;
  age: number;
  occupation: string;
  goals: string[];
  painPoints: string[];
}

interface UserJourney {
  persona: UserPersona;
  steps: string[];
  touchpoints: string[];
}

interface KPI {
  name: string;
  description: string;
  target: string;
  measurement: string;
}

interface Experiment {
  name: string;
  hypothesis: string;
  metrics: string[];
  duration: string;
}

const router: Router = express.Router();
const generator = new MVPGenerator(process.env.OPENAI_API_KEY!);

// Définition de l'interface MVPData pour typer les projets MVP générés
interface MVPFile {
  path: string;
  content: string;
  type?: 'component' | 'page' | 'api' | 'config' | 'database';
}

interface MVPData {
  projectName: string;
  files: MVPFile[];
  businessPlan: any;
  architecture: any;
  deploymentConfig: {
    provider: string;
    config: any;
    env?: Record<string, any>;
  };
  nextSteps: string[];
}

// 🚀 Génération MVP complète
router.post('/generate-complete', async (req: Request<{}, {}, GenerateCompleteRequest>, res: Response): Promise<void> => {
  try {
    const { prompt, targetMarket, businessModel, techPreferences } = req.body;
    
    // Cast businessModel to the allowed union type or undefined if not valid
    const allowedBusinessModels = ['saas', 'marketplace', 'freemium', 'subscription'] as const;
    const safeBusinessModel = allowedBusinessModels.includes(businessModel as any)
      ? (businessModel as 'saas' | 'marketplace' | 'freemium' | 'subscription')
      : undefined;

    const mvp = await generator.generateCompleteMVP({
      idea: prompt,
      targetMarket,
      businessModel: safeBusinessModel,
      techPreferences
    });

    res.status(200).send({
      success: true,
      mvp,
      downloadUrl: `/api/download/${mvp.projectName}`,
      deployUrl: `/api/deploy/${mvp.projectName}`
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).send({ error: errorMessage });
  }
});

// 📦 Téléchargement du projet complet
router.get('/download/:projectName', async (req: Request<{ projectName: string }>, res: Response): Promise<void> => {
  try {
    const mvp = await getMVPFromCache(req.params.projectName);
    // Adaptation: ajoute le champ 'type' requis à chaque fichier avec une valeur valide
    const filesWithType = mvp.files.map(file => ({
      ...file,
      type: (file.type && ['component', 'page', 'api', 'config', 'database'].includes(file.type))
        ? file.type
        : 'component' as 'component' // ou choisissez dynamiquement selon le contexte
    }));
    const mvpWithTypedFiles = { 
      ...mvp, 
      files: filesWithType,
      deploymentConfig: {
        ...mvp.deploymentConfig,
        env: mvp.deploymentConfig.env ?? {} // Ajoute 'env' si absent
      }
    };
    const zipBuffer = await generator.createProjectZip(mvpWithTypedFiles);
    
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${mvp.projectName}.zip"`
    });
    
    res.status(200).send(zipBuffer);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).send({ error: errorMessage });
  }
});

// 🚀 Déploiement automatique
router.post('/deploy/:projectName', async (req: Request<{ projectName: string }>, res: Response): Promise<void> => {
  try {
    const mvp = await getMVPFromCache(req.params.projectName);
    const deploymentResult = await deployToVercel(mvp);
    
    res.status(200).send({
      success: true,
      url: deploymentResult.url,
      deploymentId: deploymentResult.id
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).send({ error: errorMessage });
  }
});

// 🔍 Analyse concurrentielle en temps réel
router.post('/analyze-competition', async (req: Request<{}, {}, { idea: string }>, res: Response): Promise<void> => {
  try {
    const { idea } = req.body;
    const competitors = await analyzeCompetition(idea);
    
    res.status(200).send({
      competitors,
      marketGaps: await findMarketGaps(competitors.competitors),
      recommendations: await getStrategicRecommendations(competitors.competitors, idea)
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).send({ error: errorMessage });
  }
});

// 💰 Estimation de revenus et coûts
router.post('/revenue-estimation', async (req: Request<{}, {}, { idea: string; targetMarket: string; businessModel: string }>, res: Response): Promise<void> => {
  try {
    const { idea, targetMarket, businessModel } = req.body;
    
    const estimation = await calculateRevenueProjection({
      idea,
      targetMarket,
      businessModel,
      timeframe: '12months'
    });
    
    res.status(200).send(estimation);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).send({ error: errorMessage });
  }
});

// 🎯 Génération de personas utilisateur
router.post('/generate-personas', async (req: Request<{}, {}, { idea: string; targetMarket: string }>, res: Response): Promise<void> => {
  try {
    const { idea, targetMarket } = req.body;
    const personas = await generateUserPersonas(idea, targetMarket);
    
    res.status(200).send({
      personas,
      userJourneys: await generateUserJourneys(personas),
      painPoints: await identifyPainPoints(personas)
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).send({ error: errorMessage });
  }
});

// 📊 Métriques et KPIs suggérés
router.post('/suggest-metrics', async (req: Request<{}, {}, { idea: string; businessModel: string }>, res: Response): Promise<void> => {
  try {
    const { idea, businessModel } = req.body;
    const metrics = await suggestKPIs(idea, businessModel);
    
    res.status(200).send({
      coreMetrics: metrics.core,
      secondaryMetrics: metrics.secondary,
      trackingImplementation: metrics.implementation
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).send({ error: errorMessage });
  }
});

// 🧪 Suggestions d'expérimentations
router.post('/suggest-experiments', async (req: Request<{}, {}, { idea: string; stage?: string }>, res: Response): Promise<void> => {
  try {
    const { idea, stage = 'mvp' } = req.body;
    const experiments = await suggestExperiments(idea, stage);
    
    res.status(200).send({
      experiments,
      priorityOrder: experiments.map((exp, idx) => ({ ...exp, priority: idx + 1 })),
      timeline: generateExperimentTimeline(experiments)
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).send({ error: errorMessage });
  }
});

// Fonctions utilitaires
const mockMVPData: MVPData = {
  projectName: 'sample-mvp',
  files: [
    // Exemple de fichier avec le champ 'type' correct
    {
      path: 'README.md',
      content: '# Sample MVP',
      type: 'component'
    }
  ],
  businessPlan: {},
  architecture: {},
  deploymentConfig: {
    provider: 'vercel',
    config: {},
    env: {} // Ajoute la propriété 'env' requise
  },
  nextSteps: [
    'Customize your MVP',
    'Deploy to production',
    'Monitor user feedback'
  ]
};

async function getMVPFromCache(projectName: string): Promise<MVPData> {
  return mockMVPData;
}

async function deployToVercel(mvp: MVPData): Promise<{ url: string; id: string }> {
  const response = await fetch('https://api.vercel.com/v13/deployments', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.VERCEL_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: mvp.projectName,
      files: mvp.files.map(file => ({
        file: file.path,
        data: Buffer.from(file.content).toString('base64')
      })),
      projectSettings: {
        framework: 'nextjs'
      }
    })
  });
  
  const data = await response.json() as { url?: unknown; id?: unknown };
  // Validation simple du type attendu
  if (typeof data.url === 'string' && typeof data.id === 'string') {
    return { url: data.url, id: data.id };
  } else {
    throw new Error('Invalid deployment response from Vercel API');
  }
}

async function analyzeCompetition(idea: string): Promise<CompetitionAnalysis> {
  const aiAgents = new AIAgentSystem(process.env.OPENAI_API_KEY!);
  
  const analysisPrompt = `
Analyse la concurrence pour cette idée: ${idea}

Retourne un JSON avec:
1. competitors: [{ name, description, strengths, weaknesses, pricing, url }]
2. marketSize: estimation du marché
3. competitionLevel: 'low'|'medium'|'high'
4. opportunities: gaps identifiés

Format JSON uniquement.
`;

  const result = await aiAgents.generateBusinessPlan(analysisPrompt);
  return result.data as CompetitionAnalysis;
}

async function findMarketGaps(competitors: Competitor[]): Promise<MarketGaps> {
  return {
    featureGaps: ['AI integration', 'Mobile app', 'Real-time collaboration'],
    pricingGaps: ['Budget tier missing', 'Enterprise features'],
    targetGaps: ['SMBs underserved', 'International markets']
  };
}

async function getStrategicRecommendations(competitors: Competitor[], idea: string) {
  return [
    'Focus on AI-powered features for differentiation',
    'Target underserved SMB market segment', 
    'Implement freemium model with clear upgrade path',
    'Prioritize mobile-first experience',
    'Build strong community and content marketing'
  ];
}

async function calculateRevenueProjection(params: any) {
  // Modèle de projection de revenus basé sur l'industrie
  const { idea, targetMarket, businessModel, timeframe } = params;
  
  return {
    projections: {
      month3: { users: 100, revenue: 2000, costs: 500 },
      month6: { users: 500, revenue: 12000, costs: 3000 },
      month12: { users: 2000, revenue: 50000, costs: 15000 }
    },
    assumptions: [
      'Conversion rate: 3%',
      'Churn rate: 5% monthly',
      'Average revenue per user: $25/month'
    ],
    recommendations: [
      'Focus on reducing customer acquisition cost',
      'Improve onboarding to reduce churn',
      'Test pricing optimization'
    ]
  };
}

async function generateUserPersonas(idea: string, targetMarket: string) {
  return [
    {
      name: 'Sarah, Product Manager',
      age: 32,
      goals: ['Streamline product development', 'Improve team collaboration'],
      painPoints: ['Too many tools', 'Lack of real-time insights'],
      techSavviness: 'High',
      budget: '$100-500/month'
    },
    {
      name: 'Mike, Startup Founder',
      age: 28,
      goals: ['Build MVP quickly', 'Find product-market fit'],
      painPoints: ['Limited budget', 'Technical complexity'],
      techSavviness: 'Medium',
      budget: '$50-200/month'
    }
  ];
}

async function generateUserJourneys(personas: any[]) {
  return personas.map(persona => ({
    persona: persona.name,
    journey: [
      'Discovers problem',
      'Searches for solutions',
      'Evaluates options',
      'Signs up for trial',
      'Onboarding experience',
      'First value achievement',
      'Becomes paying customer'
    ],
    touchpoints: ['Google search', 'Social media', 'Product demo', 'Email'],
    emotions: ['Frustrated', 'Hopeful', 'Confused', 'Delighted']
  }));
}

async function identifyPainPoints(personas: any[]) {
  const allPainPoints = personas.flatMap(p => p.painPoints);
  return {
    primary: allPainPoints.slice(0, 3),
    secondary: allPainPoints.slice(3),
    solutions: allPainPoints.map(pain => `Address ${pain} with automated solution`)
  };
}

async function suggestKPIs(idea: string, businessModel: string) {
  const coreMetrics: Record<'saas' | 'marketplace' | 'freemium', string[]> = {
    saas: ['MRR', 'Churn Rate', 'CAC', 'LTV'],
    marketplace: ['GMV', 'Take Rate', 'Active Buyers/Sellers', 'NPS'],
    freemium: ['Conversion Rate', 'Free to Paid', 'Feature Adoption', 'Engagement']
  };

  const core =
    (['saas', 'marketplace', 'freemium'].includes(businessModel)
      ? coreMetrics[businessModel as 'saas' | 'marketplace' | 'freemium']
      : coreMetrics.saas);

  return {
    core,
    secondary: ['User Satisfaction', 'Support Tickets', 'Page Load Time'],
    implementation: [
      'Set up analytics (Mixpanel/Amplitude)',
      'Implement event tracking',
      'Create dashboard (Retool/Grafana)',
      'Set up automated reports'
    ]
  };
}

async function suggestExperiments(idea: string, stage: string) {
  const experiments = [
    {
      name: 'Landing Page A/B Test',
      hypothesis: 'A new headline will increase signups',
      metrics: ['Conversion Rate'],
      duration: '2 weeks'
    },
    {
      name: 'Onboarding Flow Optimization',
      hypothesis: 'Reducing steps will improve activation',
      metrics: ['Activation Rate'],
      duration: '1 week'
    },
    {
      name: 'Pricing Page Experiment',
      hypothesis: 'Adding testimonials increases paid conversions',
      metrics: ['Paid Conversion Rate'],
      duration: '2 weeks'
    }
  ];
  return experiments;
}

function generateExperimentTimeline(experiments: any[]) {
  return {
    timeline: experiments.map((exp, idx) => ({
      name: exp.name,
      start: `Week ${idx * 2 + 1}`,
      end: `Week ${idx * 2 + 2}`
    }))
  };
}

export default router;
