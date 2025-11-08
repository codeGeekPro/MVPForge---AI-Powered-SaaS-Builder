// Client API frontend -> backend Express
// Utilise NEXT_PUBLIC_API_URL ou fallback http://localhost:4000

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

type Json = Record<string, any>;

async function request<T = any>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${errText || res.statusText}`);
  }
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return res.json();
  }
  // @ts-expect-error: may return other types (blob/text) in some cases
  return res.text();
}

// IA: Génération MVP
export async function generateMVP(prompt: string): Promise<{ mvp: string } & Json> {
  return request('/api/ai/generate', {
    method: 'POST',
    body: JSON.stringify({ prompt }),
  });
}

// IA: Classification d'idée
export async function classifyIdea(idea: string): Promise<{ classification: any } & Json> {
  return request('/api/ai/classify', {
    method: 'POST',
    body: JSON.stringify({ idea }),
  });
}

// IA: Multi-agents
export async function multiAgents(idea: string): Promise<{ agents: any[] } & Json> {
  return request('/api/ai/multi-agents', {
    method: 'POST',
    body: JSON.stringify({ idea }),
  });
}

// IA: Expérimentations A/B
export async function generateExperiments(idea: string): Promise<any> {
  return request('/api/ai/experiments', {
    method: 'POST',
    body: JSON.stringify({ idea }),
  });
}

// IA: Génération MVP complet (structure détaillée)
export async function generateFullMvp(idea: string): Promise<any> {
  return request('/api/ai/generate-full-mvp', {
    method: 'POST',
    body: JSON.stringify({ idea }),
  });
}

// Code: ZIP (stream binaire géré par backend; ici on récupère l'URL JSON/ZIP selon route)
export async function downloadMvpJson(projectName: string, idea: string): Promise<any> {
  return request('/api/code/download-mvp', {
    method: 'POST',
    body: JSON.stringify({ projectName, idea }),
  });
}

export async function generateCodeZip(idea: string): Promise<Blob> {
  const res = await fetch(`${API_URL}/api/ai/generate-code-zip`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idea }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.blob();
}
