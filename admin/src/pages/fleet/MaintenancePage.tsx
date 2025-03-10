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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Calendar } from 'lucide-react';
import type { MaintenanceRecord } from '@/types/fleet';
import { MaintenanceForm } from '@/components/fleet/MaintenanceForm';

// Temporary mock data
const mockMaintenanceRecords: MaintenanceRecord[] = [
  {
    id: '1',
    aircraftId: '1',
    type: 'scheduled',
    description: 'Regular 100-hour inspection',
    startDate: '2024-04-15T10:00:00Z',
    endDate: '2024-04-15T18:00:00Z',
    status: 'pending',
    technician: 'John Smith',
    cost: 2500,
    notes: 'Including oil change and brake inspection',
  },
  {
    id: '2',
    aircraftId: '2',
    type: 'unscheduled',
    description: 'Avionics system check',
    startDate: '2024-03-25T09:00:00Z',
    endDate: '2024-03-25T14:00:00Z',
    status: 'in-progress',
    technician: 'Sarah Johnson',
    cost: 1800,
  },
];

// Mock aircraft options for the form
const mockAircraftOptions = [
  { id: '1', registration: 'N123HE' },
  { id: '2', registration: 'N456HE' },
];

export default function MaintenancePage() {
  const [records, setRecords] = useState<MaintenanceRecord[]>(mockMaintenanceRecords);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null);

  const filteredRecords = records.filter(record =>
    record.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.technician.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: MaintenanceRecord['status']) => {
    const colors = {
      'pending': 'bg-yellow-500 text-white',
      'in-progress': 'bg-blue-500 text-white',
      'completed': 'bg-green-500 text-white',
    };
    return colors[status] || 'bg-gray-500 text-white';
  };

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleAddMaintenance = (data: any) => {
    const newRecord: MaintenanceRecord = {
      id: String(records.length + 1),
      ...data,
    };
    setRecords(prev => [...prev, newRecord]);
    setIsAddingRecord(false);
  };

  const handleUpdateMaintenance = (data: any) => {
    const updatedRecords = records.map(record =>
      record.id === selectedRecord?.id ? { ...record, ...data } : record
    );
    setRecords(updatedRecords);
    setSelectedRecord(null);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Maintenance Schedule</h1>
        <Dialog open={isAddingRecord} onOpenChange={setIsAddingRecord}>
          <DialogTrigger asChild>
            <Button>
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Maintenance
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Schedule Maintenance</DialogTitle>
            </DialogHeader>
            <MaintenanceForm
              onSubmit={handleAddMaintenance}
              aircraftOptions={mockAircraftOptions}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search maintenance records..."
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
              <TableHead>Aircraft</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Technician</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>
                  {mockAircraftOptions.find(a => a.id === record.aircraftId)?.registration || record.aircraftId}
                </TableCell>
                <TableCell className="capitalize">{record.type}</TableCell>
                <TableCell>{record.description}</TableCell>
                <TableCell>{formatDateTime(record.startDate)}</TableCell>
                <TableCell>{formatDateTime(record.endDate)}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(record.status)}>
                    {record.status.replace('-', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>{record.technician}</TableCell>
                <TableCell>{formatCurrency(record.cost)}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedRecord(record)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedRecord} onOpenChange={(open) => !open && setSelectedRecord(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Maintenance Record</DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <MaintenanceForm
              initialData={selectedRecord}
              onSubmit={handleUpdateMaintenance}
              aircraftOptions={mockAircraftOptions}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 