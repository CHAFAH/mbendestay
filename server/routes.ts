import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertPropertySchema,
  updatePropertySchema,
  insertInquirySchema,
  insertReviewSchema,
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
      // Handle region slug to ID conversion
      let regionId = req.query.regionId ? parseInt(req.query.regionId as string) : undefined;
      
      if (req.query.regionSlug && !regionId) {
        const regions = await storage.getRegions();
        const region = regions.find(r => r.slug === req.query.regionSlug);
        regionId = region?.id;
      }

      const filters = searchPropertiesSchema.parse({
        regionId,
        divisionId: req.query.divisionId ? parseInt(req.query.divisionId as string) : undefined,
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

  // Review routes
  app.post('/api/properties/:id/reviews', async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      if (isNaN(propertyId)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }

      const reviewData = insertReviewSchema.parse({
        ...req.body,
        propertyId,
      });

      const review = await storage.createReview(reviewData);
      res.json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid review data", errors: error.errors });
      }
      console.error("Error creating review:", error);
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  app.get('/api/properties/:id/reviews', async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      if (isNaN(propertyId)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }

      const reviews = await storage.getReviewsByProperty(propertyId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.get('/api/properties/:id/rating-stats', async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      if (isNaN(propertyId)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }

      const stats = await storage.getPropertyRatingStats(propertyId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching rating stats:", error);
      res.status(500).json({ message: "Failed to fetch rating stats" });
    }
  });

  app.delete('/api/reviews/:id', isAuthenticated, async (req: any, res) => {
    try {
      const reviewId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      if (isNaN(reviewId)) {
        return res.status(400).json({ message: "Invalid review ID" });
      }

      await storage.deleteReview(reviewId, userId);
      res.json({ message: "Review deleted successfully" });
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ message: "Failed to delete review" });
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

  // Messaging routes
  app.get("/api/conversations", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const conversations = await storage.getConversationsByUser(userId);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  app.get("/api/conversations/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const conversationId = parseInt(req.params.id);
      const conversation = await storage.getConversation(conversationId, userId);
      
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      // Mark messages as read
      await storage.markMessagesAsRead(conversationId, userId);
      
      res.json(conversation);
    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(500).json({ message: "Failed to fetch conversation" });
    }
  });

  app.post("/api/conversations", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { propertyId, message } = req.body;

      // Get property to find landlord
      const property = await storage.getProperty(propertyId);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      const landlordId = property.landlord.id;
      const renterId = userId;

      // Get or create conversation
      const conversation = await storage.getOrCreateConversation(
        propertyId,
        landlordId,
        renterId
      );

      // Send initial message if provided
      if (message) {
        await storage.sendMessage({
          conversationId: conversation.id,
          senderId: userId,
          content: message,
          messageType: "text",
        });
      }

      res.json(conversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({ message: "Failed to create conversation" });
    }
  });

  app.post("/api/conversations/:id/messages", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const conversationId = parseInt(req.params.id);
      const { content, messageType = "text" } = req.body;

      // Verify user has access to this conversation
      const conversation = await storage.getConversation(conversationId, userId);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      const message = await storage.sendMessage({
        conversationId,
        senderId: userId,
        content,
        messageType,
      });

      res.json(message);
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  app.get("/api/messages/unread-count", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const count = await storage.getUnreadMessageCount(userId);
      res.json({ count });
    } catch (error) {
      console.error("Error fetching unread count:", error);
      res.status(500).json({ message: "Failed to fetch unread count" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time messaging
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Store active connections with user IDs
  const activeConnections = new Map<string, WebSocket>();

  wss.on('connection', (ws: WebSocket, req) => {
    let userId: string | null = null;

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'auth' && message.userId) {
          userId = message.userId;
          activeConnections.set(userId, ws);
          ws.send(JSON.stringify({ type: 'auth_success', userId }));
        }
        
        if (message.type === 'send_message' && userId) {
          const { conversationId, content, messageType = 'text' } = message;
          
          // Verify user has access to this conversation
          const conversation = await storage.getConversation(conversationId, userId);
          if (!conversation) {
            ws.send(JSON.stringify({ type: 'error', message: 'Conversation not found' }));
            return;
          }

          // Save message to database
          const newMessage = await storage.sendMessage({
            conversationId,
            senderId: userId,
            content,
            messageType,
          });

          // Get sender details
          const sender = await storage.getUser(userId!);
          const messageWithSender = {
            ...newMessage,
            sender
          };

          // Send to both participants
          const otherUserId = conversation.landlordId === userId 
            ? conversation.renterId 
            : conversation.landlordId;
          
          const messageData = {
            type: 'new_message',
            conversationId,
            message: messageWithSender
          };

          // Send to sender
          if (activeConnections.has(userId)) {
            activeConnections.get(userId)!.send(JSON.stringify(messageData));
          }

          // Send to recipient
          if (activeConnections.has(otherUserId)) {
            activeConnections.get(otherUserId)!.send(JSON.stringify(messageData));
          }
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
      }
    });

    ws.on('close', () => {
      if (userId) {
        activeConnections.delete(userId);
      }
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      if (userId) {
        activeConnections.delete(userId);
      }
    });
  });

  return httpServer;
}
