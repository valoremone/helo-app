import { useState } from 'react';
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, PlaneTakeoff, Search, Wrench, Calendar } from 'lucide-react';
import type { Aircraft } from '@/types/fleet';
import { AircraftForm } from '@/components/fleet/AircraftForm';
import { z } from 'zod';

const aircraftFormSchema = z.object({
  registration: z.string(),
  type: z.string(),
  manufacturer: z.string(),
  model: z.string(),
  capacity: z.number(),
  baseLocation: z.string(),
  status: z.enum(['available', 'in-maintenance', 'in-flight', 'reserved']),
  totalFlightHours: z.number(),
  lastMaintenance: z.string(),
  nextMaintenance: z.string(),
  amenities: z.array(z.string()),
  images: z.object({
    main: z.string(),
    gallery: z.array(z.string()),
  }),
});

type AircraftFormValues = z.infer<typeof aircraftFormSchema>;

// Temporary mock data
const mockAircraft: Aircraft[] = [
  {
    id: '1',
    registration: 'N123HE',
    type: 'Jet',
    manufacturer: 'Gulfstream',
    model: 'G650',
    capacity: 19,
    status: 'available',
    lastMaintenance: '2024-02-15T00:00:00Z',
    nextMaintenance: '2024-04-15T00:00:00Z',
    totalFlightHours: 1250,
    baseLocation: 'KJFK',
    amenities: ['WiFi', 'Full Kitchen', 'Conference Room'],
    images: {
      main: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=2340&auto=format&fit=crop',
      gallery: [],
    },
  },
  {
    id: '2',
    registration: 'N456HE',
    type: 'Helicopter',
    manufacturer: 'Bell',
    model: '429',
    capacity: 8,
    status: 'in-maintenance',
    lastMaintenance: '2024-03-01T00:00:00Z',
    nextMaintenance: '2024-05-01T00:00:00Z',
    totalFlightHours: 850,
    baseLocation: 'KLGA',
    amenities: ['WiFi', 'Leather Seats'],
    images: {
      main: 'https://images.unsplash.com/photo-1700164805522-c3f2f8885144?q=80&w=2340&auto=format&fit=crop',
      gallery: [],
    },
  },
];

export default function FleetListPage() {
  const [aircraft, setAircraft] = useState<Aircraft[]>(mockAircraft);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft | null>(null);
  const [isAddingAircraft, setIsAddingAircraft] = useState(false);

  const filteredAircraft = aircraft.filter(item =>
    item.registration.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: Aircraft['status']) => {
    const colors = {
      'available': 'bg-green-500 text-white',
      'in-maintenance': 'bg-yellow-500 text-white',
      'in-flight': 'bg-blue-500 text-white',
      'reserved': 'bg-purple-500 text-white',
    };
    return colors[status] || 'bg-gray-500 text-white';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleAddAircraft = (formData: AircraftFormValues) => {
    const newAircraft: Aircraft = {
      id: String(aircraft.length + 1),
      ...formData,
    };
    setAircraft(prev => [...prev, newAircraft]);
    setIsAddingAircraft(false);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Fleet Management</h1>
        <Dialog open={isAddingAircraft} onOpenChange={setIsAddingAircraft}>
          <DialogTrigger asChild>
            <Button>
              <PlaneTakeoff className="h-4 w-4 mr-2" />
              Add Aircraft
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Aircraft</DialogTitle>
            </DialogHeader>
            <AircraftForm onSubmit={handleAddAircraft} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search aircraft..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Registration</TableHead>
              <TableHead>Aircraft</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Base</TableHead>
              <TableHead>Next Maintenance</TableHead>
              <TableHead>Flight Hours</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAircraft.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.registration}</TableCell>
                <TableCell>{item.manufacturer} {item.model}</TableCell>
                <TableCell>{item.capacity} seats</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(item.status)}>
                    {item.status.replace('-', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>{item.baseLocation}</TableCell>
                <TableCell>{formatDate(item.nextMaintenance)}</TableCell>
                <TableCell>{item.totalFlightHours.toLocaleString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => setSelectedAircraft(item)}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Wrench className="h-4 w-4 mr-2" />
                        Schedule Maintenance
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Calendar className="h-4 w-4 mr-2" />
                        View Schedule
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => {
                          const updatedAircraft = aircraft.map(a =>
                            a.id === item.id
                              ? { ...a, status: a.status === 'available' ? 'in-maintenance' as const : 'available' as const }
                              : a
                          );
                          setAircraft(updatedAircraft);
                        }}
                      >
                        {item.status === 'available' ? 'Mark as Maintenance' : 'Mark as Available'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedAircraft} onOpenChange={(open) => !open && setSelectedAircraft(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Aircraft Details</DialogTitle>
          </DialogHeader>
          {selectedAircraft && (
            <div className="space-y-4">
              <div className="aspect-video rounded-lg overflow-hidden">
                <img
                  src={selectedAircraft.images.main}
                  alt={`${selectedAircraft.manufacturer} ${selectedAircraft.model}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Registration</h3>
                  <p>{selectedAircraft.registration}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Aircraft</h3>
                  <p>{selectedAircraft.manufacturer} {selectedAircraft.model}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Type</h3>
                  <p>{selectedAircraft.type}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Capacity</h3>
                  <p>{selectedAircraft.capacity} seats</p>
                </div>
                <div>
                  <h3 className="font-semibold">Base Location</h3>
                  <p>{selectedAircraft.baseLocation}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Total Flight Hours</h3>
                  <p>{selectedAircraft.totalFlightHours.toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Last Maintenance</h3>
                  <p>{formatDate(selectedAircraft.lastMaintenance)}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Next Maintenance</h3>
                  <p>{formatDate(selectedAircraft.nextMaintenance)}</p>
                </div>
                <div className="col-span-2">
                  <h3 className="font-semibold">Amenities</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedAircraft.amenities.map((amenity) => (
                      <Badge key={amenity} variant="secondary">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 