import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Edit2, Plus } from 'lucide-react';

interface Vehicle {
  id: string;
  type: string;
  model: string;
  capacity: number;
  status: 'available' | 'in-use' | 'maintenance';
  nextMaintenance: string;
  registration?: string;
  baseLocation?: string;
  totalFlightHours?: number;
  lastMaintenance?: string;
}

const vehicles: Vehicle[] = [
  {
    id: 'AC-001',
    type: 'helicopter',
    model: 'Bell 429',
    capacity: 8,
    status: 'available',
    nextMaintenance: '2024-04-15',
    registration: 'N429BH',
    baseLocation: 'LAX',
    totalFlightHours: 1250,
    lastMaintenance: '2024-01-15',
  },
  {
    id: 'AC-002',
    type: 'helicopter',
    model: 'Airbus H160',
    capacity: 12,
    status: 'in-use',
    nextMaintenance: '2024-04-20',
    registration: 'N160AH',
    baseLocation: 'SFO',
    totalFlightHours: 850,
    lastMaintenance: '2024-02-01',
  },
  {
    id: 'AC-003',
    type: 'car',
    model: 'Mercedes-Maybach',
    capacity: 4,
    status: 'maintenance',
    nextMaintenance: '2024-03-25',
    registration: 'LUX001',
    baseLocation: 'LAX',
    totalFlightHours: 0,
    lastMaintenance: '2024-03-01',
  },
];

export function AdminFleet() {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedVehicle, setEditedVehicle] = useState<Vehicle | null>(null);

  const handleEditClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setEditedVehicle({ ...vehicle });
    setIsEditDialogOpen(true);
  };

  const handleSaveChanges = () => {
    if (editedVehicle) {
      // In a real app, this would make an API call to update the vehicle
      console.log('Saving changes:', editedVehicle);
      setIsEditDialogOpen(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Fleet Management</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Aircraft
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Aircraft</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">In Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Registration</TableHead>
              <TableHead>Base</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Next Maintenance</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow 
                key={vehicle.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleEditClick(vehicle)}
              >
                <TableCell className="font-medium">{vehicle.id}</TableCell>
                <TableCell className="capitalize">{vehicle.type}</TableCell>
                <TableCell>{vehicle.model}</TableCell>
                <TableCell>{vehicle.registration}</TableCell>
                <TableCell>{vehicle.baseLocation}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      vehicle.status === 'available'
                        ? 'default'
                        : vehicle.status === 'in-use'
                        ? 'secondary'
                        : 'destructive'
                    }
                  >
                    {vehicle.status}
                  </Badge>
                </TableCell>
                <TableCell>{vehicle.nextMaintenance}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(vehicle);
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Aircraft Details</DialogTitle>
            <DialogDescription>
              Make changes to the aircraft information below.
            </DialogDescription>
          </DialogHeader>
          {editedVehicle && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="id">Aircraft ID</Label>
                  <Input
                    id="id"
                    value={editedVehicle.id}
                    onChange={(e) =>
                      setEditedVehicle({ ...editedVehicle, id: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registration">Registration Number</Label>
                  <Input
                    id="registration"
                    value={editedVehicle.registration}
                    onChange={(e) =>
                      setEditedVehicle({ ...editedVehicle, registration: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={editedVehicle.type}
                    onValueChange={(value) =>
                      setEditedVehicle({ ...editedVehicle, type: value })
                    }
                  >
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="helicopter">Helicopter</SelectItem>
                      <SelectItem value="car">Car</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={editedVehicle.model}
                    onChange={(e) =>
                      setEditedVehicle({ ...editedVehicle, model: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity (pax)</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={editedVehicle.capacity}
                    onChange={(e) =>
                      setEditedVehicle({
                        ...editedVehicle,
                        capacity: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="base">Base Location</Label>
                  <Input
                    id="base"
                    value={editedVehicle.baseLocation}
                    onChange={(e) =>
                      setEditedVehicle({
                        ...editedVehicle,
                        baseLocation: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={editedVehicle.status}
                    onValueChange={(value: 'available' | 'in-use' | 'maintenance') =>
                      setEditedVehicle({ ...editedVehicle, status: value })
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="in-use">In Use</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="flightHours">Total Flight Hours</Label>
                  <Input
                    id="flightHours"
                    type="number"
                    value={editedVehicle.totalFlightHours}
                    onChange={(e) =>
                      setEditedVehicle({
                        ...editedVehicle,
                        totalFlightHours: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastMaintenance">Last Maintenance</Label>
                  <Input
                    id="lastMaintenance"
                    type="date"
                    value={editedVehicle.lastMaintenance}
                    onChange={(e) =>
                      setEditedVehicle({
                        ...editedVehicle,
                        lastMaintenance: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nextMaintenance">Next Maintenance</Label>
                  <Input
                    id="nextMaintenance"
                    type="date"
                    value={editedVehicle.nextMaintenance}
                    onChange={(e) =>
                      setEditedVehicle({
                        ...editedVehicle,
                        nextMaintenance: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}