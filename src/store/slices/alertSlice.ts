import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../lib/axiosInstance';

const API_BASE_URL = 'http://localhost:8082';

export interface Alert {
  id: number;
  location: string;
  brand: string;
  model: string;
  year_min: number;
  year_max: number;
  price_min: number;
  price_max: number;
  mileage_max: number;
  fuel_type: string;
  transmission: string;
  has_defects: boolean;
  active: boolean;
  created_at: Date;
  userId?: number;
}

export interface AlertState {
  alerts: Alert[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AlertState = {
  alerts: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const createAlert = createAsyncThunk(
  'alerts/create',
  async (alertData: Omit<Alert, 'id' | 'created_at'>, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/alert/create`, alertData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to create alert');
    }
  }
);

export const getUserAlerts = createAsyncThunk(
  'alerts/getUserAlerts',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/alert/getall/${userId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch alerts');
    }
  }
);

export const updateAlert = createAsyncThunk(
  'alerts/update',
  async ({ id, data }: { id: number; data: Partial<Alert> }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/alert/update/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to update alert');
    }
  }
);

export const deleteAlert = createAsyncThunk(
  'alerts/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/alert/delete/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to delete alert');
    }
  }
);

export const deleteAllUserAlerts = createAsyncThunk(
  'alerts/deleteAll',
  async (userId: number, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/alert/deleteall/${userId}`);
      return userId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to delete alerts');
    }
  }
);

const alertSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create alert
      .addCase(createAlert.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createAlert.fulfilled, (state, action) => {
        state.isLoading = false;
        state.alerts.unshift(action.payload);
      })
      .addCase(createAlert.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get user alerts
      .addCase(getUserAlerts.fulfilled, (state, action) => {
        state.alerts = action.payload;
      })
      // Update alert
      .addCase(updateAlert.fulfilled, (state, action) => {
        const index = state.alerts.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.alerts[index] = action.payload;
        }
      })
      // Delete alert
      .addCase(deleteAlert.fulfilled, (state, action) => {
        state.alerts = state.alerts.filter(a => a.id !== action.payload);
      })
      // Delete all alerts
      .addCase(deleteAllUserAlerts.fulfilled, (state) => {
        state.alerts = [];
      });
  },
});

export const { clearError } = alertSlice.actions;
export default alertSlice.reducer;