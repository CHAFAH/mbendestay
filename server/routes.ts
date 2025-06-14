import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertPropertySchema,
  updatePropertySchema,
  insertInquirySchema,
  searchPropertiesSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Region/Division routes
  app.get('/api/regions', async (req, res) => {
    try {
      const regions = await storage.getRegions();
      res.json(regions);
    } catch (error) {
      console.error("Error fetching regions:", error);
      res.status(500).json({ message: "Failed to fetch regions" });
    }
  });

  app.get('/api/regions/:regionId/divisions', async (req, res) => {
    try {
      const regionId = parseInt(req.params.regionId);
      if (isNaN(regionId)) {
        return res.status(400).json({ message: "Invalid region ID" });
      }
      
      const divisions = await storage.getDivisionsByRegion(regionId);
      res.json(divisions);
    } catch (error) {
      console.error("Error fetching divisions:", error);
      res.status(500).json({ message: "Failed to fetch divisions" });
    }
  });

  // Property routes
  app.get('/api/properties', async (req, res) => {
    try {
      const filters = searchPropertiesSchema.parse({
        region: req.query.region,
        division: req.query.division,
        propertyType: req.query.propertyType,
        contractType: req.query.contractType,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
        rooms: req.query.rooms ? parseInt(req.query.rooms as string) : undefined,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 12,
      });

      const result = await storage.getProperties(filters);
      res.json(result);
    } catch (error) {
      console.error("Error fetching properties:", error);
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  app.get('/api/properties/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }

      const property = await storage.getProperty(id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      res.json(property);
    } catch (error) {
      console.error("Error fetching property:", error);
      res.status(500).json({ message: "Failed to fetch property" });
    }
  });

  // Protected landlord routes
  app.get('/api/landlord/properties', isAuthenticated, async (req: any, res) => {
    try {
      const landlordId = req.user.claims.sub;
      const properties = await storage.getPropertiesByLandlord(landlordId);
      res.json(properties);
    } catch (error) {
      console.error("Error fetching landlord properties:", error);
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  app.post('/api/landlord/properties', isAuthenticated, async (req: any, res) => {
    try {
      const landlordId = req.user.claims.sub;
      const user = await storage.getUser(landlordId);
      
      if (!user?.isVerified || user.subscriptionStatus !== 'active') {
        return res.status(403).json({ 
          message: "Active subscription and verification required to create properties" 
        });
      }

      const propertyData = insertPropertySchema.parse({
        ...req.body,
        landlordId,
      });

      const property = await storage.createProperty(propertyData);
      res.json(property);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid property data", errors: error.errors });
      }
      console.error("Error creating property:", error);
      res.status(500).json({ message: "Failed to create property" });
    }
  });

  app.put('/api/landlord/properties/:id', isAuthenticated, async (req: any, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const landlordId = req.user.claims.sub;
      
      if (isNaN(propertyId)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }

      // Verify ownership
      const existingProperty = await storage.getProperty(propertyId);
      if (!existingProperty || existingProperty.landlordId !== landlordId) {
        return res.status(404).json({ message: "Property not found" });
      }

      const updateData = updatePropertySchema.parse(req.body);
      const property = await storage.updateProperty(propertyId, updateData);
      res.json(property);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid property data", errors: error.errors });
      }
      console.error("Error updating property:", error);
      res.status(500).json({ message: "Failed to update property" });
    }
  });

  app.delete('/api/landlord/properties/:id', isAuthenticated, async (req: any, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const landlordId = req.user.claims.sub;
      
      if (isNaN(propertyId)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }

      // Verify ownership
      const existingProperty = await storage.getProperty(propertyId);
      if (!existingProperty || existingProperty.landlordId !== landlordId) {
        return res.status(404).json({ message: "Property not found" });
      }

      await storage.deleteProperty(propertyId);
      res.json({ message: "Property deleted successfully" });
    } catch (error) {
      console.error("Error deleting property:", error);
      res.status(500).json({ message: "Failed to delete property" });
    }
  });

  // Inquiry routes
  app.post('/api/properties/:id/inquiries', async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      if (isNaN(propertyId)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }

      const inquiryData = insertInquirySchema.parse({
        ...req.body,
        propertyId,
      });

      const inquiry = await storage.createInquiry(inquiryData);
      res.json(inquiry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid inquiry data", errors: error.errors });
      }
      console.error("Error creating inquiry:", error);
      res.status(500).json({ message: "Failed to create inquiry" });
    }
  });

  app.get('/api/landlord/inquiries', isAuthenticated, async (req: any, res) => {
    try {
      const landlordId = req.user.claims.sub;
      const inquiries = await storage.getInquiriesByLandlord(landlordId);
      res.json(inquiries);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      res.status(500).json({ message: "Failed to fetch inquiries" });
    }
  });

  // Profile update routes
  app.put('/api/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const updateData = req.body;
      
      const user = await storage.updateUser(userId, updateData);
      res.json(user);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Subscription management
  app.post('/api/subscription', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { subscriptionType } = req.body;
      
      if (!['monthly', 'yearly'].includes(subscriptionType)) {
        return res.status(400).json({ message: "Invalid subscription type" });
      }

      const expiresAt = new Date();
      if (subscriptionType === 'monthly') {
        expiresAt.setMonth(expiresAt.getMonth() + 1);
      } else {
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      }

      const user = await storage.updateUser(userId, {
        subscriptionType,
        subscriptionStatus: 'active',
        subscriptionExpiresAt: expiresAt,
      });

      res.json(user);
    } catch (error) {
      console.error("Error updating subscription:", error);
      res.status(500).json({ message: "Failed to update subscription" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
