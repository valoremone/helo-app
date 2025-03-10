import { useState } from 'react';
import { Booking } from '@/types/admin';
import { BookingCalendar } from '@/components/calendar/booking-calendar';
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
} from '@/components/ui/dropdown-menu';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  MoreHorizontal,
  Search,
  Calendar,
  Clock,
  MapPin,
  Users,
  List,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

// Temporary mock data
const mockBookings: Booking[] = [
  {
    id: '1',
    userId: '1',
    aircraftId: 'AC001',
    status: 'pending',
    departureLocation: 'LAX',
    arrivalLocation: 'SFO',
    departureTime: '2024-03-15T10:00:00Z',
    arrivalTime: '2024-03-15T11:30:00Z',
    passengers: 4,
    specialRequests: 'Vegetarian meals',
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
  },
  // Add more mock bookings as needed
];

export function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'list' | 'calendar'>('list');

  const filteredBookings = bookings.filter(booking => 
    booking.departureLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.arrivalLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      case 'completed':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleStatusChange = (bookingId: string, newStatus: Booking['status']) => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId ? { ...booking, status: newStatus, updatedAt: new Date().toISOString() } : booking
    ));
    toast.success(`Booking status updated to ${newStatus}`);
  };

  const handleBookingClick = (booking: Booking) => {
    // In a real application, this would navigate to a detailed view
    console.log('Booking clicked:', booking);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Booking Management</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            Export Data
          </Button>
        </div>
      </div>

      <Tabs value={view} onValueChange={(v) => setView(v as 'list' | 'calendar')}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="list">
              <List className="h-4 w-4 mr-2" />
              List View
            </TabsTrigger>
            <TabsTrigger value="calendar">
              <Calendar className="h-4 w-4 mr-2" />
              Calendar View
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </div>

        <TabsContent value="list" className="mt-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Passengers</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Special Requests</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-mono">{booking.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {booking.departureLocation} → {booking.arrivalLocation}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(booking.departureTime), 'MMM d, yyyy')}
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {format(new Date(booking.departureTime), 'HH:mm')} - 
                          {format(new Date(booking.arrivalTime), 'HH:mm')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {booking.passengers}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {booking.specialRequests || '-'}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(booking.id, 'confirmed')}
                          >
                            Confirm Booking
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(booking.id, 'completed')}
                          >
                            Mark as Completed
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(booking.id, 'cancelled')}
                            className="text-red-600"
                          >
                            Cancel Booking
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="mt-4">
          <BookingCalendar
            bookings={filteredBookings}
            onBookingClick={handleBookingClick}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
} 