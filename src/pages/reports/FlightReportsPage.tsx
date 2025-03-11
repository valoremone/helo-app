import { CheckCircle2 } from 'lucide-react';
import { Clock } from 'lucide-react';
import { Plane } from 'lucide-react';
import { XCircle } from 'lucide-react';
import { useState } from 'react';
import { Bar } from 'recharts';
import { BarChart } from 'recharts';
import { CartesianGrid } from 'recharts';
import { Cell } from 'recharts';
import { Legend } from 'recharts';
import { Line } from 'recharts';
import { LineChart } from 'recharts';
import { Pie } from 'recharts';
import { PieChart } from 'recharts';
import { ResponsiveContainer } from 'recharts';
import { Tooltip } from 'recharts';
import { XAxis } from 'recharts';
import { YAxis } from 'recharts';
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
import { FlightMetrics } from '@/types/reports';
// Mock data
const mockMetrics: FlightMetrics = {
  totalFlights: 450,
  totalHours: 1250,
  utilizationRate: 85,
  onTimePerformance: 92,
  delayedFlights: 28,
  averageDelay: 22,
  cancellationRate: 1.2,
};

const dailyFlights = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(2024, 2, i + 1).toISOString().split('T')[0],
  flights: Math.floor(12 + Math.random() * 8),
  onTime: Math.floor(10 + Math.random() * 8),
  delayed: Math.floor(1 + Math.random() * 3),
}));

const delayReasons = [
  { name: 'Weather', value: 35 },
  { name: 'Technical', value: 25 },
  { name: 'Air Traffic', value: 20 },
  { name: 'Operational', value: 15 },
  { name: 'Other', value: 5 },
];

const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#8B5CF6', '#F59E0B'];

export default function FlightReportsPage() {
  const [period, setPeriod] = useState('month');
  const [metrics] = useState<FlightMetrics>(mockMetrics);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Flight Reports</h1>
          <p className="text-muted-foreground">
            Track flight operations and performance metrics
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
            <CardTitle className="text-sm font-medium">Total Flights</CardTitle>
            <Plane className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalFlights}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.totalHours.toLocaleString()} flight hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On-Time Performance</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {formatPercent(metrics.onTimePerformance)}
            </div>
            <p className="text-xs text-muted-foreground">
              Target: 95%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delayed Flights</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {metrics.delayedFlights}
            </div>
            <p className="text-xs text-muted-foreground">
              Avg. delay: {formatDuration(metrics.averageDelay)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancellation Rate</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {formatPercent(metrics.cancellationRate)}
            </div>
            <p className="text-xs text-muted-foreground">
              Target: {'<'}1%
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Daily Flight Performance</CardTitle>
            <CardDescription>Number of flights and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyFlights}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      value,
                      name === 'flights' ? 'Total Flights' :
                      name === 'onTime' ? 'On Time' : 'Delayed',
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="flights" fill="#3B82F6" name="Total Flights" />
                  <Bar dataKey="onTime" fill="#10B981" name="On Time" />
                  <Bar dataKey="delayed" fill="#EF4444" name="Delayed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delay Reasons</CardTitle>
            <CardDescription>Distribution of flight delay causes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={delayReasons}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={130}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {delayReasons.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, 'Percentage']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Flight Performance Trends</CardTitle>
          <CardDescription>On-time performance and delays over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyFlights}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    value,
                    name === 'onTime' ? 'On Time Flights' : 'Delayed Flights',
                  ]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="onTime"
                  stroke="#10B981"
                  name="On Time Flights"
                />
                <Line
                  type="monotone"
                  dataKey="delayed"
                  stroke="#EF4444"
                  name="Delayed Flights"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}