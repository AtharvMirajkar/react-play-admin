import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axios';
import { Report, PaginatedResponse } from '../../types';

interface ReportState {
  reports: Report[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  loading: boolean;
  error: string | null;
}

const initialState: ReportState = {
  reports: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  loading: false,
  error: null,
};

export const fetchReports = createAsyncThunk(
  'reports/fetchReports',
  async ({ page = 1, limit = 10, status }: { page?: number; limit?: number; status?: string }) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (status) params.append('status', status);
    
    const response = await axiosInstance.get(`/reports?${params.toString()}`);
    return response.data;
  }
);

export const updateReportStatus = createAsyncThunk(
  'reports/updateReportStatus',
  async ({ reportId, status }: { reportId: string; status: string }) => {
    const response = await axiosInstance.patch(`/reports/${reportId}/status`, { status });
    return response.data;
  }
);

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action: PayloadAction<PaginatedResponse<Report>>) => {
        state.loading = false;
        state.reports = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch reports';
      })
      .addCase(updateReportStatus.fulfilled, (state, action: PayloadAction<Report>) => {
        const index = state.reports.findIndex(report => report._id === action.payload._id);
        if (index !== -1) {
          state.reports[index] = action.payload;
        }
      });
  },
});

export const { clearError } = reportSlice.actions;
export default reportSlice.reducer;