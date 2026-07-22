import type { HistoryResponse, MeResponse, ProjectResponse, StackResponse } from './types';

const API_BASE_URL = 'https://seohamin.com/api/v1';

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`);
  if (!res.ok) {
    throw new Error(`API request failed (${res.status}): ${path}`);
  }
  return res.json() as Promise<T>;
}

export const getMe = () => apiGet<MeResponse>('/me');
export const getStacks = () => apiGet<StackResponse[]>('/stacks');
export const getProjects = () => apiGet<ProjectResponse[]>('/projects');
export const getHistory = () => apiGet<HistoryResponse[]>('/history');
