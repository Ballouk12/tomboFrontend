import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../lib/axiosInstance';

const API_BASE_URL = '';

export interface Notification {
  id: number;
  message: string;
  date: Date;
  alertId?: number;
  annonceId?: number;
}

export interface NotificationState {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  unreadCount: number;
}

const initialState: NotificationState = {
  notifications: [],
  isLoading: false,
  error: null,
  unreadCount: 0,
};

// Async thunks
export const getUserNotifications = createAsyncThunk(
  'notifications/getUserNotifications',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/notification/getall/${userId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch notifications');
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await axios.delete(`/notification/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to delete notification');
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    markAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Get user notifications
      .addCase(getUserNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload;
        state.unreadCount = action.payload.length;
      })
      .addCase(getUserNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(n => n.id !== action.payload);
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      });
  },
});

export const { clearError, markAsRead } = notificationSlice.actions;
export default notificationSlice.reducer;