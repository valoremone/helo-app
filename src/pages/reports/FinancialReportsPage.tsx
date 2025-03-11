import { useState } from 'react';
import { Bar } from 'recharts';
import { BarChart } from 'recharts';
import { CartesianGrid } from 'recharts';
import { Legend } from 'recharts';
import { ResponsiveContainer } from 'recharts';
import { Tooltip } from 'recharts';
import { XAxis } from 'recharts';
import { YAxis } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CardContent } from '@/components/ui/card';
import { CardDescription } from '@/components/ui/card';
import { CardHeader } from '@/components/ui/card';
import { CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { SelectContent } from '@/components/ui/select';
import { SelectItem } from '@/components/ui/select';
import { SelectTrigger } from '@/components/ui/select';
import { SelectValue } from '@/components/ui/select';
import { Table } from '@/components/ui/table';
import { TableBody } from '@/components/ui/table';
import { TableCell } from '@/components/ui/table';
import { TableHead } from '@/components/ui/table';
import { TableHeader } from '@/components/ui/table';
import { TableRow } from '@/components/ui/table';
import { RevenueData } from '@/types/reports';
// Mock data
const mockRevenueData: RevenueData = {
  period: '2024-03',
  revenue: 875000,
  bookings: 125,
  averageBookingValue: 7000,
  topRoutes: [
    {
      departure: 'KJFK',
      arrival: 'KLAS',
      revenue: 250000,
      bookings: 35,
    },
    {
      departure: 'KLGA',
      arrival: 'KMIA',
      revenue: 180000,
      bookings: 28,
    },
    {
      departure: 'KBOS',
      arrival: 'KORD',
      revenue: 150000,
      bookings: 22,
    },
    {
      departure: 'KJFK',
      arrival: 'KLAX',
      revenue: 120000,
      bookings: 15,
    },
    {
      departure: 'KPHL',
      arrival: 'KBOS',
      revenue: 95000,
      bookings: 18,
    },
  ],
};

const monthlyData = Array.from({ length: 12 }, (_, i) => ({
  month: new Date(2024, i).toLocaleString('default', { month: 'short' }),
  revenue: Math.floor(600000 + Math.random() * 400000),
  bookings: Math.floor(80 + Math.random() * 60),
}));

export default function FinancialReportsPage() {
  const [period, setPeriod] = useState('month');
  const [revenue] = useState<RevenueData>(mockRevenueData);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Financial Reports</h1>
          <p className="text-muted-foreground">
            Analyze revenue and financial performance
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

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(revenue.revenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              For {period === 'month' ? 'March' : '2024'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revenue.bookings}</div>
            <p className="text-xs text-muted-foreground">
              For {period === 'month' ? 'March' : '2024'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Average Booking Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(revenue.averageBookingValue)}
            </div>
            <p className="text-xs text-muted-foreground">Per booking</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue and bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      name === 'revenue' ? formatCurrency(value) : value,
                      name.charAt(0).toUpperCase() + name.slice(1),
                    ]}
                  />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="revenue"
                    fill="#3B82F6"
                    name="Revenue"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="bookings"
                    fill="#10B981"
                    name="Bookings"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Routes by Revenue</CardTitle>
            <CardDescription>Most profitable flight routes</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Route</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {revenue.topRoutes.map((route, index) => (
                  <TableRow key={`${route.departure}-${route.arrival}`}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Badge variant={index < 3 ? 'default' : 'secondary'}>
                          #{index + 1}
                        </Badge>
                        {route.departure} → {route.arrival}
                      </div>
                    </TableCell>
                    <TableCell>{route.bookings}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(route.revenue)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Distribution</CardTitle>
          <CardDescription>Revenue breakdown by route and booking type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenue.topRoutes}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis
                  type="category"
                  dataKey={(route) => `${route.departure} → ${route.arrival}`}
                />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#8B5CF6" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}