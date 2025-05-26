import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Scale, Footprints, Heart, Droplets, TrendingDown, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function QuickStats() {
  const { data: summary, isLoading } = useQuery({
    queryKey: ["/api/dashboard/summary"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      label: "Weight",
      value: summary?.metrics?.weight ? `${summary.metrics.weight.value} ${summary.metrics.weight.unit}` : "No data",
      change: summary?.metrics?.weight ? "-2.3 lbs this week" : null,
      trending: "down",
      icon: Scale,
      color: "primary",
    },
    {
      label: "Steps Today",
      value: summary?.metrics?.steps ? summary.metrics.steps.toLocaleString() : "0",
      change: summary?.metrics?.steps ? `${Math.round((summary.metrics.steps / 10000) * 100)}% of goal` : "0% of goal",
      trending: null,
      icon: Footprints,
      color: "secondary",
    },
    {
      label: "Heart Rate",
      value: summary?.metrics?.heartRate ? `${summary.metrics.heartRate.value} ${summary.metrics.heartRate.unit}` : "No data",
      change: summary?.metrics?.heartRate ? "Normal range" : null,
      trending: null,
      icon: Heart,
      color: "destructive",
    },
    {
      label: "Water Intake",
      value: summary?.metrics?.water ? `${(summary.metrics.water / 8).toFixed(1)} L` : "0 L",
      change: summary?.metrics?.water ? `${Math.round((summary.metrics.water / 64) * 100)}% of daily goal` : "0% of daily goal",
      trending: null,
      icon: Droplets,
      color: "accent",
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "primary":
        return {
          bg: "bg-primary/10",
          text: "text-primary",
          icon: "text-primary",
        };
      case "secondary":
        return {
          bg: "bg-blue-100 dark:bg-blue-900/20",
          text: "text-blue-600 dark:text-blue-400",
          icon: "text-blue-600 dark:text-blue-400",
        };
      case "destructive":
        return {
          bg: "bg-red-100 dark:bg-red-900/20",
          text: "text-red-600 dark:text-red-400",
          icon: "text-red-600 dark:text-red-400",
        };
      case "accent":
        return {
          bg: "bg-cyan-100 dark:bg-cyan-900/20",
          text: "text-cyan-600 dark:text-cyan-400",
          icon: "text-cyan-600 dark:text-cyan-400",
        };
      default:
        return {
          bg: "bg-muted",
          text: "text-muted-foreground",
          icon: "text-muted-foreground",
        };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const colors = getColorClasses(stat.color);
        return (
          <Card key={stat.label} className="health-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  {stat.change && (
                    <p className={`text-sm flex items-center mt-1 ${colors.text}`}>
                      {stat.trending === "down" && <TrendingDown className="w-4 h-4 mr-1" />}
                      {stat.trending === "up" && <TrendingUp className="w-4 h-4 mr-1" />}
                      {stat.change}
                    </p>
                  )}
                </div>
                <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`metric-icon ${colors.icon}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
