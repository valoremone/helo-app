import { useState } from 'react';
import { toast } from 'sonner';
import { MoreHorizontal, Plane, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { MaintenanceForm } from '@/components/forms/maintenance-form';
import { AircraftStats } from '@/components/fleet/aircraft-stats';
import { Aircraft } from '@/types/fleet';
import { MaintenanceRecord } from '@/types/maintenance';

// Mock data
const mockAircraft: Aircraft[] = [
  {
    id: "1",
    registration: "N12345",
    model: "Citation X",
    manufacturer: "Cessna",
    yearManufactured: 2015,
    status: "available",
    flightHours: 2500,
    range: 3500,
    cruisingSpeed: 525,
    capacity: 8,
    baseLocation: "KJFK",
    type: "Jet",
    amenities: ["WiFi", "Bathroom", "Galley"],
    images: {
      main: "https://example.com/citation-x.jpg",
      gallery: [],
    },
    lastMaintenance: "2024-02-15",
    nextMaintenance: "2024-05-15",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-03-01"),
  },
  {
    id: "2",
    registration: "N54321",
    model: "King Air 350i",
    manufacturer: "Beechcraft",
    yearManufactured: 2018,
    status: "in-maintenance",
    flightHours: 1800,
    range: 1800,
    cruisingSpeed: 360,
    capacity: 11,
    baseLocation: "KBOS",
    type: "Turboprop",
    amenities: ["WiFi", "Bathroom"],
    images: {
      main: "https://example.com/king-air.jpg",
      gallery: [],
    },
    lastMaintenance: "2024-03-01",
    nextMaintenance: "2024-06-01",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-03-01"),
  },
];

const mockMaintenanceRecords: MaintenanceRecord[] = [
  {
    id: 'M1',
    aircraftId: '1',
    description: 'Routine inspection and maintenance',
    date: '2024-02-15',
    cost: 5000,
    status: 'completed',
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
  },
  // Add more mock maintenance records as needed
];

export function FleetPage() {
  const [aircraft, setAircraft] = useState<Aircraft[]>(mockAircraft);
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft | null>(null);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAircraft = aircraft.filter(ac =>
    ac.registration.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ac.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: Aircraft['status']) => {
    const colors = {
      active: 'bg-green-500',
      maintenance: 'bg-yellow-500',
      inactive: 'bg-red-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const handleMaintenanceSubmit = async (data: Partial<MaintenanceRecord>) => {
    try {
      // TODO: Replace with actual API call
      console.log('Submitting maintenance:', data);
      setShowMaintenanceForm(false);
      toast.success('Maintenance scheduled successfully');
    } catch (error) {
      console.error('Failed to submit maintenance:', error);
      toast.error('Failed to schedule maintenance');
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Fleet Management</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Aircraft
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Plane className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search aircraft..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAircraft.map((ac) => (
          <Card key={ac.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {ac.registration}
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setSelectedAircraft(ac)}>
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedAircraft(ac);
                      setShowMaintenanceForm(true);
                    }}
                  >
                    Schedule Maintenance
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Model</span>
                  <span className="font-medium">{ac.model}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className="flex items-center">
                    <span
                      className={`mr-2 h-2 w-2 rounded-full ${getStatusColor(
                        ac.status
                      )}`}
                    />
                    <span className="capitalize">{ac.status}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Base</span>
                  <span>{ac.baseLocation}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedAircraft && !showMaintenanceForm && (
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
              onSubmit={handleMaintenanceSubmit}
              onCancel={() => setShowMaintenanceForm(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}