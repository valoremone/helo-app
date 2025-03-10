export interface Booking {
  id: string;
  aircraftId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  type: 'charter' | 'shuttle' | 'tour';
  passengers: number;
  departure: {
    location: string;
    time: string;
  };
  arrival: {
    location: string;
    time: string;
  };
  price: {
    base: number;
    fees: number;
    total: number;
    currency: string;
  };
  paymentStatus: 'pending' | 'paid' | 'refunded';
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingCalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  resourceId: string; // aircraftId
  status: Booking['status'];
  type: Booking['type'];
}

export interface BookingStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  revenue: {
    total: number;
    pending: number;
    received: number;
    refunded: number;
    currency: string;
  };
} 