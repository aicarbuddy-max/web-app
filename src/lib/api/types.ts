// API Response Types

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  id: string;
  fullName: string;
  email: string;
  role: string;
}

// Garage Types
export interface Garage {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface GarageWithDistance extends Garage {
  distanceKm: number;
  serviceCount: number;
}

export interface GarageSearchRequest {
  latitude: number;
  longitude: number;
  radiusKm?: number;
  minRating?: number;
}

export interface GarageStatistics {
  garageId: string;
  garageName: string;
  rating: number;
  totalServices: number;
  averageServicePrice: number;
  minServicePrice: number;
  maxServicePrice: number;
  totalRevenuePotential: number;
  mostExpensiveService: string;
  serviceCategories: Array<{
    category: string;
    count: number;
  }>;
  createdAt: string;
  daysSinceCreation: number;
}

// Service Types
export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  garageId: string;
  createdAt: string;
  updatedAt: string;
}

// Auto Parts Shop Types
export interface AutoPartsShop {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  latitude: number;
  longitude: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

// Community Post Types
export interface CommunityPost {
  id: string;
  userId: string;
  username: string;
  content: string;
  likesCount: number;
  commentsCount: number;
  isLikedByCurrentUser: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreatePostRequest {
  content: string;
}

export interface PostComment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
}

export interface CreateCommentRequest {
  content: string;
}
