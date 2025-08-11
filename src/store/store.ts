import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import annonceSlice from './slices/annonceSlice';
import alertSlice from './slices/alertSlice';
import notificationSlice from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    annonces: annonceSlice,
    alerts: alertSlice,
    notifications: notificationSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;