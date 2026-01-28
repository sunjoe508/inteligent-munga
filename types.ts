
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  sources?: Array<{ title: string; uri: string }>;
  imageUrl?: string;
  dataPoints?: DataPoint[];
}

export interface DataPoint {
  name: string;
  value: number;
  label?: string;
}

export interface UserSession {
  username: string;
  email: string;
  token: string;
  isVerified: boolean;
  lastActivity: number;
}

export enum ViewMode {
  LANDING = 'LANDING',
  RESEARCH = 'RESEARCH',
  ANALYTICS = 'ANALYTICS',
  DOCUMENTS = 'DOCUMENTS',
  COMMUNICATION = 'COMMUNICATION',
  MARKET = 'MARKET',
  ROADMAP = 'ROADMAP'
}
