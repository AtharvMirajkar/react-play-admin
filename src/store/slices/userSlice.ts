import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axios';
import { User, PaginatedResponse } from '../../types';

interface UserState {
  users: User[];
  selectedUser: User | null;
  userPosts: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  selectedUser: null,
  userPosts: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }) => {
    const response = await axiosInstance.get(`/users?page=${page}&limit=${limit}`);
    return response.data;
  }
);

export const fetchUserProfile = createAsyncThunk(
  'users/fetchUserProfile',
  async (userId: string) => {
    const response = await axiosInstance.get(`/users/${userId}`);
    return response.data;
  }
);

export const fetchUserPosts = createAsyncThunk(
  'users/fetchUserPosts',
  async (userId: string) => {
    const response = await axiosInstance.get(`/users/${userId}/posts`);
    return response.data;
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId: string) => {
    await axiosInstance.delete(`/users/${userId}`);
    return userId;
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null;
      state.userPosts = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<PaginatedResponse<User>>) => {
        state.loading = false;
        state.users = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.userPosts = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.users = state.users.filter(user => user._id !== action.payload);
      });
  },
});

export const { clearSelectedUser, clearError } = userSlice.actions;
export default userSlice.reducer;