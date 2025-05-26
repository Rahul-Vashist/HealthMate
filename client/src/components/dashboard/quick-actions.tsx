import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scale, Zap, Heart, Droplets, ChevronRight } from "lucide-react";

interface QuickActionsProps {
  onOpenModal: (type: 'weight' | 'activity' | 'vitals' | 'water') => void;
}

export default function QuickActions({ onOpenModal }: QuickActionsProps) {
  const actions = [
    {
      name: "Log Weight",
      icon: Scale,
      color: "primary",
      type: "weight" as const,
    },
    {
      name: "Log Activity",
      icon: Zap,
      color: "secondary",
      type: "activity" as const,
    },
    {
      name: "Log Vitals",
      icon: Heart,
      color: "destructive",
      type: "vitals" as const,
    },
    {
      name: "Log Water",
      icon: Droplets,
      color: "accent",
      type: "water" as const,
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "primary":
        return "bg-primary/10 text-primary";
      case "secondary":
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400";
      case "destructive":
        return "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400";
      case "accent":
        return "bg-cyan-100 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="health-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">Quick Log</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {actions.map((action) => (
            <Button
              key={action.name}
              variant="ghost"
              className="w-full flex items-center justify-between p-4 h-auto bg-slate-50 dark:bg-muted hover:bg-slate-100 dark:hover:bg-muted/80"
              onClick={() => onOpenModal(action.type)}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 ${getColorClasses(action.color)} rounded-lg flex items-center justify-center`}>
                  <action.icon className="w-4 h-4" />
                </div>
                <span className="font-medium text-foreground">{action.name}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
