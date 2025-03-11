export interface MaintenanceRecord {
  id: string;
  description: string;
  date: string;
  cost: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  aircraftId: string;
} 