export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
  xp: number;
  xpMax: number;
  challenges: number;
  linkedin?: string;
  github?: string;
  twitter?: string;
  learningPathProgress?: Record<string, number>;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  _id: string;
  user: User;
  title: string;
  text: string;
  type: 'General' | 'Question' | 'Achievement';
  image?: string;
  likes: string[];
  hidden: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  post: string;
  user: User;
  text: string;
  hidden: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Report {
  _id: string;
  reporter: User;
  post?: Post;
  comment?: Comment;
  reason: string;
  status: 'pending' | 'reviewed' | 'dismissed';
  message?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  token: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalPosts: number;
  totalReports: number;
  newUsersThisMonth: number;
  newPostsThisMonth: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}