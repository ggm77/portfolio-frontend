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

export interface ProjectResponse {
  id: number;
  name: string;
  content: string;
  tags: string[];
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
