import { Aircraft, MaintenanceRecord } from '@/types/admin';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  PlaneTakeoff,
  Clock,
  Wrench,
  AlertTriangle,
  Calendar,
  DollarSign,
  BarChart,
  MapPin,
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

interface AircraftStatsProps {
  aircraft: Aircraft;
  maintenanceRecords: MaintenanceRecord[];
}

export function AircraftStats({ aircraft, maintenanceRecords }: AircraftStatsProps) {
  const getStatusColor = (status: Aircraft['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'in-maintenance':
        return 'bg-yellow-500';
      case 'in-use':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getMaintenanceStatus = () => {
    const nextMaintenance = new Date(aircraft.nextMaintenance || '');
    const daysUntilMaintenance = differenceInDays(nextMaintenance, new Date());

    if (daysUntilMaintenance <= 7) {
      return { status: 'critical', color: 'text-red-500' };
    } else if (daysUntilMaintenance <= 30) {
      return { status: 'warning', color: 'text-yellow-500' };
    }
    return { status: 'good', color: 'text-green-500' };
  };

  const calculateMaintenanceCosts = () => {
    const totalCost = maintenanceRecords.reduce((sum, record) => sum + (record.cost || 0), 0);
    const averageCost = totalCost / maintenanceRecords.length || 0;
    return { totalCost, averageCost };
  };

  const calculateUtilization = () => {
    const totalHours = aircraft.totalFlightHours;
    const daysInService = differenceInDays(
      new Date(),
      new Date(maintenanceRecords[0]?.startDate || new Date())
    );
    const averageHoursPerDay = totalHours / (daysInService || 1);
    return { totalHours, averageHoursPerDay };
  };

  const maintenanceStatus = getMaintenanceStatus();
  const { totalCost, averageCost } = calculateMaintenanceCosts();
  const { totalHours, averageHoursPerDay } = calculateUtilization();

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <PlaneTakeoff className="h-4 w-4 text-muted-foreground" />
              <Badge className={getStatusColor(aircraft.status)}>
                {aircraft.status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Flight Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{totalHours}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {averageHoursPerDay.toFixed(1)} hours/day average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Next Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Wrench className={`h-4 w-4 ${maintenanceStatus.color}`} />
              <div className="text-sm">
                {aircraft.nextMaintenance
                  ? format(new Date(aircraft.nextMaintenance), 'MMM d, yyyy')
                  : 'Not scheduled'}
              </div>
            </div>
            {maintenanceStatus.status !== 'good' && (
              <div className={`flex items-center gap-1 mt-2 text-xs ${maintenanceStatus.color}`}>
                <AlertTriangle className="h-3 w-3" />
                {maintenanceStatus.status === 'critical'
                  ? 'Maintenance due soon'
                  : 'Maintenance approaching'}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Base Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{aircraft.baseLocation}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Maintenance History</CardTitle>
            <CardDescription>
              Last {maintenanceRecords.length} maintenance records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {maintenanceRecords.slice(0, 5).map((record) => (
                <div key={record.id} className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">{record.type}</div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(record.startDate), 'MMM d, yyyy')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      ${record.cost?.toLocaleString()}
                    </div>
                    <Badge variant="outline">{record.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost Analysis</CardTitle>
            <CardDescription>
              Maintenance costs and trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Total Cost
                  </div>
                  <div className="text-2xl font-bold">
                    ${totalCost.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Average Cost
                  </div>
                  <div className="text-2xl font-bold">
                    ${averageCost.toLocaleString()}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  Cost Distribution
                </div>
                <div className="space-y-2">
                  {['scheduled', 'unscheduled'].map((type) => {
                    const typeRecords = maintenanceRecords.filter(
                      (record) => record.type === type
                    );
                    const typeCost = typeRecords.reduce(
                      (sum, record) => sum + (record.cost || 0),
                      0
                    );
                    const percentage = (typeCost / totalCost) * 100 || 0;

                    return (
                      <div key={type} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="capitalize">{type}</span>
                          <span>${typeCost.toLocaleString()}</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 