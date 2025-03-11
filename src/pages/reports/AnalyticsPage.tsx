import { Calendar } from 'lucide-react';
import { DollarSign } from 'lucide-react';
import { Percent } from 'lucide-react';
import { TrendingDown } from 'lucide-react';
import { TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { CartesianGrid } from 'recharts';
import { Legend } from 'recharts';
import { Line } from 'recharts';
import { LineChart } from 'recharts';
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
import { AnalyticsData } from '@/types/reports';
// Mock data
const mockAnalytics: AnalyticsData = {
  timeRange: 'month',
  revenue: {
    current: 875000,
    previous: 750000,
    trend: 16.67,
  },
  bookings: {
    current: 125,
    previous: 100,
    trend: 25,
  },
  utilization: {
    current: 85,
    previous: 78,
    trend: 8.97,
  },
  costs: {
    current: 450000,
    previous: 400000,
    trend: 12.5,
  },
  chartData: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(2024, 2, i + 1).toISOString().split('T')[0],
    revenue: Math.floor(20000 + Math.random() * 15000),
    bookings: Math.floor(2 + Math.random() * 8),
    utilization: Math.floor(70 + Math.random() * 30),
  })),
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<AnalyticsData['timeRange']>('month');
  const [analytics] = useState<AnalyticsData>(mockAnalytics);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatTrend = (trend: number) => {
    return `${trend >= 0 ? '+' : ''}${trend.toFixed(1)}%`;
  };

  const getTrendColor = (trend: number) => {
    return trend >= 0 ? 'text-green-500' : 'text-red-500';
  };

  const TrendIndicator = ({ value }: { value: number }) => (
    <div className={`flex items-center ${getTrendColor(value)}`}>
      {value >= 0 ? (
        <TrendingUp className="h-4 w-4 mr-1" />
      ) : (
        <TrendingDown className="h-4 w-4 mr-1" />
      )}
      {formatTrend(value)}
    </div>
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Track key performance metrics and trends
          </p>
        </div>
        <Select value={timeRange} onValueChange={(value: AnalyticsData['timeRange']) => setTimeRange(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(analytics.revenue.current)}
            </div>
            <TrendIndicator value={analytics.revenue.trend} />
            <p className="text-xs text-muted-foreground">
              vs. previous {timeRange}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.bookings.current}
            </div>
            <TrendIndicator value={analytics.bookings.trend} />
            <p className="text-xs text-muted-foreground">
              vs. previous {timeRange}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilization Rate</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.utilization.current}%
            </div>
            <TrendIndicator value={analytics.utilization.trend} />
            <p className="text-xs text-muted-foreground">
              vs. previous {timeRange}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Operating Costs</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(analytics.costs.current)}
            </div>
            <TrendIndicator value={-analytics.costs.trend} />
            <p className="text-xs text-muted-foreground">
              vs. previous {timeRange}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Bookings Trend</CardTitle>
            <CardDescription>
              Daily revenue and booking numbers over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      name === 'revenue' ? formatCurrency(value) : value,
                      name.charAt(0).toUpperCase() + name.slice(1),
                    ]}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3B82F6"
                    name="Revenue"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="bookings"
                    stroke="#10B981"
                    name="Bookings"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fleet Utilization</CardTitle>
            <CardDescription>
              Daily fleet utilization rate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis domain={[0, 100]} />
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, 'Utilization']}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="utilization"
                    stroke="#8B5CF6"
                    name="Utilization Rate"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}