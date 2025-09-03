import { Middleware } from '@reduxjs/toolkit';
import { mockStats, mockUsers, mockPosts, mockComments, mockReports } from '../utils/mockData';

// Mock middleware to simulate API responses for development
export const mockMiddleware: Middleware = (store) => (next) => (action) => {
  // Intercept async thunk actions and provide mock data
  if (action.type?.endsWith('/pending')) {
    // Let the action proceed to set loading state
    return next(action);
  }
  
  if (action.type?.endsWith('/rejected')) {
    return next(action);
  }

  // Mock API responses for fulfilled actions
  switch (action.type) {
    case 'auth/loginAdmin/fulfilled':
      return next({
        ...action,
        payload: {
          id: 'admin1',
          email: 'admin@reactplay.com',
          name: 'Admin User',
          token: 'mock-jwt-token-12345'
        }
      });

    case 'auth/verifyToken/fulfilled':
      return next({
        ...action,
        payload: {
          id: 'admin1',
          email: 'admin@reactplay.com',
          name: 'Admin User',
          token: 'mock-jwt-token-12345'
        }
      });

    case 'dashboard/fetchStats/fulfilled':
      return next({
        ...action,
        payload: mockStats
      });

    case 'users/fetchUsers/fulfilled':
      return next({
        ...action,
        payload: {
          data: mockUsers,
          total: mockUsers.length,
          page: 1,
          limit: 10,
          totalPages: 1
        }
      });

    case 'users/fetchUserProfile/fulfilled':
      return next({
        ...action,
        payload: mockUsers[0]
      });

    case 'users/fetchUserPosts/fulfilled':
      return next({
        ...action,
        payload: mockPosts.filter(post => post.user._id === mockUsers[0]._id)
      });

    case 'posts/fetchPosts/fulfilled':
      return next({
        ...action,
        payload: {
          data: mockPosts,
          total: mockPosts.length,
          page: 1,
          limit: 10,
          totalPages: 1
        }
      });

    case 'posts/fetchPostById/fulfilled':
      return next({
        ...action,
        payload: mockPosts[0]
      });

    case 'posts/fetchPostComments/fulfilled':
      return next({
        ...action,
        payload: mockComments
      });

    case 'reports/fetchReports/fulfilled':
      return next({
        ...action,
        payload: {
          data: mockReports,
          total: mockReports.length,
          page: 1,
          limit: 10,
          totalPages: 1
        }
      });

    default:
      return next(action);
  }
};