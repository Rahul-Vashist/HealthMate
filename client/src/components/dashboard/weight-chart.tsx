import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

export default function WeightChart() {
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year">("week");

  const { data: weightMetrics, isLoading } = useQuery({
    queryKey: ["/api/health-metrics", { type: "weight" }],
  });

  if (isLoading) {
    return (
      <Card className="health-card">
        <CardHeader>
          <CardTitle>Weight Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Transform data for chart
  const chartData = weightMetrics?.slice(0, 7).reverse().map((metric: any, index: number) => ({
    date: new Date(metric.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: metric.value,
  })) || [];

  // Add sample data if no real data exists
  if (chartData.length === 0) {
    const sampleData = [
      { date: 'Jan 1', weight: 178 },
      { date: 'Jan 8', weight: 175 },
      { date: 'Jan 15', weight: 174 },
      { date: 'Jan 22', weight: 172 },
      { date: 'Jan 29', weight: 171 },
      { date: 'Feb 5', weight: 172 },
      { date: 'Feb 12', weight: 172 },
    ];
    chartData.push(...sampleData);
  }

  return (
    <Card className="health-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">Weight Progress</CardTitle>
          <div className="flex space-x-2">
            <Button
              variant={timeframe === "week" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeframe("week")}
              className="text-sm"
            >
              Week
            </Button>
            <Button
              variant={timeframe === "month" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeframe("month")}
              className="text-sm"
            >
              Month
            </Button>
            <Button
              variant={timeframe === "year" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeframe("year")}
              className="text-sm"
            >
              Year
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                domain={['dataMin - 5', 'dataMax + 5']}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, stroke: "#ffffff", r: 6 }}
                activeDot={{ r: 8, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
