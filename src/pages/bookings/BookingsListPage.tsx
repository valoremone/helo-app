import { Clock } from 'lucide-react';
import { Mail } from 'lucide-react';
import { MapPin } from 'lucide-react';
import { MoreHorizontal } from 'lucide-react';
import { Search } from 'lucide-react';
import { Users } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CardContent } from '@/components/ui/card';
import { CardHeader } from '@/components/ui/card';
import { CardTitle } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { DialogContent } from '@/components/ui/dialog';
import { DialogHeader } from '@/components/ui/dialog';
import { DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table } from '@/components/ui/table';
import { TableBody } from '@/components/ui/table';
import { TableCell } from '@/components/ui/table';
import { TableHead } from '@/components/ui/table';
import { TableHeader } from '@/components/ui/table';
import { TableRow } from '@/components/ui/table';
import { mockBookings } from '@/lib/mock-data';
import { Booking } from '@/types/bookings';
import { BookingStats } from '@/types/bookings';

const mockStats: BookingStats = {
  total: 24,
  pending: 5,
  confirmed: 10,
  completed: 7,
  cancelled: 2,
  revenue: {
    total: 350000,
    pending: 85000,
    received: 245000,
    refunded: 20000,
    currency: 'USD',
  },
};

export default function BookingsListPage() {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [stats] = useState<BookingStats>(mockStats);

  const filteredBookings = bookings.filter(booking =>
    booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const getPaymentStatusColor = (status: Booking['paymentStatus']) => {
    const colors = {
      'pending': 'bg-yellow-500 text-white',
      'paid': 'bg-green-500 text-white',
      'refunded': 'bg-red-500 text-white',
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

  const handleDeleteBooking = (id: string) => {
    const updatedBookings = bookings.filter((booking) => booking.id !== id);
    setBookings(updatedBookings);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    
    if (value === '') {
      setBookings(mockBookings);
    } else {
      const filtered = mockBookings.filter((booking) => 
        booking.customerName.toLowerCase().includes(value) || 
        booking.id.toLowerCase().includes(value) ||
        booking.type.toLowerCase().includes(value) ||
        booking.status.toLowerCase().includes(value)
      );
      setBookings(filtered);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold">Bookings</h1>
          <p className="text-muted-foreground">
            Manage and track all flight bookings
          </p>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{stats.confirmed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.revenue.total)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={handleFilterChange}
            className="pl-10"
          />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Departure</TableHead>
              <TableHead>Arrival</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">#{booking.id}</TableCell>
                <TableCell>
                  <div>{booking.customerName}</div>
                  <div className="text-sm text-muted-foreground">
                    {booking.customerEmail}
                  </div>
                </TableCell>
                <TableCell className="capitalize">{booking.type}</TableCell>
                <TableCell>
                  <div>{booking.departure.location}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDateTime(booking.departure.time)}
                  </div>
                </TableCell>
                <TableCell>
                  <div>{booking.arrival.location}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDateTime(booking.arrival.time)}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
                    {booking.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{formatCurrency(booking.price)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => setSelectedBooking(booking)}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="h-4 w-4 mr-2" />
                        Email Customer
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDeleteBooking(booking.id)}
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
                      <Users className="h-4 w-4 inline mr-1" />
                      {selectedBooking.passengers} passengers
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Departure</h4>
                  <div className="space-y-1">
                    <p>
                      <MapPin className="h-4 w-4 inline mr-1" />
                      {selectedBooking.departure.location}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 inline mr-1" />
                      {formatDateTime(selectedBooking.departure.time)}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Arrival</h4>
                  <div className="space-y-1">
                    <p>
                      <MapPin className="h-4 w-4 inline mr-1" />
                      {selectedBooking.arrival.location}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 inline mr-1" />
                      {formatDateTime(selectedBooking.arrival.time)}
                    </p>
                  </div>
                </div>

                <div className="col-span-2">
                  <h4 className="font-semibold mb-2">Payment Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-t border-gray-200 mt-2 pt-3">
                      <span className="font-medium">Total Price:</span>
                      <span>{formatCurrency(selectedBooking.price)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span>Payment Status</span>
                      <Badge className={getPaymentStatusColor(selectedBooking.paymentStatus)}>
                        {selectedBooking.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="col-span-2">
                  <h4 className="font-semibold mb-2">Price</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Total</span>
                      <span>{formatCurrency(selectedBooking.price)}</span>
                    </div>
                  </div>
                </div>

                {selectedBooking.notes && (
                  <div className="col-span-2 mt-4">
                    <h4 className="font-semibold mb-2">Notes</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedBooking.notes}
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