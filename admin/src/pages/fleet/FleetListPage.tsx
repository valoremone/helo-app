import { Calendar } from 'lucide-react';
import { MoreHorizontal, Plane, Plus } from 'lucide-react';
import { Search } from 'lucide-react';
import { Wrench } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';
import { AircraftForm } from '@/components/fleet/AircraftForm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table } from '@/components/ui/table';
import { TableBody } from '@/components/ui/table';
import { TableCell } from '@/components/ui/table';
import { TableHead } from '@/components/ui/table';
import { TableHeader } from '@/components/ui/table';
import { TableRow } from '@/components/ui/table';
import { Aircraft } from '@/types/fleet';
import { formatDate } from '@/lib/utils';

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
    registration: 'N12345',
    model: 'Citation X',
    manufacturer: 'Cessna',
    yearManufactured: 2015,
    status: 'available',
    flightHours: 2500,
    range: 3500,
    cruisingSpeed: 525,
    capacity: 8,
    baseLocation: 'KJFK',
    type: 'Jet',
    amenities: ['WiFi', 'Bathroom', 'Galley'],
    images: {
      main: 'https://example.com/citation-x.jpg',
      gallery: [],
    },
    lastMaintenance: '2024-02-15',
    nextMaintenance: '2024-05-15',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-03-01'),
  },
  {
    id: '2',
    registration: 'N54321',
    model: 'King Air 350i',
    manufacturer: 'Beechcraft',
    yearManufactured: 2018,
    status: 'in-maintenance',
    flightHours: 1800,
    range: 1800,
    cruisingSpeed: 360,
    capacity: 11,
    baseLocation: 'KBOS',
    type: 'Turboprop',
    amenities: ['WiFi', 'Bathroom'],
    images: {
      main: 'https://example.com/king-air.jpg',
      gallery: [],
    },
    lastMaintenance: '2024-03-01',
    nextMaintenance: '2024-06-01',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-03-01'),
  },
];

export default function FleetListPage() {
  const [aircraft, setAircraft] = useState<Aircraft[]>(mockAircraft);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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

  const handleSubmit = (data: Partial<Aircraft>) => {
    if (isEditing && selectedAircraft) {
      const updatedAircraft = aircraft.map((a) =>
        a.id === selectedAircraft.id ? { ...a, ...data } : a
      ) as Aircraft[]
      setAircraft(updatedAircraft)
    } else {
      const newAircraft: Aircraft = {
        ...data as Aircraft,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setAircraft([...aircraft, newAircraft])
    }
    setIsFormOpen(false)
    setIsEditing(false)
  }

  const handleEdit = (item: Aircraft) => {
    setSelectedAircraft(item);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setAircraft(aircraft.filter((a) => a.id !== id));
  };

  const handleToggleMaintenance = (id: string) => {
    const updatedAircraft = aircraft.map((a) =>
      a.id === id
        ? { ...a, status: a.status === 'available' ? 'in-maintenance' as const : 'available' as const }
        : a
    );
    setAircraft(updatedAircraft);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Fleet Management</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Aircraft
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit Aircraft" : "Add New Aircraft"}</DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Update the aircraft details below"
                  : "Fill in the aircraft details below"}
              </DialogDescription>
            </DialogHeader>
            <AircraftForm
              initialData={selectedAircraft || undefined}
              onSubmit={handleSubmit}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Registration</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Next Maintenance</TableHead>
              <TableHead>Flight Hours</TableHead>
              <TableHead>Base</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAircraft.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.registration}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.model}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      item.status === 'available'
                        ? 'bg-green-100 text-green-800'
                        : item.status === 'in-maintenance'
                        ? 'bg-yellow-100 text-yellow-800'
                        : item.status === 'in-flight'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {item.status.replace('-', ' ')}
                  </span>
                </TableCell>
                <TableCell>{item.nextMaintenance ? formatDate(item.nextMaintenance) : 'N/A'}</TableCell>
                <TableCell>{item.flightHours.toLocaleString()}</TableCell>
                <TableCell>{item.baseLocation}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => {
                        setSelectedAircraft(item);
                        setIsDetailsOpen(true);
                      }}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(item)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleMaintenance(item.id)}>
                        {item.status === 'available' ? 'Mark as Maintenance' : 'Mark as Available'}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Aircraft Details</DialogTitle>
          </DialogHeader>
          {selectedAircraft && (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <img
                  src={selectedAircraft.images.main}
                  alt={selectedAircraft.model}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              <div>
                <h3 className="font-semibold">Registration</h3>
                <p>{selectedAircraft.registration}</p>
              </div>
              <div>
                <h3 className="font-semibold">Type</h3>
                <p>{selectedAircraft.type}</p>
              </div>
              <div>
                <h3 className="font-semibold">Model</h3>
                <p>{selectedAircraft.model}</p>
              </div>
              <div>
                <h3 className="font-semibold">Manufacturer</h3>
                <p>{selectedAircraft.manufacturer}</p>
              </div>
              <div>
                <h3 className="font-semibold">Year Manufactured</h3>
                <p>{selectedAircraft.yearManufactured}</p>
              </div>
              <div>
                <h3 className="font-semibold">Flight Hours</h3>
                <p>{selectedAircraft.flightHours.toLocaleString()}</p>
              </div>
              <div>
                <h3 className="font-semibold">Last Maintenance</h3>
                <p>{selectedAircraft.lastMaintenance ? formatDate(selectedAircraft.lastMaintenance) : 'N/A'}</p>
              </div>
              <div>
                <h3 className="font-semibold">Next Maintenance</h3>
                <p>{selectedAircraft.nextMaintenance ? formatDate(selectedAircraft.nextMaintenance) : 'N/A'}</p>
              </div>
              <div>
                <h3 className="font-semibold">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedAircraft.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}