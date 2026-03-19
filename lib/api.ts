import { getCredentials } from '@/lib/storage';
import {
  AIGenerateRequest,
  AIGenerateResponse,
  CreatePropertyPayload,
  PaginatedLeadsResponse,
  PaginatedPropertiesResponse,
  Property,
  StatsResponse,
  UpdatePropertyPayload,
  UploadResponse,
} from '@/lib/types';

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function authRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const credentials = await getCredentials();
  if (!credentials) {
    throw new ApiError('Credenciais nao configuradas.', 401);
  }

  const response = await fetch(`${credentials.baseUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${credentials.token}`,
      ...(init?.headers ?? {}),
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(data?.error ?? 'Erro na requisicao', response.status);
  }
  return data as T;
}

export async function testConnection(baseUrl: string, token: string): Promise<void> {
  const response = await fetch(`${baseUrl.trim().replace(/\/+$/, '')}/api/stats`, {
    headers: {
      Authorization: `Bearer ${token.trim()}`,
    },
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new ApiError(data?.error ?? 'Falha na conexao', response.status);
  }
}

export async function fetchStats(): Promise<StatsResponse> {
  return authRequest<StatsResponse>('/api/stats');
}

export async function fetchProperties(params: URLSearchParams): Promise<PaginatedPropertiesResponse> {
  return authRequest<PaginatedPropertiesResponse>(`/api/imovel?${params.toString()}`);
}

export async function fetchProperty(idOrSlug: string, by: 'id' | 'slug' = 'id'): Promise<Property> {
  const result = await authRequest<{ property: Property }>(`/api/imovel?${by}=${encodeURIComponent(idOrSlug)}`);
  return result.property;
}

export async function createProperty(payload: CreatePropertyPayload): Promise<Property> {
  const result = await authRequest<{ property: Property }>('/api/imovel', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return result.property;
}

export async function updateProperty(payload: UpdatePropertyPayload): Promise<Property | null> {
  const result = await authRequest<{ property: Property | null }>('/api/imovel', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return result.property;
}

export async function deleteProperty(identifier: { id?: string; slug?: string }): Promise<void> {
  await authRequest('/api/imovel', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(identifier),
  });
}

export async function fetchLeads(params: URLSearchParams): Promise<PaginatedLeadsResponse> {
  return authRequest<PaginatedLeadsResponse>(`/api/leads?${params.toString()}`);
}

export async function uploadImage(uri: string, filename?: string, mimeType?: string): Promise<UploadResponse> {
  const credentials = await getCredentials();
  if (!credentials) {
    throw new ApiError('Credenciais nao configuradas.', 401);
  }

  const formData = new FormData();
  formData.append('file', {
    uri,
    name: filename ?? `image-${Date.now()}.jpg`,
    type: mimeType ?? 'image/jpeg',
  } as unknown as Blob);

  const response = await fetch(`${credentials.baseUrl}/api/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${credentials.token}`,
    },
    body: formData,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(data?.error ?? 'Erro no upload', response.status);
  }
  return data as UploadResponse;
}

export async function generateWithAI(payload: AIGenerateRequest): Promise<AIGenerateResponse> {
  return authRequest<AIGenerateResponse>('/api/ai/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export { ApiError };
