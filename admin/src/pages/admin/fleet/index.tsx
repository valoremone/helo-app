import { useState } from 'react';
import { Aircraft, MaintenanceRecord } from '@/types/admin';
import { AircraftStats } from '@/components/fleet/aircraft-stats';
import { MaintenanceForm } from '@/components/forms/maintenance-form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  MoreHorizontal,
  Search,
  PlaneTakeoff,
  Wrench,
  AlertTriangle,
  Plus,
  MapPin,
  Clock,
} from 'lucide-react';
import { format, addHours, differenceInDays } from 'date-fns';
import { toast } from 'sonner';

// Temporary mock data
const mockAircraft: Aircraft[] = [
  {
    id: 'AC001',
    registration: 'N123HE',
    type: 'Jet',
    model: 'Gulfstream G650',
    capacity: 19,
    status: 'available',
    lastMaintenance: '2024-02-15T00:00:00Z',
    nextMaintenance: '2024-04-15T00:00:00Z',
    totalFlightHours: 1250,
    baseLocation: 'LAX',
  },
  // Add more mock aircraft as needed
];

const mockMaintenanceRecords: MaintenanceRecord[] = [
  {
    id: 'M001',
    aircraftId: 'AC001',
    type: 'scheduled',
    description: 'Regular maintenance check',
    status: 'completed',
    startDate: '2024-02-15T00:00:00Z',
    endDate: '2024-02-16T00:00:00Z',
    cost: 25000,
    technician: 'John Smith',
    notes: 'All systems checked and verified',
  },
  // Add more mock maintenance records as needed
];

export function FleetPage() {
  const [aircraft, setAircraft] = useState<Aircraft[]>(mockAircraft);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft | null>(null);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);

  const filteredAircraft = aircraft.filter(ac => 
    ac.registration.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ac.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const getMaintenanceStatus = (aircraft: Aircraft) => {
    const nextMaintenance = new Date(aircraft.nextMaintenance || '');
    const daysUntilMaintenance = Math.ceil(
      (nextMaintenance.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilMaintenance <= 7) {
      return 'critical';
    } else if (daysUntilMaintenance <= 30) {
      return 'warning';
    }
    return 'good';
  };

  const handleStatusChange = (aircraftId: string, newStatus: Aircraft['status']) => {
    setAircraft(aircraft.map(ac => 
      ac.id === aircraftId ? { ...ac, status: newStatus } : ac
    ));
    toast.success(`Aircraft status updated to ${newStatus}`);
  };

  const handleMaintenanceSubmit = (data: any) => {
    // In a real application, this would make an API call
    const newMaintenanceRecord: MaintenanceRecord = {
      id: `M${mockMaintenanceRecords.length + 1}`,
      aircraftId: selectedAircraft?.id || '',
      ...data,
    };

    mockMaintenanceRecords.unshift(newMaintenanceRecord);

    if (selectedAircraft) {
      setAircraft(aircraft.map(ac => 
        ac.id === selectedAircraft.id
          ? {
              ...ac,
              status: 'in-maintenance',
              lastMaintenance: data.startDate,
              nextMaintenance: data.endDate,
            }
          : ac
      ));
    }

    setShowMaintenanceForm(false);
    toast.success('Maintenance scheduled successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Fleet Management</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Aircraft
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Aircraft</CardTitle>
            <CardDescription>Fleet size and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{aircraft.length}</div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Available</span>
                <span>{aircraft.filter(ac => ac.status === 'available').length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>In Maintenance</span>
                <span>{aircraft.filter(ac => ac.status === 'in-maintenance').length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>In Use</span>
                <span>{aircraft.filter(ac => ac.status === 'in-use').length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Maintenance Due</CardTitle>
            <CardDescription>Next 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {aircraft.filter(ac => getMaintenanceStatus(ac) !== 'good').length}
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-red-500">
                <AlertTriangle className="h-4 w-4" />
                <span>
                  {aircraft.filter(ac => getMaintenanceStatus(ac) === 'critical').length} aircraft need immediate attention
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Flight Hours</CardTitle>
            <CardDescription>Fleet lifetime</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {aircraft.reduce((sum, ac) => sum + ac.totalFlightHours, 0)}
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              Average: {Math.round(aircraft.reduce((sum, ac) => sum + ac.totalFlightHours, 0) / aircraft.length)} hours per aircraft
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search aircraft..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Registration</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Base</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Flight Hours</TableHead>
              <TableHead>Next Maintenance</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAircraft.map((ac) => (
              <TableRow key={ac.id}>
                <TableCell className="font-mono">{ac.registration}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <PlaneTakeoff className="h-4 w-4" />
                    {ac.model}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {ac.baseLocation}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(ac.status)}>
                    {ac.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {ac.totalFlightHours}
                  </div>
                </TableCell>
                <TableCell>
                  {ac.nextMaintenance ? (
                    <div className="flex items-center gap-2">
                      <Wrench className={`h-4 w-4 ${
                        getMaintenanceStatus(ac) === 'critical' ? 'text-red-500' :
                        getMaintenanceStatus(ac) === 'warning' ? 'text-yellow-500' :
                        'text-green-500'
                      }`} />
                      {format(new Date(ac.nextMaintenance), 'MMM d, yyyy')}
                    </div>
                  ) : (
                    'Not scheduled'
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedAircraft(ac)}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedAircraft(ac);
                          setShowMaintenanceForm(true);
                        }}
                      >
                        Schedule Maintenance
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(ac.id, 'available')}
                      >
                        Mark as Available
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(ac.id, 'in-maintenance')}
                      >
                        Mark as In Maintenance
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedAircraft && (
        <Dialog
          open={!!selectedAircraft && !showMaintenanceForm}
          onOpenChange={(open) => !open && setSelectedAircraft(null)}
        >
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Aircraft Details - {selectedAircraft.registration}</DialogTitle>
            </DialogHeader>
            <AircraftStats
              aircraft={selectedAircraft}
              maintenanceRecords={mockMaintenanceRecords.filter(
                record => record.aircraftId === selectedAircraft.id
              )}
            />
          </DialogContent>
        </Dialog>
      )}

      {showMaintenanceForm && selectedAircraft && (
        <Dialog
          open={showMaintenanceForm}
          onOpenChange={setShowMaintenanceForm}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Maintenance - {selectedAircraft.registration}</DialogTitle>
            </DialogHeader>
            <MaintenanceForm
              aircraftId={selectedAircraft.id}
              onSubmit={handleMaintenanceSubmit}
              onCancel={() => setShowMaintenanceForm(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 