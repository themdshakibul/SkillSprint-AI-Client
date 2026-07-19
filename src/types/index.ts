export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'buyer' | 'mentor' | 'admin';
  avatar?: string;
  skillsInterested: string[];
  goals: string[];
  createdAt: string;
}

export interface Service {
  _id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  category: string;
  price: number;
  duration: number;
  ratingAvg: number;
  ratingCount: number;
  location: string;
  images: string[];
  mentorId: string | User;
  tags: string[];
  approved?: boolean;
  createdAt: string;
}

export interface Review {
  _id: string;
  userId: string | User;
  serviceId: string | Service;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Order {
  _id: string;
  userId: string | User;
  serviceId: any;
  status: 'pending' | 'paid' | 'completed' | 'cancelled';
  amount: number;
  stripeSessionId?: string;
  scheduledAt?: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AIEvent {
  _id: string;
  userId: string;
  type: string;
  payload: Record<string, unknown>;
  createdAt: string;
}

export interface AIRecommendations {
  recommendations: Array<{
    title: string;
    description: string;
    matchScore: number;
    category: string;
  }>;
  topServices: Service[];
}

export interface AIChatResponse {
  reply: string;
  suggestions: string[];
}

export interface AIDocAnalysis {
  summary: string;
  keyPoints: string[];
  suggestions: string[];
  skills: string[];
  topics: string[];
}
