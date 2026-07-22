import type {
  HistoryCreate,
  HistoryResponse,
  HistoryUpdate,
  ImageResponse,
  LoginResponse,
  MeCreate,
  MeResponse,
  MeUpdate,
  ProjectCreate,
  ProjectResponse,
  ProjectUpdate,
  StackCreate,
  StackResponse,
  StackUpdate,
} from './types';

export const API_BASE_URL = 'https://seohamin.com/api/v1';
export const API_ORIGIN = new URL(API_BASE_URL).origin;

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

interface RequestOptions {
  method?: string;
  token?: string | null;
  body?: unknown;
  isForm?: boolean;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', token, body, isForm } = options;
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (!isForm && body !== undefined) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: isForm ? (body as FormData) : body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let message = `요청 실패 (${res.status})`;
    try {
      const data = await res.json();
      if (data?.detail) message = data.detail;
    } catch {
      // response had no JSON body
    }
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// Public reads
export const getMe = () => apiRequest<MeResponse>('/me');
export const getStacks = () => apiRequest<StackResponse[]>('/stacks');
export const getProjects = () => apiRequest<ProjectResponse[]>('/projects');
export const getHistory = () => apiRequest<HistoryResponse[]>('/history');
export const getImages = () => apiRequest<ImageResponse[]>('/images');

// Auth
export const login = (password: string) =>
  apiRequest<LoginResponse>('/auth/login', { method: 'POST', body: { password } });

// Me (singleton)
export const createMe = (token: string, data: MeCreate) =>
  apiRequest<MeResponse>('/me', { method: 'POST', token, body: data });
export const updateMe = (token: string, data: MeUpdate) =>
  apiRequest<MeResponse>('/me', { method: 'PATCH', token, body: data });
export const deleteMe = (token: string) => apiRequest<void>('/me', { method: 'DELETE', token });

// Stacks
export const createStack = (token: string, data: StackCreate) =>
  apiRequest<StackResponse>('/stacks', { method: 'POST', token, body: data });
export const updateStack = (token: string, id: number, data: StackUpdate) =>
  apiRequest<StackResponse>(`/stacks/${id}`, { method: 'PATCH', token, body: data });
export const deleteStack = (token: string, id: number) =>
  apiRequest<void>(`/stacks/${id}`, { method: 'DELETE', token });

// Projects
export const createProject = (token: string, data: ProjectCreate) =>
  apiRequest<ProjectResponse>('/projects', { method: 'POST', token, body: data });
export const updateProject = (token: string, id: number, data: ProjectUpdate) =>
  apiRequest<ProjectResponse>(`/projects/${id}`, { method: 'PATCH', token, body: data });
export const deleteProject = (token: string, id: number) =>
  apiRequest<void>(`/projects/${id}`, { method: 'DELETE', token });

// History
export const createHistory = (token: string, data: HistoryCreate) =>
  apiRequest<HistoryResponse>('/history', { method: 'POST', token, body: data });
export const updateHistory = (token: string, id: number, data: HistoryUpdate) =>
  apiRequest<HistoryResponse>(`/history/${id}`, { method: 'PATCH', token, body: data });
export const deleteHistory = (token: string, id: number) =>
  apiRequest<void>(`/history/${id}`, { method: 'DELETE', token });

// Images
export const uploadImage = (token: string, file: File) => {
  const form = new FormData();
  form.append('file', file);
  return apiRequest<ImageResponse>('/images', { method: 'POST', token, body: form, isForm: true });
};
export const deleteImage = (token: string, id: number) =>
  apiRequest<void>(`/images/${id}`, { method: 'DELETE', token });
