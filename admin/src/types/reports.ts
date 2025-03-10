export interface RevenueData {
  period: string;
  revenue: number;
  bookings: number;
  averageBookingValue: number;
  topRoutes: Array<{
    departure: string;
    arrival: string;
    revenue: number;
    bookings: number;
  }>;
}

export interface FlightMetrics {
  totalFlights: number;
  totalHours: number;
  utilizationRate: number;
  onTimePerformance: number;
  delayedFlights: number;
  averageDelay: number;
  cancellationRate: number;
}

export interface MaintenanceMetrics {
  totalMaintenance: number;
  scheduledMaintenance: number;
  unscheduledMaintenance: number;
  averageDowntime: number;
  totalCost: number;
  nextScheduledMaintenance: Array<{
    aircraftId: string;
    registration: string;
    dueDate: string;
    type: string;
  }>;
}

export interface CustomerMetrics {
  totalCustomers: number;
  newCustomers: number;
  repeatCustomers: number;
  membershipDistribution: {
    [key: string]: number;
  };
  customerSatisfaction: number;
  topCustomers: Array<{
    id: string;
    name: string;
    totalSpent: number;
    totalFlights: number;
    membershipTier: string;
  }>;
}

export interface AnalyticsData {
  timeRange: 'day' | 'week' | 'month' | 'year';
  revenue: {
    current: number;
    previous: number;
    trend: number;
  };
  bookings: {
    current: number;
    previous: number;
    trend: number;
  };
  utilization: {
    current: number;
    previous: number;
    trend: number;
  };
  costs: {
    current: number;
    previous: number;
    trend: number;
  };
  chartData: Array<{
    date: string;
    revenue: number;
    bookings: number;
    utilization: number;
  }>;
} 