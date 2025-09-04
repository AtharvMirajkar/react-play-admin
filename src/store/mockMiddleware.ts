import { Middleware } from '@reduxjs/toolkit';
import {
  mockStats,
  mockUsers,
  mockPosts,
  mockComments,
  mockReports,
} from '../utils/mockData';
import { addToast } from './slices/toastSlice';

// Mock middleware to simulate API responses for development
export const mockMiddleware: Middleware = store => next => (action: any) => {
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
      store.dispatch(
        addToast({
          message: 'Successfully logged in!',
          type: 'success',
        }),
      );
      return next({
        ...action,
        payload: {
          id: 'admin1',
          email: 'admin@reactplay.com',
          name: 'Admin User',
          token: 'mock-jwt-token-12345',
        },
      });

    case 'auth/loginAdmin/rejected':
      store.dispatch(
        addToast({
          message: 'Login failed. Please check your credentials.',
          type: 'error',
        }),
      );
      return next(action);

    case 'auth/verifyToken/fulfilled':
      return next({
        ...action,
        payload: {
          id: 'admin1',
          email: 'admin@reactplay.com',
          name: 'Admin User',
          token: 'mock-jwt-token-12345',
        },
      });

    case 'dashboard/fetchStats/fulfilled':
      return next({
        ...action,
        payload: mockStats,
      });

    case 'users/deleteUser/fulfilled':
      store.dispatch(
        addToast({
          message: 'User deleted successfully',
          type: 'success',
        }),
      );
      return next(action);

    case 'users/deleteUser/rejected':
      store.dispatch(
        addToast({
          message: 'Failed to delete user',
          type: 'error',
        }),
      );
      return next(action);

    case 'users/fetchUsers/fulfilled':
      return next({
        ...action,
        payload: {
          data: mockUsers,
          total: mockUsers.length,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });

    case 'users/fetchUserProfile/fulfilled':
      return next({
        ...action,
        payload: mockUsers[0],
      });

    case 'users/fetchUserPosts/fulfilled':
      return next({
        ...action,
        payload: mockPosts.filter(post => post.user._id === mockUsers[0]._id),
      });

    case 'posts/hidePost/fulfilled':
      store.dispatch(
        addToast({
          message: 'Post visibility updated successfully',
          type: 'success',
        }),
      );
      return next(action);

    case 'posts/deletePost/fulfilled':
      store.dispatch(
        addToast({
          message: 'Post deleted successfully',
          type: 'success',
        }),
      );
      return next(action);

    case 'posts/hideComment/fulfilled':
      store.dispatch(
        addToast({
          message: 'Comment visibility updated successfully',
          type: 'success',
        }),
      );
      return next(action);

    case 'posts/fetchPosts/fulfilled':
      return next({
        ...action,
        payload: {
          data: mockPosts,
          total: mockPosts.length,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });

    case 'posts/fetchPostById/fulfilled':
      return next({
        ...action,
        payload: mockPosts[0],
      });

    case 'posts/fetchPostComments/fulfilled':
      return next({
        ...action,
        payload: mockComments,
      });

    case 'reports/updateReportStatus/fulfilled':
      store.dispatch(
        addToast({
          message: 'Report status updated successfully',
          type: 'success',
        }),
      );
      return next(action);

    case 'reports/fetchReports/fulfilled':
      return next({
        ...action,
        payload: {
          data: mockReports,
          total: mockReports.length,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });

    default:
      return next(action);
  }
};
