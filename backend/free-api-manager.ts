// Configuration des APIs gratuites pour MVPForge
import { OpenAI } from 'openai';
import fetch from 'node-fetch';

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface GeolocationData {
  ip_address: string;
  city: string;
  country: string;
  currency: string;
  timezone: string;
}

interface EmailValidationData {
  email: string;
  is_valid: boolean;
  score: number;
}

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
}

interface NewsResponse {
  articles: NewsArticle[];
}

interface MarketAnalysis {
  idea: string;
  timestamp: string;
  marketTrends: string[];
  relatedNews: NewsArticle[];
  targetMarket?: {
    country: string;
    city: string;
    currency: string;
    timezone: string;
  };
}

interface DemoExample {
  idea: string;
  apis: string[];
}

// Configuration APIs gratuites
const FREE_APIS = {
  // IA - OpenRouter (backup OpenAI)
  openrouter: {
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
    models: {
      free: 'microsoft/wizardlm-2-8x22b',
      chat: 'meta-llama/llama-3.1-8b-instruct:free'
    }
  },
  
  // Données Business
  abstract: {
    baseURL: 'https://api.abstractapi.com',
    apiKey: process.env.ABSTRACT_API_KEY,
    endpoints: {
      geolocation: '/geolocation/v1',
      emailValidation: '/email-validation/v1',
      phoneValidation: '/phone-validation/v1'
    }
  },
  
  // News & Contenu  
  newsapi: {
    baseURL: 'https://newsapi.org/v2',
    apiKey: process.env.NEWS_API_KEY,
    endpoints: {
      headlines: '/top-headlines',
      everything: '/everything'
    }
  },
  
  // Génération Images
  apitemplate: {
    baseURL: 'https://rest.apitemplate.io',
    apiKey: process.env.APITEMPLATE_API_KEY,
    endpoints: {
      create: '/v2/create-image'
    }
  }
};

class FreeAPIManager {
  
  // IA avec fallback gratuit
  async generateWithFallback(prompt: string, useOpenAI: boolean = true): Promise<string> {
    if (useOpenAI && process.env.OPENAI_API_KEY) {
      try {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        });
        return response.choices[0].message.content || '';
      } catch (error) {
        console.log('OpenAI failed, using OpenRouter fallback...');
      }
    }
    
    // Fallback vers OpenRouter gratuit
    return this.generateWithOpenRouter(prompt);
  }
  
  async generateWithOpenRouter(prompt: string): Promise<string> {
    try {
      const response = await fetch(`${FREE_APIS.openrouter.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${FREE_APIS.openrouter.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'MVPForge'
        },
        body: JSON.stringify({
          model: FREE_APIS.openrouter.models.chat,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7
        })
      });
      
      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json() as OpenRouterResponse;
      console.log('OpenRouter response:', JSON.stringify(data, null, 2));
      
      if (!data.choices?.[0]?.message?.content) {
        console.error('Structure de réponse OpenRouter inattendue:', data);
        return 'Erreur: Réponse OpenRouter malformée';
      }
      
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Erreur OpenRouter:', error);
      return `Erreur OpenRouter: ${error instanceof Error ? error.message : 'Erreur inconnue'}`;
    }
  }
  
  // Enrichissement données utilisateur
  async enrichUserData(ip: string, email?: string): Promise<{
    location?: GeolocationData;
    emailValidation?: EmailValidationData;
  }> {
    const enrichment: {
      location?: GeolocationData;
      emailValidation?: EmailValidationData;
    } = {};
    
    if (ip) {
      try {
        const geoResponse = await fetch(`${FREE_APIS.abstract.baseURL}${FREE_APIS.abstract.endpoints.geolocation}?api_key=${FREE_APIS.abstract.apiKey}&ip_address=${ip}`);
        enrichment.location = await geoResponse.json() as GeolocationData;
      } catch (error) {
        console.error('Geolocation failed:', error);
      }
    }
    
    if (email) {
      try {
        const emailResponse = await fetch(`${FREE_APIS.abstract.baseURL}${FREE_APIS.abstract.endpoints.emailValidation}?api_key=${FREE_APIS.abstract.apiKey}&email=${email}`);
        enrichment.emailValidation = await emailResponse.json() as EmailValidationData;
      } catch (error) {
        console.error('Email validation failed:', error);
      }
    }
    
    return enrichment;
  }
  
  // Génération contenu dynamique
  async generateDynamicContent(topic: string, country?: string): Promise<{
    articles: NewsArticle[];
    trends: string[];
  }> {
    try {
      const query = country ? `${topic} AND country:${country}` : topic;
      const response = await fetch(`${FREE_APIS.newsapi.baseURL}${FREE_APIS.newsapi.endpoints.everything}?q=${query}&apiKey=${FREE_APIS.newsapi.apiKey}&pageSize=5`);
      const data = await response.json() as NewsResponse;
      
      return {
        articles: data.articles?.slice(0, 3) || [],
        trends: data.articles?.map(a => a.title) || []
      };
    } catch (error) {
      console.error('News API failed:', error);
      return { articles: [], trends: [] };
    }
  }
  
  // Génération visuels
  async generateVisual(templateId: string, data: any): Promise<string> {
    try {
      if (!FREE_APIS.apitemplate.apiKey) {
        throw new Error('APITemplate API key is missing');
      }
      const response = await fetch(`${FREE_APIS.apitemplate.baseURL}${FREE_APIS.apitemplate.endpoints.create}`, {
        method: 'POST',
        headers: {
          'X-API-KEY': FREE_APIS.apitemplate.apiKey as string,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          template_id: templateId,
          properties: data
        })
      });
      
      const result = await response.json();
      return result.download_url;
    } catch (error) {
      console.error('Visual generation failed:', error);
      return '';
    }
  }
  
  // Avatar unique avec ROBOHASH (gratuit illimité)
  generateAvatar(seed: string, size: number = 200): string {
    return `https://robohash.org/${encodeURIComponent(seed)}?size=${size}x${size}`;
  }
  
  // Analyse marché avec données gratuites
  async analyzeMarket(idea: string, location?: GeolocationData): Promise<MarketAnalysis> {
    const analysis: MarketAnalysis = {
      idea,
      timestamp: new Date().toISOString(),
      marketTrends: [],
      relatedNews: []
    };
    
    const marketContent = await this.generateDynamicContent(idea, location?.country);
    analysis.marketTrends = marketContent.trends;
    analysis.relatedNews = marketContent.articles;
    
    if (location) {
      analysis.targetMarket = {
        country: location.country,
        city: location.city,
        currency: location.currency || 'USD',
        timezone: location.timezone
      };
    }
    
    return analysis;
  }
  
  // Template d'exemples pour la démo
  getDemoExamples(): DemoExample[] {
    return [
      {
        idea: "Plateforme de covoiturage pour vélos électriques urbains",
        apis: ["OpenRouter IA", "Abstract Geolocation", "News API", "APITemplate"]
      },
      {
        idea: "Marketplace pour freelancers spécialisés IA",
        apis: ["OpenRouter IA", "Email Validation", "Currency API", "Avatar Generation"]
      },
      {
        idea: "App de méditation personnalisée avec IA",
        apis: ["OpenRouter IA", "News Wellness", "Image Generation", "Geolocation"]
      }
    ];
  }
}

export { FreeAPIManager, FREE_APIS };
