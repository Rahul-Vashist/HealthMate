import { apiRequest } from "./queryClient";

export interface HealthMetricData {
  type: string;
  value: number;
  unit: string;
  date: string;
  notes?: string;
}

export interface ActivityData {
  type: string;
  name: string;
  value?: number;
  unit?: string;
  details?: string;
  date: string;
}

export interface GoalData {
  name: string;
  type: string;
  targetValue: number;
  unit: string;
  targetDate?: string;
}

export const healthApi = {
  // Health Metrics
  getHealthMetrics: async (type?: string) => {
    const url = type ? `/api/health-metrics?type=${type}` : "/api/health-metrics";
    const response = await apiRequest("GET", url);
    return response.json();
  },

  getLatestMetric: async (type: string) => {
    const response = await apiRequest("GET", `/api/health-metrics/latest/${type}`);
    return response.json();
  },

  createHealthMetric: async (data: HealthMetricData) => {
    const response = await apiRequest("POST", "/api/health-metrics", data);
    return response.json();
  },

  // Activities
  getActivities: async (limit?: number) => {
    const url = limit ? `/api/activities?limit=${limit}` : "/api/activities";
    const response = await apiRequest("GET", url);
    return response.json();
  },

  getActivitiesByType: async (type: string) => {
    const response = await apiRequest("GET", `/api/activities/type/${type}`);
    return response.json();
  },

  getTodaySteps: async () => {
    const response = await apiRequest("GET", "/api/activities/today/steps");
    return response.json();
  },

  getTodayWater: async () => {
    const response = await apiRequest("GET", "/api/activities/today/water");
    return response.json();
  },

  createActivity: async (data: ActivityData) => {
    const response = await apiRequest("POST", "/api/activities", data);
    return response.json();
  },

  // Goals
  getGoals: async () => {
    const response = await apiRequest("GET", "/api/goals");
    return response.json();
  },

  createGoal: async (data: GoalData) => {
    const response = await apiRequest("POST", "/api/goals", data);
    return response.json();
  },

  updateGoal: async (id: number, updates: Partial<GoalData>) => {
    const response = await apiRequest("PATCH", `/api/goals/${id}`, updates);
    return response.json();
  },

  // Dashboard
  getDashboardSummary: async () => {
    const response = await apiRequest("GET", "/api/dashboard/summary");
    return response.json();
  },
};
