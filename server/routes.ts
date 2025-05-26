import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertHealthMetricSchema, insertActivitySchema, insertGoalSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health Metrics routes
  app.get("/api/health-metrics", async (req, res) => {
    try {
      const userId = 1; // Using demo user for now
      const type = req.query.type as string | undefined;
      const metrics = await storage.getHealthMetrics(userId, type);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch health metrics" });
    }
  });

  app.get("/api/health-metrics/latest/:type", async (req, res) => {
    try {
      const userId = 1; // Using demo user for now
      const type = req.params.type;
      const metric = await storage.getLatestHealthMetric(userId, type);
      res.json(metric || null);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch latest metric" });
    }
  });

  app.post("/api/health-metrics", async (req, res) => {
    try {
      const userId = 1; // Using demo user for now
      const validatedData = insertHealthMetricSchema.parse(req.body);
      const metric = await storage.createHealthMetric({
        ...validatedData,
        userId,
      });
      res.status(201).json(metric);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create health metric" });
      }
    }
  });

  // Activities routes
  app.get("/api/activities", async (req, res) => {
    try {
      const userId = 1; // Using demo user for now
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const activities = await storage.getActivities(userId, limit);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  });

  app.get("/api/activities/type/:type", async (req, res) => {
    try {
      const userId = 1; // Using demo user for now
      const type = req.params.type;
      const activities = await storage.getActivitiesByType(userId, type);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch activities by type" });
    }
  });

  app.get("/api/activities/today/steps", async (req, res) => {
    try {
      const userId = 1; // Using demo user for now
      const steps = await storage.getTodaySteps(userId);
      res.json({ steps });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch today's steps" });
    }
  });

  app.get("/api/activities/today/water", async (req, res) => {
    try {
      const userId = 1; // Using demo user for now
      const water = await storage.getTodayWaterIntake(userId);
      res.json({ water });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch today's water intake" });
    }
  });

  app.post("/api/activities", async (req, res) => {
    try {
      const userId = 1; // Using demo user for now
      const validatedData = insertActivitySchema.parse(req.body);
      const activity = await storage.createActivity({
        ...validatedData,
        userId,
      });
      res.status(201).json(activity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create activity" });
      }
    }
  });

  // Goals routes
  app.get("/api/goals", async (req, res) => {
    try {
      const userId = 1; // Using demo user for now
      const goals = await storage.getGoals(userId);
      res.json(goals);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch goals" });
    }
  });

  app.post("/api/goals", async (req, res) => {
    try {
      const userId = 1; // Using demo user for now
      const validatedData = insertGoalSchema.parse(req.body);
      const goal = await storage.createGoal({
        ...validatedData,
        userId,
      });
      res.status(201).json(goal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create goal" });
      }
    }
  });

  app.patch("/api/goals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const goal = await storage.updateGoal(id, updates);
      
      if (!goal) {
        return res.status(404).json({ error: "Goal not found" });
      }
      
      res.json(goal);
    } catch (error) {
      res.status(500).json({ error: "Failed to update goal" });
    }
  });

  // Dashboard summary route
  app.get("/api/dashboard/summary", async (req, res) => {
    try {
      const userId = 1; // Using demo user for now
      
      // Get latest metrics
      const latestWeight = await storage.getLatestHealthMetric(userId, "weight");
      const latestHeartRate = await storage.getLatestHealthMetric(userId, "heart_rate");
      
      // Get today's activities
      const todaySteps = await storage.getTodaySteps(userId);
      const todayWater = await storage.getTodayWaterIntake(userId);
      
      // Get recent activities
      const recentActivities = await storage.getActivities(userId, 4);
      
      // Get active goals
      const goals = await storage.getGoals(userId);
      
      res.json({
        metrics: {
          weight: latestWeight,
          heartRate: latestHeartRate,
          steps: todaySteps,
          water: todayWater,
        },
        recentActivities,
        goals,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard summary" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
