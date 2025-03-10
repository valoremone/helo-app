import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Location {
  id: string;
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface Passenger {
  name: string;
  email: string;
  phone: string;
}

interface Booking {
  id: string;
  pickupLocation: Location;
  dropoffLocation: Location;
  date: string;
  time: string;
  passengers: Passenger[];
  addons: string[];
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

interface BookingState {
  currentBooking: Partial<Booking> | null;
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  currentBooking: null,
  bookings: [],
  isLoading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setCurrentBooking: (state, action: PayloadAction<Partial<Booking>>) => {
      state.currentBooking = action.payload;
    },
    addBooking: (state, action: PayloadAction<Booking>) => {
      state.bookings.push(action.payload);
    },
    updateBooking: (state, action: PayloadAction<Booking>) => {
      const index = state.bookings.findIndex((b) => b.id === action.payload.id);
      if (index !== -1) {
        state.bookings[index] = action.payload;
      }
    },
    setBookings: (state, action: PayloadAction<Booking[]>) => {
      state.bookings = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCurrentBooking,
  addBooking,
  updateBooking,
  setBookings,
  setLoading,
  setError,
} = bookingSlice.actions;
export const bookingReducer = bookingSlice.reducer;