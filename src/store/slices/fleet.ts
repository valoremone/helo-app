import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Vehicle {
  id: string;
  type: 'helicopter' | 'car';
  model: string;
  capacity: number;
  range: number;
  status: 'available' | 'in-use' | 'maintenance';
  maintenanceSchedule?: {
    nextDate: string;
    type: string;
  };
}

interface FleetState {
  vehicles: Vehicle[];
  isLoading: boolean;
  error: string | null;
}

const initialState: FleetState = {
  vehicles: [],
  isLoading: false,
  error: null,
};

const fleetSlice = createSlice({
  name: 'fleet',
  initialState,
  reducers: {
    setVehicles: (state, action: PayloadAction<Vehicle[]>) => {
      state.vehicles = action.payload;
    },
    updateVehicle: (state, action: PayloadAction<Vehicle>) => {
      const index = state.vehicles.findIndex((v) => v.id === action.payload.id);
      if (index !== -1) {
        state.vehicles[index] = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setVehicles, updateVehicle, setLoading, setError } =
  fleetSlice.actions;
export const fleetReducer = fleetSlice.reducer;