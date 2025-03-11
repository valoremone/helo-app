import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CardContent } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { DialogContent } from '@/components/ui/dialog';
import { DialogDescription } from '@/components/ui/dialog';
import { DialogHeader } from '@/components/ui/dialog';
import { DialogTitle } from '@/components/ui/dialog';
import { mockBookings } from '@/lib/mock-data';
import { Booking } from '@/types/bookings';
import { Calendar, BookingCalendarEvent } from '@/components/placeholder-calendar';

// Mock function to convert bookings to calendar events
const convertBookingsToEvents = (bookings: typeof mockBookings): BookingCalendarEvent[] => {
  return bookings.map(booking => ({
    id: booking.id,
    title: `${booking.type.charAt(0).toUpperCase() + booking.type.slice(1)}: ${booking.customerName}`,
    start: new Date(booking.departure.time),
    end: new Date(booking.arrival.time),
    status: booking.status,
    customer: booking.customerName,
    aircraft: booking.aircraftName || 'Unknown',
    resourceId: booking.aircraftId,
    type: booking.type
  }));
};

const BookingsCalendarPage: React.FC = () => {
  const [events, setEvents] = useState<BookingCalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<BookingCalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    // Get bookings from mock data
    const bookings = mockBookings;
    
    // Convert bookings to calendar events
    const calendarEvents = convertBookingsToEvents(bookings);
    setEvents(calendarEvents);
  }, []);

  const handleSelectEvent = (event: BookingCalendarEvent) => {
    setSelectedEvent(event);
    
    // Find the corresponding booking
    const booking = mockBookings.find(b => b.id === event.id);
    if (booking) {
      setSelectedBooking(booking);
      setIsModalOpen(true);
    }
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };

    // Default to gray if status isn't in our mapping
    const colorClass = statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';

    return (
      <Badge 
        className={`${colorClass} text-xs font-medium px-2 py-0.5 rounded-full`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Bookings Calendar</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Booking
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="text-center p-8 mb-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="text-xl font-medium mb-2">Calendar View Disabled</h3>
            <p className="text-gray-600 dark:text-gray-300">
              The calendar functionality has been removed as requested. Below is a simplified list of bookings.
            </p>
          </div>
          
          <div className="space-y-4">
            {events.map(event => (
              <div 
                key={event.id}
                className="p-4 border rounded-lg hover:shadow-md cursor-pointer bg-white dark:bg-gray-800"
                onClick={() => handleSelectEvent(event)}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{event.title}</h3>
                  <StatusBadge status={event.status} />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {new Date(event.start).toLocaleString()} - {new Date(event.end).toLocaleString()}
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Aircraft:</span>
                  <span>{event.aircraft}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Event Details Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              View the details of the selected booking
            </DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-4 pt-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium">{selectedBooking.type.charAt(0).toUpperCase() + selectedBooking.type.slice(1)} Flight</h3>
                <StatusBadge status={selectedBooking.status} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-medium">{selectedBooking.customerName}</p>
                  <p className="text-sm">{selectedBooking.customerEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Aircraft</p>
                  <p className="font-medium">{selectedBooking.aircraftName}</p>
                  <p className="text-sm">{selectedBooking.passengers} passengers</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Departure</p>
                  <p className="font-medium">{selectedBooking.departure.location}</p>
                  <p className="text-sm">{format(new Date(selectedBooking.departure.time), 'PPP p')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Arrival</p>
                  <p className="font-medium">{selectedBooking.arrival.location}</p>
                  <p className="text-sm">{format(new Date(selectedBooking.arrival.time), 'PPP p')}</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <p className="text-sm text-gray-500">Price</p>
                <p className="text-xl font-bold">${selectedBooking.price.toLocaleString()}</p>
                <p className="text-sm">
                  Payment Status: 
                  <Badge className="ml-2">{selectedBooking.paymentStatus}</Badge>
                </p>
              </div>
              
              {selectedBooking.notes && (
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500">Notes</p>
                  <p className="text-sm mt-1">{selectedBooking.notes}</p>
                </div>
              )}
              
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline">Edit</Button>
                <Button>View Details</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingsCalendarPage;