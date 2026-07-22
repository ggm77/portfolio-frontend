export interface MeResponse {
  id: number;
  headline: string;
  subheadline: string;
  tags: string[];
  content: string;
}

export interface StackResponse {
  id: number;
  name: string;
  content: string[];
}

export interface ProjectLink {
  label: string;
  url: string;
}

export interface ProjectResponse {
  id: number;
  name: string;
  tagline: string;
  content: string;
  highlights: string[];
  tags: string[];
  links: ProjectLink[];
  startAt: string;
  endAt: string | null;
}

export interface HistoryResponse {
  id: number;
  club_name: string;
  project_name: string;
  content: string;
  startAt: string;
  endAt: string | null;
}

export interface ImageResponse {
  id: number;
  path: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  refreshToken: string;
}

export interface PreloadedState {
  me?: MeResponse;
  stacks?: StackResponse[];
  projects?: ProjectResponse[];
  history?: HistoryResponse[];
}

export interface ProjectCreate {
  name: string;
  tagline: string;
  content: string;
  highlights?: string[];
  tags?: string[];
  links?: ProjectLink[];
  startAt: string;
  endAt?: string | null;
}

export type ProjectUpdate = Partial<ProjectCreate>;

export interface HistoryCreate {
  club_name: string;
  project_name: string;
  content: string;
  startAt: string;
  endAt?: string;
}

export type HistoryUpdate = Partial<HistoryCreate>;

export interface StackCreate {
  name: string;
  content: string[];
}

export type StackUpdate = Partial<StackCreate>;

export interface MeCreate {
  headline: string;
  subheadline: string;
  tags: string[];
  content: string;
}

export type MeUpdate = Partial<MeCreate>;
