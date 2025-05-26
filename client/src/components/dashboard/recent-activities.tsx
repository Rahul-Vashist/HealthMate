import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Zap, Scale, CheckCircle, Droplets } from "lucide-react";

export default function RecentActivities() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ["/api/activities", { limit: 4 }],
  });

  if (isLoading) {
    return (
      <Card className="health-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Activities</CardTitle>
            <Button variant="link" size="sm">View All</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sample activities if none exist
  const displayActivities = activities?.length > 0 ? activities : [
    {
      id: 1,
      name: "Morning Run",
      type: "exercise",
      details: "3.2 miles • 28 minutes",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: 2,
      name: "Weight Log",
      type: "weight",
      details: "172 lbs recorded",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    },
    {
      id: 3,
      name: "Yoga Session",
      type: "exercise",
      details: "45 minutes • Hatha Yoga",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      id: 4,
      name: "Water Intake",
      type: "water",
      details: "8 glasses • Goal completed",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "exercise":
        return Zap;
      case "weight":
        return Scale;
      case "water":
        return Droplets;
      default:
        return CheckCircle;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "exercise":
        return "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400";
      case "weight":
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400";
      case "water":
        return "bg-cyan-100 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400";
      default:
        return "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400";
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays}d ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else {
      return "Just now";
    }
  };

  return (
    <Card className="health-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">Recent Activities</CardTitle>
          <Button variant="link" size="sm" className="text-primary hover:text-primary/80">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayActivities.map((activity: any) => {
            const Icon = getActivityIcon(activity.type);
            const colorClass = getActivityColor(activity.type);
            
            return (
              <div key={activity.id} className="flex items-center space-x-4 p-3 bg-slate-50 dark:bg-muted rounded-lg">
                <div className={`w-10 h-10 ${colorClass} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{activity.name}</p>
                  <p className="text-sm text-muted-foreground">{activity.details}</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {getTimeAgo(new Date(activity.createdAt))}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
