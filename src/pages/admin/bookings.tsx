import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import { TableBody } from '@/components/ui/table';
import { TableCell } from '@/components/ui/table';
import { TableHead } from '@/components/ui/table';
import { TableHeader } from '@/components/ui/table';
import { TableRow } from '@/components/ui/table';

interface AdminBookingsProps {
  view?: 'list' | 'calendar';
}

const bookings = [
  {
    id: 'BOK-001',
    customer: 'John Doe',
    route: 'LAX → SFO',
    date: '2024-03-25',
    status: 'confirmed',
  },
  {
    id: 'BOK-002',
    customer: 'Jane Smith',
    route: 'SFO → LAS',
    date: '2024-03-26',
    status: 'pending',
  },
  {
    id: 'BOK-003',
    customer: 'Robert Johnson',
    route: 'LAX → NYC',
    date: '2024-03-27',
    status: 'confirmed',
  },
];

export function AdminBookings({ view = 'list' }: AdminBookingsProps) {
  if (view === 'calendar') {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Bookings Calendar</h1>
        <Card>
          <div className="p-6">Calendar view coming soon...</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Bookings</h1>
      
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">{booking.id}</TableCell>
                <TableCell>{booking.customer}</TableCell>
                <TableCell>{booking.route}</TableCell>
                <TableCell>{booking.date}</TableCell>
                <TableCell>
                  <Badge
                    variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                  >
                    {booking.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}