import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AdminAnalyticsProps {
  type?: 'flights' | 'financial' | 'maintenance';
}

const data = [
  { month: 'Jan', revenue: 65000, flights: 320, maintenance: 12 },
  { month: 'Feb', revenue: 59000, flights: 300, maintenance: 8 },
  { month: 'Mar', revenue: 80000, flights: 380, maintenance: 15 },
  { month: 'Apr', revenue: 81000, flights: 390, maintenance: 10 },
  { month: 'May', revenue: 56000, flights: 280, maintenance: 9 },
  { month: 'Jun', revenue: 55000, flights: 270, maintenance: 11 },
  { month: 'Jul', revenue: 40000, flights: 250, maintenance: 7 },
];

const chartConfigs = {
  flights: {
    title: 'Flight Activity',
    dataKey: 'flights',
    color: 'hsl(var(--chart-1))',
  },
  financial: {
    title: 'Revenue Overview',
    dataKey: 'revenue',
    color: 'hsl(var(--chart-2))',
  },
  maintenance: {
    title: 'Maintenance Activity',
    dataKey: 'maintenance',
    color: 'hsl(var(--chart-3))',
  },
};

export function AdminAnalytics({ type = 'flights' }: AdminAnalyticsProps) {
  const config = chartConfigs[type];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">{config.title}</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{config.title} Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey={config.dataKey}
                    stroke={config.color}
                    strokeWidth={2}
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