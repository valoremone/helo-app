import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import { Clock } from 'lucide-react';
import { List } from 'lucide-react';
import { MapPin } from 'lucide-react';
import { MoreHorizontal } from 'lucide-react';
import { Search } from 'lucide-react';
import { Users } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { BookingCalendar } from '@/components/calendar/booking-calendar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table } from '@/components/ui/table';
import { TableBody } from '@/components/ui/table';
import { TableCell } from '@/components/ui/table';
import { TableHead } from '@/components/ui/table';
import { TableHeader } from '@/components/ui/table';
import { TableRow } from '@/components/ui/table';
import { Tabs } from '@/components/ui/tabs';
import { TabsContent } from '@/components/ui/tabs';
import { TabsList } from '@/components/ui/tabs';
import { TabsTrigger } from '@/components/ui/tabs';
import { mockBookings } from '@/lib/mock-data';
import { Booking } from '@/types/bookings';
import { BookingStatus } from '@/types/bookings';
import { BookingCalendarEvent } from '@/components/placeholder-calendar';

export function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'list' | 'calendar'>('list');

  const filteredBookings = bookings.filter(booking => 
    booking.departure.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.arrival.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  // Add a function to convert bookings to calendar events
  const bookingsToEvents = (bookings: Booking[]): BookingCalendarEvent[] => {
    return bookings.map(booking => ({
      id: booking.id,
      title: `${booking.customerName} - ${booking.type}`,
      start: new Date(booking.departure.time),
      end: new Date(booking.arrival.time),
      status: booking.status === 'in-progress' ? 'confirmed' : 
              (booking.status === 'completed' ? 'confirmed' : booking.status),
      customer: booking.customerName,
      aircraft: booking.aircraftName || 'Unknown',
      resourceId: booking.aircraftId,
      type: booking.type
    }));
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
                    <TableCell className="font-medium">{booking.id}</TableCell>
                    <TableCell>{booking.customerName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        {booking.departure.location} → {booking.arrival.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        {format(new Date(booking.departure.time), 'PPP')}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(booking.departure.time), 'p')} - 
                        {format(new Date(booking.arrival.time), 'p')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        {booking.passengers}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {booking.notes || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleBookingClick(booking)}>
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleStatusChange(booking.id, 'confirmed' as BookingStatus)}
                            disabled={booking.status === 'confirmed'}
                          >
                            Confirm
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleStatusChange(booking.id, 'cancelled' as BookingStatus)}
                            disabled={booking.status === 'cancelled'}
                          >
                            Cancel
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
            events={bookingsToEvents(filteredBookings)}
            onSelectEvent={(event) => {
              const booking = bookings.find(b => b.id === event.id);
              if (booking) handleBookingClick(booking);
            }}
          />
        </TabsContent>
      </Tabs>

      <div className="mt-4">
        {filteredBookings.map((booking) => (
          <div key={booking.id} className="mt-4">
            <div className="text-sm font-medium">Booking Details</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium">Customer</div>
                <div>{booking.customerName}</div>
                <div className="text-sm text-muted-foreground">
                  {booking.customerEmail}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Flight</div>
                <div>{booking.type}</div>
                <div className="text-sm text-muted-foreground">
                  {booking.passengers} passengers
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Departure</div>
                <div>{booking.departure.location}</div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(booking.departure.time), 'PPP p')}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Arrival</div>
                <div>{booking.arrival.location}</div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(booking.arrival.time), 'PPP p')}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Price</div>
                <div>
                  ${booking.price.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  {booking.paymentStatus}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Status</div>
                <Badge className={getStatusColor(booking.status)}>
                  {booking.status}
                </Badge>
              </div>
            </div>
            {booking.notes && (
              <div className="mt-4">
                <div className="text-sm font-medium">Notes</div>
                <div className="text-sm text-muted-foreground">
                  {booking.notes}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}