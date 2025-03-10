export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  membershipTier?: 'STANDARD' | 'ELITE' | 'BLACK' | 'PLATINUM';
  status: 'active' | 'suspended' | 'pending';
  createdAt: string;
  lastLogin?: string;
}

export interface Booking {
  id: string;
  userId: string;
  aircraftId: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  departureLocation: string;
  arrivalLocation: string;
  departureTime: string;
  arrivalTime: string;
  passengers: number;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Aircraft {
  id: string;
  registration: string;
  type: string;
  model: string;
  capacity: number;
  status: 'available' | 'in-maintenance' | 'in-use';
  lastMaintenance?: string;
  nextMaintenance?: string;
  totalFlightHours: number;
  baseLocation: string;
}

export interface MaintenanceRecord {
  id: string;
  aircraftId: string;
  type: 'scheduled' | 'unscheduled';
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  startDate: string;
  endDate?: string;
  cost?: number;
  technician?: string;
  notes?: string;
}

export interface SystemConfig {
  maintenanceThreshold: number; // Flight hours before maintenance is required
  bookingLeadTime: number; // Minimum hours before flight time for booking
  maxPassengers: number;
  allowedAirports: string[];
  membershipRequirements: {
    [key: string]: {
      minimumSpend: number;
      flightsPerYear: number;
    };
  };
} 