import { Activity, Calendar, Clock, Plane } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Aircraft } from '@/types/fleet';
import { MaintenanceRecord } from '@/types/maintenance';

export interface AircraftStatsProps {
  aircraft: Aircraft;
  maintenanceRecords: MaintenanceRecord[];
}

export function AircraftStats({ aircraft, maintenanceRecords }: AircraftStatsProps) {
  const totalFlightHours = aircraft.flightHours || 0;
  const lastMaintenance = maintenanceRecords[0]?.date || 'No maintenance records';
  const nextScheduledMaintenance = aircraft.nextMaintenance || 'Not scheduled';
  const maintenanceCount = maintenanceRecords.length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Flight Hours</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalFlightHours} hrs</div>
          <p className="text-xs text-muted-foreground">Lifetime hours</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Last Maintenance</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {typeof lastMaintenance === 'string'
              ? lastMaintenance
              : new Date(lastMaintenance).toLocaleDateString()}
          </div>
          <p className="text-xs text-muted-foreground">Last service date</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Next Maintenance</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {typeof nextScheduledMaintenance === 'string'
              ? nextScheduledMaintenance
              : new Date(nextScheduledMaintenance).toLocaleDateString()}
          </div>
          <p className="text-xs text-muted-foreground">Scheduled service</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Services</CardTitle>
          <Plane className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{maintenanceCount}</div>
          <p className="text-xs text-muted-foreground">Maintenance records</p>
        </CardContent>
      </Card>
    </div>
  );
}