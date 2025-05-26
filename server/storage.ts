import { 
  users, 
  healthMetrics,
  activities,
  goals,
  type User, 
  type InsertUser,
  type HealthMetric,
  type InsertHealthMetric,
  type Activity,
  type InsertActivity,
  type Goal,
  type InsertGoal
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Health Metrics
  getHealthMetrics(userId: number, type?: string): Promise<HealthMetric[]>;
  getLatestHealthMetric(userId: number, type: string): Promise<HealthMetric | undefined>;
  createHealthMetric(metric: InsertHealthMetric & { userId: number }): Promise<HealthMetric>;
  
  // Activities
  getActivities(userId: number, limit?: number): Promise<Activity[]>;
  getActivitiesByType(userId: number, type: string): Promise<Activity[]>;
  getTodaySteps(userId: number): Promise<number>;
  getTodayWaterIntake(userId: number): Promise<number>;
  createActivity(activity: InsertActivity & { userId: number }): Promise<Activity>;
  
  // Goals
  getGoals(userId: number): Promise<Goal[]>;
  getGoal(id: number): Promise<Goal | undefined>;
  createGoal(goal: InsertGoal & { userId: number }): Promise<Goal>;
  updateGoal(id: number, updates: Partial<Goal>): Promise<Goal | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private healthMetrics: Map<number, HealthMetric>;
  private activities: Map<number, Activity>;
  private goals: Map<number, Goal>;
  private currentUserId: number;
  private currentHealthMetricId: number;
  private currentActivityId: number;
  private currentGoalId: number;

  constructor() {
    this.users = new Map();
    this.healthMetrics = new Map();
    this.activities = new Map();
    this.goals = new Map();
    this.currentUserId = 1;
    this.currentHealthMetricId = 1;
    this.currentActivityId = 1;
    this.currentGoalId = 1;
    
    // Create a default user for demo purposes
    this.createUser({ username: "demo", password: "demo123" });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Health Metrics
  async getHealthMetrics(userId: number, type?: string): Promise<HealthMetric[]> {
    const userMetrics = Array.from(this.healthMetrics.values())
      .filter(metric => metric.userId === userId);
    
    if (type) {
      return userMetrics.filter(metric => metric.type === type)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    
    return userMetrics.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getLatestHealthMetric(userId: number, type: string): Promise<HealthMetric | undefined> {
    const metrics = await this.getHealthMetrics(userId, type);
    return metrics[0];
  }

  async createHealthMetric(metric: InsertHealthMetric & { userId: number }): Promise<HealthMetric> {
    const id = this.currentHealthMetricId++;
    const newMetric: HealthMetric = {
      ...metric,
      id,
      notes: metric.notes || null,
      createdAt: new Date(),
    };
    this.healthMetrics.set(id, newMetric);
    return newMetric;
  }

  // Activities
  async getActivities(userId: number, limit?: number): Promise<Activity[]> {
    const userActivities = Array.from(this.activities.values())
      .filter(activity => activity.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
    
    return limit ? userActivities.slice(0, limit) : userActivities;
  }

  async getActivitiesByType(userId: number, type: string): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter(activity => activity.userId === userId && activity.type === type)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getTodaySteps(userId: number): Promise<number> {
    const today = new Date().toISOString().split('T')[0];
    const stepsActivity = Array.from(this.activities.values())
      .find(activity => 
        activity.userId === userId && 
        activity.type === 'steps' && 
        activity.date === today
      );
    
    return stepsActivity?.value || 0;
  }

  async getTodayWaterIntake(userId: number): Promise<number> {
    const today = new Date().toISOString().split('T')[0];
    const waterActivities = Array.from(this.activities.values())
      .filter(activity => 
        activity.userId === userId && 
        activity.type === 'water' && 
        activity.date === today
      );
    
    return waterActivities.reduce((total, activity) => total + (activity.value || 0), 0);
  }

  async createActivity(activity: InsertActivity & { userId: number }): Promise<Activity> {
    const id = this.currentActivityId++;
    const newActivity: Activity = {
      ...activity,
      id,
      value: activity.value || null,
      unit: activity.unit || null,
      details: activity.details || null,
      createdAt: new Date(),
    };
    this.activities.set(id, newActivity);
    return newActivity;
  }

  // Goals
  async getGoals(userId: number): Promise<Goal[]> {
    return Array.from(this.goals.values())
      .filter(goal => goal.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getGoal(id: number): Promise<Goal | undefined> {
    return this.goals.get(id);
  }

  async createGoal(goal: InsertGoal & { userId: number }): Promise<Goal> {
    const id = this.currentGoalId++;
    const newGoal: Goal = {
      ...goal,
      id,
      currentValue: 0,
      isCompleted: false,
      targetDate: goal.targetDate || null,
      createdAt: new Date(),
    };
    this.goals.set(id, newGoal);
    return newGoal;
  }

  async updateGoal(id: number, updates: Partial<Goal>): Promise<Goal | undefined> {
    const goal = this.goals.get(id);
    if (!goal) return undefined;

    const updatedGoal = { ...goal, ...updates };
    this.goals.set(id, updatedGoal);
    return updatedGoal;
  }
}

export const storage = new MemStorage();
