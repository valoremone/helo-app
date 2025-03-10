import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './slices/auth';
import { bookingReducer } from './slices/booking';
import { fleetReducer } from './slices/fleet';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    booking: bookingReducer,
    fleet: fleetReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;