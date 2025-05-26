import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";

export default function GoalsProgress() {
  const { data: goals, isLoading } = useQuery({
    queryKey: ["/api/goals"],
  });

  if (isLoading) {
    return (
      <Card className="health-card">
        <CardHeader>
          <CardTitle>Current Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sample goals if none exist
  const displayGoals = goals?.length > 0 ? goals : [
    {
      id: 1,
      name: "Lose 10 lbs",
      targetValue: 10,
      currentValue: 7,
      unit: "lbs",
      targetDate: "2024-04-30",
      type: "weight_loss"
    },
    {
      id: 2,
      name: "Walk 10,000 steps daily",
      targetValue: 10000,
      currentValue: 8429,
      unit: "steps",
      targetDate: null,
      type: "daily_steps"
    },
    {
      id: 3,
      name: "Exercise 5x per week",
      targetValue: 5,
      currentValue: 3,
      unit: "sessions",
      targetDate: null,
      type: "weekly_exercise"
    }
  ];

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-primary";
    if (percentage >= 60) return "bg-blue-500";
    if (percentage >= 40) return "bg-cyan-500";
    return "bg-muted-foreground";
  };

  return (
    <Card className="health-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">Current Goals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {displayGoals.map((goal: any) => {
            const percentage = Math.min((goal.currentValue / goal.targetValue) * 100, 100);
            
            return (
              <div key={goal.id}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{goal.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {goal.currentValue}/{goal.targetValue} {goal.unit}
                  </span>
                </div>
                <Progress 
                  value={percentage} 
                  className="h-2 mb-1"
                />
                <p className="text-xs text-muted-foreground">
                  {goal.targetDate 
                    ? `Target: ${new Date(goal.targetDate).toLocaleDateString()}`
                    : goal.type === "daily_steps" 
                      ? "Daily goal"
                      : "Weekly goal"
                  }
                </p>
              </div>
            );
          })}
        </div>

        <Button className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Set New Goal
        </Button>
      </CardContent>
    </Card>
  );
}
