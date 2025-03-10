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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import {
  Wrench,
  Calendar,
  Clock,
  AlertTriangle,
  DollarSign,
  Timer,
} from 'lucide-react';
import type { MaintenanceMetrics } from '@/types/reports';

// Mock data
const mockMetrics: MaintenanceMetrics = {
  totalMaintenance: 85,
  scheduledMaintenance: 65,
  unscheduledMaintenance: 20,
  averageDowntime: 480, // in minutes
  totalCost: 450000,
  nextScheduledMaintenance: [
    {
      aircraftId: '1',
      registration: 'N123HE',
      dueDate: '2024-04-15T10:00:00Z',
      type: '100-hour inspection',
    },
    {
      aircraftId: '2',
      registration: 'N456HE',
      dueDate: '2024-04-20T14:00:00Z',
      type: 'Annual inspection',
    },
    {
      aircraftId: '3',
      registration: 'N789HE',
      dueDate: '2024-04-25T09:00:00Z',
      type: '50-hour inspection',
    },
  ],
};

const monthlyData = Array.from({ length: 12 }, (_, i) => ({
  month: new Date(2024, i).toLocaleString('default', { month: 'short' }),
  scheduled: Math.floor(4 + Math.random() * 3),
  unscheduled: Math.floor(1 + Math.random() * 2),
  cost: Math.floor(30000 + Math.random() * 20000),
}));

const maintenanceTypes = [
  { type: 'Routine Inspection', count: 35, hours: 175 },
  { type: 'Component Replacement', count: 20, hours: 120 },
  { type: 'Repairs', count: 15, hours: 90 },
  { type: 'Upgrades', count: 10, hours: 60 },
  { type: 'Other', count: 5, hours: 35 },
];

export default function MaintenanceReportsPage() {
  const [period, setPeriod] = useState('month');
  const [metrics] = useState<MaintenanceMetrics>(mockMetrics);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
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
          <h1 className="text-2xl font-semibold">Maintenance Reports</h1>
          <p className="text-muted-foreground">
            Track maintenance activities and costs
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
            <CardTitle className="text-sm font-medium">Total Maintenance</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalMaintenance}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.scheduledMaintenance} scheduled, {metrics.unscheduledMaintenance} unscheduled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Downtime</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDuration(metrics.averageDowntime)}
            </div>
            <p className="text-xs text-muted-foreground">
              Per maintenance event
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(metrics.totalCost)}
            </div>
            <p className="text-xs text-muted-foreground">
              YTD maintenance expenses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Due</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.nextScheduledMaintenance[0].registration}
            </div>
            <p className="text-xs text-muted-foreground">
              Due: {formatDate(metrics.nextScheduledMaintenance[0].dueDate)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Events</CardTitle>
            <CardDescription>Monthly scheduled vs unscheduled maintenance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="scheduled"
                    fill="#3B82F6"
                    name="Scheduled"
                    stackId="a"
                  />
                  <Bar
                    dataKey="unscheduled"
                    fill="#EF4444"
                    name="Unscheduled"
                    stackId="a"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Maintenance Costs</CardTitle>
            <CardDescription>Monthly maintenance expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), 'Cost']}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="cost"
                    stroke="#8B5CF6"
                    name="Maintenance Cost"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Maintenance</CardTitle>
            <CardDescription>Next scheduled maintenance events</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aircraft</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.nextScheduledMaintenance.map((maintenance) => (
                  <TableRow key={maintenance.aircraftId}>
                    <TableCell className="font-medium">
                      {maintenance.registration}
                    </TableCell>
                    <TableCell>{maintenance.type}</TableCell>
                    <TableCell>{formatDate(maintenance.dueDate)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Maintenance by Type</CardTitle>
            <CardDescription>Distribution of maintenance activities</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Count</TableHead>
                  <TableHead>Hours</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {maintenanceTypes.map((type) => (
                  <TableRow key={type.type}>
                    <TableCell className="font-medium">{type.type}</TableCell>
                    <TableCell>{type.count}</TableCell>
                    <TableCell>{type.hours}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 