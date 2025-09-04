import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axios';
import { AdminUser } from '../../types';
import { addToast } from './toastSlice';

interface AuthState {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  admin: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Async thunks
export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async (
    { email, password }: { email: string; password: string },
    { dispatch },
  ) => {
    const response = await axiosInstance.post('/auth/login', {
      email,
      password,
    });
    const { admin, token } = response.data;
    localStorage.setItem('adminToken', token);
    dispatch(
      addToast({
        message: 'Successfully logged in!',
        type: 'success',
      }),
    );
    return { ...admin, token };
  },
);

export const verifyToken = createAsyncThunk(
  'auth/verifyToken',
  async (_, { dispatch }) => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      dispatch(
        addToast({
          message: 'Session expired. Please login again.',
          type: 'error',
        }),
      );
      throw new Error('No token found');
    }

    const response = await axiosInstance.get('/auth/verify');
    return { ...response.data.admin, token };
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      state.admin = null;
      state.isAuthenticated = false;
      localStorage.removeItem('adminToken');
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginAdmin.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginAdmin.fulfilled,
        (state, action: PayloadAction<AdminUser>) => {
          state.loading = false;
          state.admin = action.payload;
          state.isAuthenticated = true;
          state.error = null;
        },
      )
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(
        verifyToken.fulfilled,
        (state, action: PayloadAction<AdminUser>) => {
          state.admin = action.payload;
          state.isAuthenticated = true;
        },
      )
      .addCase(verifyToken.rejected, state => {
        state.admin = null;
        state.isAuthenticated = false;
        localStorage.removeItem('adminToken');
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
