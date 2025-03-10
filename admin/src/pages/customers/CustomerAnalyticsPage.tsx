import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  UserPlus,
  Star,
  DollarSign,
  Crown,
  Activity,
} from 'lucide-react';
import type { CustomerMetrics } from '@/types/reports';
import { MEMBERSHIP_TIERS } from '@/lib/constants';

// Mock data
const mockMetrics: CustomerMetrics = {
  totalCustomers: 850,
  newCustomers: 45,
  repeatCustomers: 625,
  membershipDistribution: {
    STANDARD: 500,
    ELITE: 200,
    BLACK: 100,
    PLATINUM: 50,
  },
  customerSatisfaction: 4.8,
  topCustomers: [
    {
      id: '1',
      name: 'John Smith',
      totalSpent: 250000,
      totalFlights: 35,
      membershipTier: 'PLATINUM',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      totalSpent: 180000,
      totalFlights: 28,
      membershipTier: 'BLACK',
    },
    {
      id: '3',
      name: 'Michael Brown',
      totalSpent: 150000,
      totalFlights: 22,
      membershipTier: 'BLACK',
    },
    {
      id: '4',
      name: 'Emily Davis',
      totalSpent: 120000,
      totalFlights: 18,
      membershipTier: 'ELITE',
    },
    {
      id: '5',
      name: 'David Wilson',
      totalSpent: 100000,
      totalFlights: 15,
      membershipTier: 'ELITE',
    },
  ],
};

const monthlyCustomers = Array.from({ length: 12 }, (_, i) => ({
  month: new Date(2024, i).toLocaleString('default', { month: 'short' }),
  total: Math.floor(750 + Math.random() * 200),
  new: Math.floor(30 + Math.random() * 30),
  repeat: Math.floor(50 + Math.random() * 50),
}));

const COLORS = ['#3B82F6', '#8B5CF6', '#000000', '#C4B087'];

export default function CustomerAnalyticsPage() {
  const [period, setPeriod] = useState('month');
  const [metrics] = useState<CustomerMetrics>(mockMetrics);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getMembershipColor = (tier: keyof typeof MEMBERSHIP_TIERS) => {
    const colors = {
      PLATINUM: 'bg-zinc-300 text-zinc-900',
      BLACK: 'bg-black text-white',
      ELITE: 'bg-purple-600 text-white',
      STANDARD: 'bg-blue-600 text-white',
    };
    return colors[tier] || 'bg-gray-600 text-white';
  };

  const membershipData = Object.entries(metrics.membershipDistribution).map(
    ([tier, count]) => ({
      name: MEMBERSHIP_TIERS[tier as keyof typeof MEMBERSHIP_TIERS],
      value: count,
    })
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Customer Analytics</h1>
          <p className="text-muted-foreground">
            Track customer metrics and engagement
          </p>
        </div>
        <Select defaultValue={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Daily</SelectItem>
            <SelectItem value="week">Weekly</SelectItem>
            <SelectItem value="month">Monthly</SelectItem>
            <SelectItem value="year">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              Active members across all tiers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              +{metrics.newCustomers}
            </div>
            <p className="text-xs text-muted-foreground">
              This {period}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Repeat Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {((metrics.repeatCustomers / metrics.totalCustomers) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.repeatCustomers} repeat customers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {metrics.customerSatisfaction}/5.0
            </div>
            <p className="text-xs text-muted-foreground">
              Average rating
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Growth</CardTitle>
            <CardDescription>New vs repeat customers over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyCustomers}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#3B82F6" name="Total Customers" />
                  <Bar dataKey="new" fill="#10B981" name="New Customers" />
                  <Bar dataKey="repeat" fill="#8B5CF6" name="Repeat Customers" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Membership Distribution</CardTitle>
            <CardDescription>Customer distribution by membership tier</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={membershipData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={130}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {membershipData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Customers</CardTitle>
          <CardDescription>Highest value customers by total spend</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Membership</TableHead>
                <TableHead>Total Flights</TableHead>
                <TableHead className="text-right">Total Spent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.topCustomers.map((customer, index) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {index === 0 && <Crown className="h-4 w-4 text-yellow-500" />}
                      {customer.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getMembershipColor(customer.membershipTier as keyof typeof MEMBERSHIP_TIERS)}>
                      {MEMBERSHIP_TIERS[customer.membershipTier as keyof typeof MEMBERSHIP_TIERS]}
                    </Badge>
                  </TableCell>
                  <TableCell>{customer.totalFlights}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(customer.totalSpent)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 