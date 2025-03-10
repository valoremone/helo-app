import { useState } from 'react';
import { Booking } from '@/types/admin';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { format, isSameDay } from 'date-fns';
import { PlaneTakeoff, Users, Clock, MapPin } from 'lucide-react';

interface BookingCalendarProps {
  bookings: Booking[];
  onBookingClick: (booking: Booking) => void;
}

export function BookingCalendar({ bookings, onBookingClick }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const getDayBookings = (date: Date) => {
    return bookings.filter(booking => 
      isSameDay(new Date(booking.departureTime), date)
    );
  };

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

  return (
    <div className="grid md:grid-cols-[300px_1fr] gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
          <CardDescription>Select a date to view bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            modifiers={{
              booked: (date) => getDayBookings(date).length > 0,
            }}
            modifiersStyles={{
              booked: {
                fontWeight: 'bold',
                textDecoration: 'underline',
              },
            }}
          />
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>
              Bookings for {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Selected Date'}
            </CardTitle>
            <CardDescription>
              {getDayBookings(selectedDate || new Date()).length} bookings scheduled
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getDayBookings(selectedDate || new Date()).map((booking) => (
                <Card
                  key={booking.id}
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => {
                    setSelectedBooking(booking);
                    onBookingClick(booking);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <PlaneTakeoff className="h-4 w-4" />
                          <span className="font-medium">
                            {booking.departureLocation} → {booking.arrivalLocation}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {format(new Date(booking.departureTime), 'HH:mm')} - 
                          {format(new Date(booking.arrivalTime), 'HH:mm')}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          {booking.passengers} passengers
                        </div>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {getDayBookings(selectedDate || new Date()).length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No bookings scheduled for this date
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedBooking && (
        <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
              <DialogDescription>
                Booking ID: {selectedBooking.id}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Route</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4" />
                    {selectedBooking.departureLocation} → {selectedBooking.arrivalLocation}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium">Status</h4>
                  <Badge className={`mt-1 ${getStatusColor(selectedBooking.status)}`}>
                    {selectedBooking.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Departure</h4>
                  <div className="text-sm text-muted-foreground mt-1">
                    {format(new Date(selectedBooking.departureTime), 'PPP p')}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium">Arrival</h4>
                  <div className="text-sm text-muted-foreground mt-1">
                    {format(new Date(selectedBooking.arrivalTime), 'PPP p')}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium">Passengers</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Users className="h-4 w-4" />
                  {selectedBooking.passengers} passengers
                </div>
              </div>

              {selectedBooking.specialRequests && (
                <div>
                  <h4 className="font-medium">Special Requests</h4>
                  <div className="text-sm text-muted-foreground mt-1">
                    {selectedBooking.specialRequests}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 