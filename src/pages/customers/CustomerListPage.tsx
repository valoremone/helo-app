import { Mail } from 'lucide-react';
import { MoreHorizontal } from 'lucide-react';
import { Phone } from 'lucide-react';
import { Search } from 'lucide-react';
import { Star } from 'lucide-react';
import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { MEMBERSHIP_TIERS } from '@/lib/constants';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  membershipTier: keyof typeof MEMBERSHIP_TIERS;
  status: 'active' | 'inactive';
  totalSpent: number;
  totalFlights: number;
  lastFlight: string;
  joinDate: string;
  rating: number;
}

// Mock data
const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    membershipTier: 'PLATINUM',
    status: 'active',
    totalSpent: 250000,
    totalFlights: 35,
    lastFlight: '2024-03-15T10:00:00Z',
    joinDate: '2023-01-15T00:00:00Z',
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+1 (555) 234-5678',
    membershipTier: 'BLACK',
    status: 'active',
    totalSpent: 180000,
    totalFlights: 28,
    lastFlight: '2024-03-10T14:00:00Z',
    joinDate: '2023-02-20T00:00:00Z',
    rating: 4.9,
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael@example.com',
    phone: '+1 (555) 345-6789',
    membershipTier: 'ELITE',
    status: 'active',
    totalSpent: 120000,
    totalFlights: 20,
    lastFlight: '2024-03-05T09:00:00Z',
    joinDate: '2023-03-10T00:00:00Z',
    rating: 4.7,
  },
];

export default function CustomerListPage() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  );

  const getMembershipColor = (tier: keyof typeof MEMBERSHIP_TIERS) => {
    const colors = {
      PLATINUM: 'bg-zinc-300 text-zinc-900',
      BLACK: 'bg-black text-white',
      ELITE: 'bg-purple-600 text-white',
      STANDARD: 'bg-blue-600 text-white',
    };
    return colors[tier] || 'bg-gray-600 text-white';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Customers</h1>
          <p className="text-muted-foreground">
            Manage customer accounts and memberships
          </p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
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
              <TableHead>Customer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Membership</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Flights</TableHead>
              <TableHead>Last Flight</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="font-medium">{customer.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Member since {formatDate(customer.joinDate)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <Mail className="h-3 w-3 inline-block mr-1" />
                    {customer.email}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <Phone className="h-3 w-3 inline-block mr-1" />
                    {customer.phone}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getMembershipColor(customer.membershipTier)}>
                    {MEMBERSHIP_TIERS[customer.membershipTier]}
                  </Badge>
                </TableCell>
                <TableCell>{formatCurrency(customer.totalSpent)}</TableCell>
                <TableCell>{customer.totalFlights}</TableCell>
                <TableCell>{formatDate(customer.lastFlight)}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                    {customer.rating}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => setSelectedCustomer(customer)}>
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>Edit Details</DropdownMenuItem>
                      <DropdownMenuItem>View Bookings</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        Deactivate Account
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedCustomer} onOpenChange={(open) => !open && setSelectedCustomer(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Customer Profile</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{selectedCustomer.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Member since {formatDate(selectedCustomer.joinDate)}
                  </p>
                </div>
                <Badge className={getMembershipColor(selectedCustomer.membershipTier)}>
                  {MEMBERSHIP_TIERS[selectedCustomer.membershipTier]}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Contact Information</h4>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <Mail className="h-4 w-4 inline-block mr-1" />
                      {selectedCustomer.email}
                    </p>
                    <p className="text-sm">
                      <Phone className="h-4 w-4 inline-block mr-1" />
                      {selectedCustomer.phone}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Flight Activity</h4>
                  <div className="space-y-1">
                    <p className="text-sm">
                      Total Flights: {selectedCustomer.totalFlights}
                    </p>
                    <p className="text-sm">
                      Last Flight: {formatDate(selectedCustomer.lastFlight)}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Financial</h4>
                  <div className="space-y-1">
                    <p className="text-sm">
                      Total Spent: {formatCurrency(selectedCustomer.totalSpent)}
                    </p>
                    <p className="text-sm">
                      Average per Flight:{' '}
                      {formatCurrency(selectedCustomer.totalSpent / selectedCustomer.totalFlights)}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Satisfaction</h4>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                      {selectedCustomer.rating}/5.0 rating
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">View Bookings</Button>
                <Button>Edit Profile</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}