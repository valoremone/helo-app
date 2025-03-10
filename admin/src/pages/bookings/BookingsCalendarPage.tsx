import { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import type { Booking, BookingCalendarEvent } from '@/types/bookings';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Temporary mock data
const mockBookings: Booking[] = [
  {
    id: '1',
    aircraftId: '1',
    customerId: 'cust1',
    customerName: 'John Smith',
    customerEmail: 'john@example.com',
    status: 'confirmed',
    type: 'charter',
    passengers: 4,
    departure: {
      location: 'KJFK',
      time: '2024-03-25T10:00:00Z',
    },
    arrival: {
      location: 'KLAS',
      time: '2024-03-25T13:00:00Z',
    },
    price: {
      base: 15000,
      fees: 1500,
      total: 16500,
      currency: 'USD',
    },
    paymentStatus: 'paid',
    specialRequests: 'Catering for 4 people, vegetarian options needed',
    createdAt: '2024-03-20T15:30:00Z',
    updatedAt: '2024-03-20T16:00:00Z',
  },
  {
    id: '2',
    aircraftId: '2',
    customerId: 'cust2',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah@example.com',
    status: 'pending',
    type: 'tour',
    passengers: 6,
    departure: {
      location: 'KLGA',
      time: '2024-03-26T14:00:00Z',
    },
    arrival: {
      location: 'KLGA',
      time: '2024-03-26T16:00:00Z',
    },
    price: {
      base: 5000,
      fees: 500,
      total: 5500,
      currency: 'USD',
    },
    paymentStatus: 'pending',
    createdAt: '2024-03-21T09:00:00Z',
    updatedAt: '2024-03-21T09:00:00Z',
  },
];

const mockAircraft = [
  { id: '1', registration: 'N123HE' },
  { id: '2', registration: 'N456HE' },
];

export default function BookingsCalendarPage() {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const getStatusColor = (status: Booking['status']) => {
    const colors = {
      'pending': 'bg-yellow-500 text-white',
      'confirmed': 'bg-blue-500 text-white',
      'in-progress': 'bg-purple-500 text-white',
      'completed': 'bg-green-500 text-white',
      'cancelled': 'bg-red-500 text-white',
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

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const calendarEvents: BookingCalendarEvent[] = mockBookings.map(booking => ({
    id: booking.id,
    title: `${booking.type.toUpperCase()} - ${booking.customerName}`,
    start: new Date(booking.departure.time),
    end: new Date(booking.arrival.time),
    resourceId: booking.aircraftId,
    status: booking.status,
    type: booking.type,
  }));

  const eventStyleGetter = (event: BookingCalendarEvent) => {
    const style: React.CSSProperties = {
      backgroundColor: event.status === 'pending' ? '#EAB308' :
                      event.status === 'confirmed' ? '#3B82F6' :
                      event.status === 'in-progress' ? '#9333EA' :
                      event.status === 'completed' ? '#22C55E' :
                      event.status === 'cancelled' ? '#EF4444' : '#6B7280',
      color: '#FFFFFF',
      borderRadius: '4px',
    };
    return { style };
  };

  const handleSelectEvent = (event: BookingCalendarEvent) => {
    const booking = mockBookings.find(b => b.id === event.id);
    if (booking) {
      setSelectedBooking(booking);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Bookings Calendar</h1>
        <p className="text-muted-foreground">
          View and manage flight bookings in calendar format
        </p>
      </div>

      <div className="h-[700px]">
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          resources={mockAircraft}
          resourceIdAccessor="id"
          resourceTitleAccessor="registration"
          views={['day', 'week', 'month', 'agenda']}
          defaultView="week"
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleSelectEvent}
          step={30}
          timeslots={2}
        />
      </div>

      <Dialog open={!!selectedBooking} onOpenChange={(open) => !open && setSelectedBooking(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">#{selectedBooking.id}</h3>
                  <p className="text-sm text-muted-foreground">
                    Created on {formatDateTime(selectedBooking.createdAt)}
                  </p>
                </div>
                <Badge className={getStatusColor(selectedBooking.status)}>
                  {selectedBooking.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Customer Information</h4>
                  <div className="space-y-1">
                    <p>{selectedBooking.customerName}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedBooking.customerEmail}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Flight Details</h4>
                  <div className="space-y-1">
                    <p className="capitalize">{selectedBooking.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedBooking.passengers} passengers
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Departure</h4>
                  <div className="space-y-1">
                    <p>{selectedBooking.departure.location}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(selectedBooking.departure.time)}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Arrival</h4>
                  <div className="space-y-1">
                    <p>{selectedBooking.arrival.location}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(selectedBooking.arrival.time)}
                    </p>
                  </div>
                </div>

                <div className="col-span-2">
                  <h4 className="font-semibold mb-2">Payment Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total</span>
                      <span>{formatCurrency(selectedBooking.price.total)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span>Payment Status</span>
                      <Badge variant={selectedBooking.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                        {selectedBooking.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                </div>

                {selectedBooking.specialRequests && (
                  <div className="col-span-2">
                    <h4 className="font-semibold mb-2">Special Requests</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedBooking.specialRequests}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 