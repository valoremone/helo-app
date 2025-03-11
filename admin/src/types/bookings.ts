// Booking status options
export type BookingStatus = "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";

// Booking type options
export type BookingType = "charter" | "shuttle" | "tour";

// Booking payment status options
export type PaymentStatus = "paid" | "pending" | "partial" | "refunded" | "cancelled";

// Booking interface
export interface Booking {
  id: string;
  status: BookingStatus;
  aircraftId: string;
  aircraftName?: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  type: BookingType;
  passengers: number;
  departure: {
    location: string;
    time: string;
  };
  arrival: {
    location: string;
    time: string;
  };
  price: number;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Calendar event for displaying bookings in calendar view
export interface BookingCalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: BookingStatus;
  customer: string;
  aircraft: string;
  resourceId?: string;
  type?: BookingType;
}

// Booking statistics interface
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

// User roles
export type UserRole = "admin" | "member";

// User status
export type UserStatus = "active" | "inactive";

// Membership tiers
export type MembershipTier = "STANDARD" | "ELITE" | "BLACK" | "PLATINUM";

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  membershipTier: MembershipTier;
  lastActive: string;
}

// Customer interface
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  membershipTier: MembershipTier;
  totalSpent: number;
  bookingsCount: number;
  lastBooking: string;
  joinDate: string;
}

// Aircraft status
export type AircraftStatus = "available" | "maintenance" | "in-use";

// Aircraft interface
export interface Aircraft {
  id: string;
  name: string;
  type: string;
  registration: string;
  capacity: number;
  range: number;
  status: AircraftStatus;
  nextMaintenance: string;
  lastMaintenance: string;
  imageUrl: string;
}

// Maintenance types
export type MaintenanceType = "scheduled" | "unscheduled" | "repair";

// Maintenance status
export type MaintenanceStatus = "planned" | "in-progress" | "completed";

// Maintenance record interface
export interface MaintenanceRecord {
  id: string;
  aircraftId: string;
  title: string;
  description: string;
  type: MaintenanceType;
  status: MaintenanceStatus;
  startDate: string;
  endDate: string;
  cost: number;
  technician: string;
  notes?: string;
} 