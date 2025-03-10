export interface Aircraft {
  id: string;
  registration: string;
  type: string;
  manufacturer: string;
  model: string;
  capacity: number;
  status: 'available' | 'in-maintenance' | 'in-flight' | 'reserved';
  lastMaintenance: string;
  nextMaintenance: string;
  totalFlightHours: number;
  baseLocation: string;
  amenities: string[];
  images: {
    main: string;
    gallery: string[];
  };
}

export interface MaintenanceRecord {
  id: string;
  aircraftId: string;
  type: 'scheduled' | 'unscheduled';
  description: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  technician: string;
  cost: number;
  notes?: string;
}

export interface FlightSchedule {
  id: string;
  aircraftId: string;
  departure: {
    location: string;
    time: string;
  };
  arrival: {
    location: string;
    time: string;
  };
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  pilot: string;
  passengers: number;
  bookingId?: string;
}

export interface Route {
  id: string;
  origin: string;
  destination: string;
  distance: number;
  estimatedDuration: number;
  basePrice: number;
  availableAircraft: string[]; // Array of aircraft IDs
  restrictions?: {
    weatherMinimums?: {
      visibility: number;
      ceiling: number;
    };
    timeRestrictions?: {
      start: string;
      end: string;
    };
  };
} 