import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axios';
import { Post, Comment, PaginatedResponse } from '../../types';

interface PostState {
  posts: Post[];
  selectedPost: Post | null;
  postComments: Comment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  loading: boolean;
  error: string | null;
}

const initialState: PostState = {
  posts: [],
  selectedPost: null,
  postComments: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  loading: false,
  error: null,
};

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }) => {
    const response = await axiosInstance.get(`/posts?page=${page}&limit=${limit}`);
    return response.data;
  }
);

export const fetchPostById = createAsyncThunk(
  'posts/fetchPostById',
  async (postId: string) => {
    const response = await axiosInstance.get(`/posts/${postId}`);
    return response.data;
  }
);

export const fetchPostComments = createAsyncThunk(
  'posts/fetchPostComments',
  async (postId: string) => {
    const response = await axiosInstance.get(`/posts/${postId}/comments`);
    return response.data;
  }
);

export const hidePost = createAsyncThunk(
  'posts/hidePost',
  async ({ postId, hidden }: { postId: string; hidden: boolean }) => {
    const response = await axiosInstance.patch(`/posts/${postId}/visibility`, { hidden });
    return response.data;
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (postId: string) => {
    await axiosInstance.delete(`/posts/${postId}`);
    return postId;
  }
);

export const hideComment = createAsyncThunk(
  'posts/hideComment',
  async ({ commentId, hidden }: { commentId: string; hidden: boolean }) => {
    const response = await axiosInstance.patch(`/comments/${commentId}/visibility`, { hidden });
    return response.data;
  }
);

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearSelectedPost: (state) => {
      state.selectedPost = null;
      state.postComments = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<PaginatedResponse<Post>>) => {
        state.loading = false;
        state.posts = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch posts';
      })
      .addCase(fetchPostById.fulfilled, (state, action: PayloadAction<Post>) => {
        state.selectedPost = action.payload;
      })
      .addCase(fetchPostComments.fulfilled, (state, action: PayloadAction<Comment[]>) => {
        state.postComments = action.payload;
      })
      .addCase(hidePost.fulfilled, (state, action: PayloadAction<Post>) => {
        const index = state.posts.findIndex(post => post._id === action.payload._id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
        if (state.selectedPost && state.selectedPost._id === action.payload._id) {
          state.selectedPost = action.payload;
        }
      })
      .addCase(deletePost.fulfilled, (state, action: PayloadAction<string>) => {
        state.posts = state.posts.filter(post => post._id !== action.payload);
        if (state.selectedPost && state.selectedPost._id === action.payload) {
          state.selectedPost = null;
          state.postComments = [];
        }
      })
      .addCase(hideComment.fulfilled, (state, action: PayloadAction<Comment>) => {
        const index = state.postComments.findIndex(comment => comment._id === action.payload._id);
        if (index !== -1) {
          state.postComments[index] = action.payload;
        }
      });
  },
});

export const { clearSelectedPost, clearError } = postSlice.actions;
export default postSlice.reducer;