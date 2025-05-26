import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface DataEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'weight' | 'activity' | 'vitals' | 'water';
}

export default function DataEntryModal({ isOpen, onClose, type }: DataEntryModalProps) {
  const [formData, setFormData] = useState({
    value: "",
    unit: "",
    date: new Date().toISOString().split('T')[0],
    notes: "",
    name: "",
    details: "",
    activityType: "",
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createHealthMetricMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/health-metrics", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/health-metrics"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/summary"] });
      toast({
        title: "Success",
        description: "Health metric logged successfully",
      });
      onClose();
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to log health metric",
        variant: "destructive",
      });
    },
  });

  const createActivityMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/activities", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/summary"] });
      toast({
        title: "Success",
        description: "Activity logged successfully",
      });
      onClose();
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to log activity",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      value: "",
      unit: "",
      date: new Date().toISOString().split('T')[0],
      notes: "",
      name: "",
      details: "",
      activityType: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (type === "weight" || type === "vitals") {
      const metricType = type === "weight" ? "weight" : "heart_rate";
      const unit = type === "weight" ? "lbs" : "bpm";
      
      createHealthMetricMutation.mutate({
        type: metricType,
        value: parseFloat(formData.value),
        unit,
        date: formData.date,
        notes: formData.notes,
      });
    } else {
      const activityType = type === "activity" ? formData.activityType : type;
      
      createActivityMutation.mutate({
        type: activityType,
        name: formData.name || getDefaultName(type),
        value: formData.value ? parseFloat(formData.value) : null,
        unit: getDefaultUnit(type),
        details: formData.details,
        date: formData.date,
      });
    }
  };

  const getDefaultName = (type: string) => {
    switch (type) {
      case "water":
        return "Water Intake";
      case "activity":
        return formData.activityType || "Exercise";
      default:
        return "Activity";
    }
  };

  const getDefaultUnit = (type: string) => {
    switch (type) {
      case "water":
        return "oz";
      case "activity":
        return "minutes";
      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch (type) {
      case "weight":
        return "Log Weight";
      case "activity":
        return "Log Activity";
      case "vitals":
        return "Log Vitals";
      case "water":
        return "Log Water Intake";
      default:
        return "Log Data";
    }
  };

  const getFieldLabel = () => {
    switch (type) {
      case "weight":
        return "Weight (lbs)";
      case "vitals":
        return "Heart Rate (BPM)";
      case "water":
        return "Water (oz)";
      case "activity":
        return "Duration (minutes)";
      default:
        return "Value";
    }
  };

  const getPlaceholder = () => {
    switch (type) {
      case "weight":
        return "Enter weight";
      case "vitals":
        return "Enter heart rate";
      case "water":
        return "Enter water intake";
      case "activity":
        return "Enter duration";
      default:
        return "Enter value";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{getModalTitle()}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {type === "activity" && (
            <div>
              <Label htmlFor="activityType">Activity Type</Label>
              <Select value={formData.activityType} onValueChange={(value) => setFormData(prev => ({ ...prev, activityType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select activity type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="exercise">Exercise</SelectItem>
                  <SelectItem value="steps">Steps</SelectItem>
                  <SelectItem value="sleep">Sleep</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {(type === "activity" || type === "water") && (
            <div>
              <Label htmlFor="name">Activity Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder={type === "water" ? "Water intake" : "Activity name"}
                required
              />
            </div>
          )}
          
          <div>
            <Label htmlFor="value">{getFieldLabel()}</Label>
            <Input
              id="value"
              type="number"
              step="0.1"
              value={formData.value}
              onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
              placeholder={getPlaceholder()}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>

          {type === "activity" && (
            <div>
              <Label htmlFor="details">Details</Label>
              <Input
                id="details"
                value={formData.details}
                onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
                placeholder="e.g., 3.2 miles, 300 calories burned"
              />
            </div>
          )}
          
          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Add any notes..."
              rows={3}
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={createHealthMetricMutation.isPending || createActivityMutation.isPending}
            >
              {(createHealthMetricMutation.isPending || createActivityMutation.isPending) ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
