import * as React from 'react';
import { Bar } from 'recharts';
import { BarChart as RechartsBarChart } from 'recharts';
import { CartesianGrid } from 'recharts';
import { Legend } from 'recharts';
import { Line } from 'recharts';
import { LineChart as RechartsLineChart } from 'recharts';
import { ResponsiveContainer } from 'recharts';
import { Tooltip } from 'recharts';
import { XAxis } from 'recharts';
import { YAxis } from 'recharts';
import { cn } from '@/lib/utils';
// Color palette for charts
const colors = {
  primary: "hsl(var(--primary))",
  muted: "hsl(var(--muted))",
  accent: "hsl(var(--accent))",
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",
  border: "hsl(var(--border))"
};

// Line chart component
interface LineChartProps {
  data: Array<Record<string, any>>;
  categories: string[];
  index: string;
  colors?: string[];
  valueFormatter?: (value: number) => string;
  yAxisWidth?: number;
  showLegend?: boolean;
  showGridLines?: boolean;
  showAnimation?: boolean;
  className?: string;
}

function LineChart({
  data,
  categories,
  index,
  colors: customColors,
  valueFormatter = (value: number) => value.toString(),
  yAxisWidth = 56,
  showLegend = true,
  showGridLines = true,
  showAnimation = true,
  className,
}: LineChartProps) {
  // Create a stable colors array based on our defaults and custom colors
  const chartColors = React.useMemo(() => {
    const defaultColors = [
      colors.primary,
      colors.accent,
      "hsl(var(--blue-500))",
      "hsl(var(--green-500))",
      "hsl(var(--red-500))",
    ];
    return customColors || defaultColors;
  }, [customColors]);

  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height={350}>
        <RechartsLineChart
          data={data}
          margin={{
            top: 20,
            right: 20,
            left: 0,
            bottom: 30,
          }}
        >
          {showGridLines && (
            <CartesianGrid 
              strokeDasharray="3 3" 
              strokeOpacity={0.25} 
              stroke={colors.border}
            />
          )}
          <XAxis 
            dataKey={index} 
            tickLine={false}
            axisLine={false}
            fontSize={12}
            tickMargin={8}
            stroke={colors.foreground}
          />
          <YAxis 
            width={yAxisWidth}
            tickFormatter={valueFormatter}
            axisLine={false}
            tickLine={false}
            fontSize={12}
            stroke={colors.foreground}
          />
          <Tooltip 
            formatter={valueFormatter}
            contentStyle={{ 
              backgroundColor: colors.background,
              borderColor: colors.border,
              fontSize: "12px",
              borderRadius: "4px",
              color: colors.foreground
            }}
            cursor={{ strokeDasharray: '3 3' }}
          />
          {showLegend && <Legend verticalAlign="top" height={40} />}
          {categories.map((category, i) => (
            <Line
              key={category}
              type="monotone"
              dataKey={category}
              stroke={chartColors[i % chartColors.length]}
              strokeWidth={2}
              dot={{
                fill: chartColors[i % chartColors.length],
                r: 4
              }}
              isAnimationActive={showAnimation}
              activeDot={{ r: 6 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Bar chart component
interface BarChartProps {
  data: Array<Record<string, any>>;
  categories: string[];
  index: string;
  colors?: string[];
  valueFormatter?: (value: number) => string;
  yAxisWidth?: number;
  showLegend?: boolean;
  showGridLines?: boolean;
  showAnimation?: boolean;
  className?: string;
}

function BarChart({
  data,
  categories,
  index,
  colors: customColors,
  valueFormatter = (value: number) => value.toString(),
  yAxisWidth = 56,
  showLegend = true,
  showGridLines = true,
  showAnimation = true,
  className,
}: BarChartProps) {
  // Create a stable colors array based on our defaults and custom colors
  const chartColors = React.useMemo(() => {
    const defaultColors = [
      colors.primary,
      colors.accent,
      "hsl(var(--blue-500))",
      "hsl(var(--green-500))",
      "hsl(var(--red-500))",
    ];
    return customColors || defaultColors;
  }, [customColors]);

  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height={350}>
        <RechartsBarChart
          data={data}
          margin={{
            top: 20,
            right: 20,
            left: 0,
            bottom: 30,
          }}
        >
          {showGridLines && (
            <CartesianGrid 
              strokeDasharray="3 3" 
              strokeOpacity={0.25} 
              stroke={colors.border}
            />
          )}
          <XAxis 
            dataKey={index} 
            tickLine={false}
            axisLine={false}
            fontSize={12}
            tickMargin={8}
            stroke={colors.foreground}
          />
          <YAxis 
            width={yAxisWidth}
            tickFormatter={valueFormatter}
            axisLine={false}
            tickLine={false}
            fontSize={12}
            stroke={colors.foreground}
          />
          <Tooltip 
            formatter={valueFormatter}
            contentStyle={{ 
              backgroundColor: colors.background,
              borderColor: colors.border,
              fontSize: "12px",
              borderRadius: "4px",
              color: colors.foreground
            }}
          />
          {showLegend && <Legend verticalAlign="top" height={40} />}
          {categories.map((category, i) => (
            <Bar
              key={category}
              dataKey={category}
              fill={chartColors[i % chartColors.length]}
              isAnimationActive={showAnimation}
              radius={[4, 4, 0, 0]}
              barSize={30}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

export { LineChart, BarChart };