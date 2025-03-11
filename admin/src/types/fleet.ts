export interface Aircraft {
  id: string;
  registration: string;
  model: string;
  manufacturer: string;
  yearManufactured: number;
  status: 'available' | 'in-maintenance' | 'in-flight' | 'reserved';
  flightHours: number;
  totalFlightHours?: number;
  range: number;
  cruisingSpeed: number;
  capacity: number;
  baseLocation: string;
  type: string;
  amenities: string[];
  images: {
    main: string;
    gallery?: string[];
  };
  lastMaintenance?: string;
  nextMaintenance?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type AircraftStatus = Aircraft['status'];

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