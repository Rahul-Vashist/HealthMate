import { cn } from "@/lib/utils";
import { Heart, BarChart3, Zap, Target, Clock, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navItems = [
    { name: "Dashboard", icon: BarChart3, active: true },
    { name: "Metrics", icon: BarChart3, active: false },
    { name: "Activities", icon: Zap, active: false },
    { name: "Goals", icon: Target, active: false },
    { name: "History", icon: Clock, active: false },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-card shadow-lg border-r border-slate-200 dark:border-border transition-transform duration-300 ease-in-out",
        "lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">HealthTracker</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <nav className="space-y-2">
            {navItems.map((item) => (
              <a
                key={item.name}
                href="#"
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors",
                  item.active
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-primary hover:bg-slate-50 dark:hover:bg-muted"
                )}
              >
                <item.icon className="nav-icon" />
                <span>{item.name}</span>
              </a>
            ))}
          </nav>
          
          <div className="mt-8 pt-8 border-t border-border">
            <a
              href="#"
              className="flex items-center space-x-3 px-4 py-3 text-muted-foreground hover:text-primary hover:bg-slate-50 dark:hover:bg-muted rounded-lg transition-colors"
            >
              <Download className="nav-icon" />
              <span>Export Data</span>
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
