import { DashboardStats, User, Post, Comment, Report } from '../types';

// Mock data for demonstration purposes
export const mockStats: DashboardStats = {
  totalUsers: 12847,
  totalPosts: 3294,
  totalReports: 23,
  newUsersThisMonth: 1247,
  newPostsThisMonth: 456,
};

export const mockUsers: User[] = [
  {
    _id: '1',
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    bio: 'Full-stack developer passionate about React and Node.js',
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150',
    xp: 2500,
    xpMax: 3000,
    challenges: 45,
    linkedin: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe',
    emailVerified: true,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-12-15T14:20:00Z',
  },
  {
    _id: '2',
    name: 'Jane Smith',
    username: 'janesmith',
    email: 'jane@example.com',
    bio: 'UI/UX Designer and Frontend Developer',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    xp: 1800,
    xpMax: 2000,
    challenges: 32,
    twitter: 'https://twitter.com/janesmith',
    emailVerified: true,
    createdAt: '2024-02-20T09:15:00Z',
    updatedAt: '2024-12-14T16:45:00Z',
  },
];

export const mockPosts: Post[] = [
  {
    _id: '1',
    user: mockUsers[0],
    title: 'React Best Practices for 2024',
    text: 'Here are some essential React best practices that every developer should follow in 2024...',
    type: 'General',
    image: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=800',
    likes: ['user1', 'user2', 'user3'],
    hidden: false,
    createdAt: '2024-12-10T14:30:00Z',
    updatedAt: '2024-12-10T14:30:00Z',
  },
  {
    _id: '2',
    user: mockUsers[1],
    title: 'How to handle async operations in React?',
    text: 'I am struggling with managing async operations in my React component. What are the best approaches?',
    type: 'Question',
    likes: ['user1', 'user4'],
    hidden: false,
    createdAt: '2024-12-12T09:45:00Z',
    updatedAt: '2024-12-12T09:45:00Z',
  },
];

export const mockComments: Comment[] = [
  {
    _id: '1',
    post: '1',
    user: mockUsers[1],
    text: 'Great article! These tips are really helpful for optimizing React applications.',
    hidden: false,
    createdAt: '2024-12-10T15:30:00Z',
    updatedAt: '2024-12-10T15:30:00Z',
  },
  {
    _id: '2',
    post: '1',
    user: mockUsers[0],
    text: 'Thanks for the feedback! I hope this helps other developers too.',
    hidden: false,
    createdAt: '2024-12-10T16:00:00Z',
    updatedAt: '2024-12-10T16:00:00Z',
  },
];

export const mockReports: Report[] = [
  {
    _id: '1',
    reporter: mockUsers[1],
    post: mockPosts[0],
    reason: 'Spam content',
    status: 'pending',
    message: 'This post contains spam links and promotional content',
    createdAt: '2024-12-13T11:20:00Z',
    updatedAt: '2024-12-13T11:20:00Z',
  },
  {
    _id: '2',
    reporter: mockUsers[0],
    comment: mockComments[0],
    reason: 'Inappropriate language',
    status: 'reviewed',
    message: 'Comment contains offensive language',
    createdAt: '2024-12-12T16:45:00Z',
    updatedAt: '2024-12-13T10:30:00Z',
  },
];