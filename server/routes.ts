import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { authenticateToken, hashPassword, comparePassword, generateJWT } from "./auth";
// Admin account that bypasses subscription requirements
const ADMIN_EMAIL = "sani.ray.red@gmail.com";
import { 
  insertPropertySchema,
  updatePropertySchema,
  insertInquirySchema,
  insertReviewSchema,
  searchPropertiesSchema,
  subscriptionSchema,
  signupSchema,
  loginSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Custom authentication routes
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const validatedData = signupSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      // Hash password and create user
      const hashedPassword = await hashPassword(validatedData.password);
      const newUser = await storage.createUser({
        id: Date.now().toString(), // Simple ID generation
        email: validatedData.email,
        password: hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName
      });

      res.status(201).json({ 
        message: "User created successfully",
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName
        }
      });
    } catch (error: any) {
      console.error("Signup error:", error);
      res.status(400).json({ message: error.message || "Failed to create user" });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      // Find user by email
      const user = await storage.getUserByEmail(validatedData.email);
      if (!user || !user.password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Verify password
      const isValidPassword = await comparePassword(validatedData.password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Check if this is the admin account
      const isAdmin = user.email === ADMIN_EMAIL;

      // Generate JWT token
      const token = generateJWT({
        id: user.id,
        email: user.email,
        subscriptionStatus: isAdmin ? 'admin' : (user.subscriptionStatus || 'none')
      });

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          subscriptionStatus: isAdmin ? 'admin' : (user.subscriptionStatus || 'none'),
          isAdmin
        }
      });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(400).json({ message: error.message || "Failed to login" });
    }
  });

  // Combined auth endpoint that works with both Replit OAuth and custom auth
  app.get('/api/auth/user', async (req: any, res) => {
    // First try Replit auth
    if (req.isAuthenticated && req.isAuthenticated()) {
      try {
        const userId = req.user.claims.sub;
        const userEmail = req.user.claims.email;
        const user = await storage.getUser(userId);
        
        // Check if this is the admin account
        const isAdmin = userEmail === ADMIN_EMAIL;
        
        // Return user data with admin status
        return res.json({
          id: user?.id || userId,
          email: userEmail,
          firstName: user?.firstName || req.user.claims.first_name,
          lastName: user?.lastName || req.user.claims.last_name,
          profileImageUrl: req.user.claims.profile_image_url,
          subscriptionStatus: isAdmin ? 'admin' : (user?.subscriptionStatus || 'none'),
          isAdmin
        });
      } catch (error) {
        console.error("Error fetching Replit user:", error);
        return res.status(500).json({ message: "Failed to fetch user" });
      }
    }

    // Try custom JWT auth
    try {
      await authenticateToken(req as any, res, () => {
        const user = (req as any).user;
        res.json({
          id: user.id,
          email: user.email,
          subscriptionStatus: user.subscriptionStatus,
          isAdmin: user.email === ADMIN_EMAIL
        });
      });
    } catch (error) {
      res.status(401).json({ message: "Unauthorized" });
    }
  });

  // Subscription creation endpoint (protected by Replit auth)
  app.post('/api/subscription/create', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userEmail = req.user.claims.email;
      
      // Check if admin - bypass subscription requirement
      if (userEmail === ADMIN_EMAIL) {
        return res.json({
          message: 'Admin account - subscription not required',
          user: {
            id: userId,
            email: userEmail,
            subscriptionStatus: 'admin',
            isAdmin: true
          }
        });
      }

      const validatedData = subscriptionSchema.parse(req.body);

      // Calculate subscription end date
      const now = new Date();
      const subscriptionEndDate = new Date(now);
      
      if (validatedData.type === 'monthly') {
        subscriptionEndDate.setMonth(now.getMonth() + 1);
      } else if (validatedData.type === 'yearly') {
        subscriptionEndDate.setFullYear(now.getFullYear() + 1);
      }

      // Update or create user with subscription
      const updatedUser = await storage.upsertUser({
        id: userId,
        email: userEmail,
        firstName: req.user.claims.first_name,
        lastName: req.user.claims.last_name,
        profileImageUrl: req.user.claims.profile_image_url,
        subscriptionStatus: 'active',
        subscriptionType: validatedData.type,
        subscriptionExpiresAt: subscriptionEndDate,
      });

      res.json({
        message: 'Subscription activated successfully',
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          subscriptionStatus: updatedUser.subscriptionStatus,
          subscriptionType: updatedUser.subscriptionType,
          subscriptionEndDate: updatedUser.subscriptionExpiresAt,
          isAdmin: false
        }
      });
    } catch (error: any) {
      console.error('Subscription error:', error);
      res.status(400).json({ message: error.message || 'Failed to create subscription' });
    }
  });

  // Protected route helper function
  const requireSubscriptionOrAdmin = async (req: any, res: any, next: any) => {
    const userEmail = req.user?.claims?.email;
    const userId = req.user?.claims?.sub;
    
    // Admin bypass
    if (userEmail === ADMIN_EMAIL) {
      return next();
    }
    
    // Check subscription for non-admin users
    const user = await storage.getUser(userId);
    if (!user || user.subscriptionStatus !== 'active') {
      return res.status(403).json({ 
        message: 'Active subscription required to access this content',
        requiresSubscription: true 
      });
    }
    
    next();
  };

  // Property routes
  app.get('/api/properties', async (req, res) => {
    try {
      const filters = searchPropertiesSchema.parse(req.query);
      const result = await storage.getProperties(filters);
      res.json(result);
    } catch (error) {
      console.error('Error fetching properties:', error);
      res.status(500).json({ message: 'Failed to fetch properties' });
    }
  });

  // Property detail route - requires subscription for full details
  app.get('/api/properties/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const property = await storage.getProperty(id);
      
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }

      // Check if user is authenticated and has subscription/admin access
      let hasFullAccess = false;
      if (req.user) {
        const userEmail = (req.user as any).claims?.email;
        const userId = (req.user as any).claims?.sub;
        
        if (userEmail === ADMIN_EMAIL) {
          hasFullAccess = true;
        } else {
          const user = await storage.getUser(userId);
          hasFullAccess = user?.subscriptionStatus === 'active';
        }
      }

      // Return limited data for non-subscribers
      if (!hasFullAccess) {
        const limitedProperty = {
          ...property,
          address: 'Subscription required to view exact location',
          landlord: {
            ...property.landlord,
            email: 'Subscribe to contact landlord',
            phone: 'Subscribe to view phone number'
          }
        };
        return res.json({ ...limitedProperty, requiresSubscription: true });
      }

      res.json(property);
    } catch (error) {
      console.error('Error fetching property:', error);
      res.status(500).json({ message: 'Failed to fetch property' });
    }
  });

  // Landlord dashboard routes (require authentication)
  app.get('/api/landlord/properties', isAuthenticated, async (req: any, res) => {
    try {
      const landlordId = req.user.claims.sub;
      const properties = await storage.getPropertiesByLandlord(landlordId);
      res.json(properties);
    } catch (error) {
      console.error('Error fetching landlord properties:', error);
      res.status(500).json({ message: 'Failed to fetch properties' });
    }
  });

  app.post('/api/properties', isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertPropertySchema.parse(req.body);
      const landlordId = req.user.claims.sub;
      
      const property = await storage.createProperty({
        ...validatedData,
        landlordId,
      });
      
      res.status(201).json(property);
    } catch (error: any) {
      console.error('Error creating property:', error);
      res.status(400).json({ message: error.message || 'Failed to create property' });
    }
  });

  app.put('/api/properties/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const landlordId = req.user.claims.sub;
      const validatedData = updatePropertySchema.parse(req.body);
      
      // Verify ownership
      const existingProperty = await storage.getProperty(id);
      if (!existingProperty || existingProperty.landlordId !== landlordId) {
        return res.status(403).json({ message: 'Not authorized to update this property' });
      }
      
      const property = await storage.updateProperty(id, validatedData);
      res.json(property);
    } catch (error: any) {
      console.error('Error updating property:', error);
      res.status(400).json({ message: error.message || 'Failed to update property' });
    }
  });

  app.delete('/api/properties/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const landlordId = req.user.claims.sub;
      
      // Verify ownership
      const existingProperty = await storage.getProperty(id);
      if (!existingProperty || existingProperty.landlordId !== landlordId) {
        return res.status(403).json({ message: 'Not authorized to delete this property' });
      }
      
      await storage.deleteProperty(id);
      res.json({ message: 'Property deleted successfully' });
    } catch (error) {
      console.error('Error deleting property:', error);
      res.status(500).json({ message: 'Failed to delete property' });
    }
  });

  // Regions and divisions
  app.get('/api/regions', async (req, res) => {
    try {
      const regions = await storage.getRegions();
      res.json(regions);
    } catch (error) {
      console.error('Error fetching regions:', error);
      res.status(500).json({ message: 'Failed to fetch regions' });
    }
  });

  app.get('/api/regions/:regionId/divisions', async (req, res) => {
    try {
      const regionId = parseInt(req.params.regionId);
      const divisions = await storage.getDivisionsByRegion(regionId);
      res.json(divisions);
    } catch (error) {
      console.error('Error fetching divisions:', error);
      res.status(500).json({ message: 'Failed to fetch divisions' });
    }
  });

  // Inquiry routes (require subscription for landlord contact)
  app.post('/api/inquiries', isAuthenticated, requireSubscriptionOrAdmin, async (req: any, res) => {
    try {
      const validatedData = insertInquirySchema.parse(req.body);
      const renterId = req.user.claims.sub;
      
      const inquiry = await storage.createInquiry({
        ...validatedData,
        renterId,
      });
      
      res.status(201).json(inquiry);
    } catch (error: any) {
      console.error('Error creating inquiry:', error);
      res.status(400).json({ message: error.message || 'Failed to create inquiry' });
    }
  });

  app.get('/api/landlord/inquiries', isAuthenticated, async (req: any, res) => {
    try {
      const landlordId = req.user.claims.sub;
      const inquiries = await storage.getInquiriesByLandlord(landlordId);
      res.json(inquiries);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      res.status(500).json({ message: 'Failed to fetch inquiries' });
    }
  });

  // Review routes
  app.post('/api/reviews', isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertReviewSchema.parse(req.body);
      const reviewerId = req.user.claims.sub;
      
      const review = await storage.createReview({
        ...validatedData,
        reviewerId,
      });
      
      res.status(201).json(review);
    } catch (error: any) {
      console.error('Error creating review:', error);
      res.status(400).json({ message: error.message || 'Failed to create review' });
    }
  });

  app.get('/api/properties/:propertyId/reviews', async (req, res) => {
    try {
      const propertyId = parseInt(req.params.propertyId);
      const reviews = await storage.getReviewsByProperty(propertyId);
      res.json(reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ message: 'Failed to fetch reviews' });
    }
  });

  app.get('/api/properties/:propertyId/rating-stats', async (req, res) => {
    try {
      const propertyId = parseInt(req.params.propertyId);
      const stats = await storage.getPropertyRatingStats(propertyId);
      res.json(stats);
    } catch (error) {
      console.error('Error fetching rating stats:', error);
      res.status(500).json({ message: 'Failed to fetch rating stats' });
    }
  });

  app.delete('/api/reviews/:reviewId', isAuthenticated, async (req: any, res) => {
    try {
      const reviewId = parseInt(req.params.reviewId);
      const userId = req.user.claims.sub;
      
      await storage.deleteReview(reviewId, userId);
      res.json({ message: 'Review deleted successfully' });
    } catch (error) {
      console.error('Error deleting review:', error);
      res.status(500).json({ message: 'Failed to delete review' });
    }
  });

  // Messaging routes (require subscription)
  app.post('/api/conversations', isAuthenticated, requireSubscriptionOrAdmin, async (req: any, res) => {
    try {
      const { propertyId, landlordId } = req.body;
      const renterId = req.user.claims.sub;
      
      const conversation = await storage.getOrCreateConversation(propertyId, landlordId, renterId);
      res.json(conversation);
    } catch (error) {
      console.error('Error creating conversation:', error);
      res.status(500).json({ message: 'Failed to create conversation' });
    }
  });

  app.get('/api/conversations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const conversations = await storage.getConversationsByUser(userId);
      res.json(conversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      res.status(500).json({ message: 'Failed to fetch conversations' });
    }
  });

  app.get('/api/conversations/:conversationId', isAuthenticated, async (req: any, res) => {
    try {
      const conversationId = parseInt(req.params.conversationId);
      const userId = req.user.claims.sub;
      
      const conversation = await storage.getConversation(conversationId, userId);
      if (!conversation) {
        return res.status(404).json({ message: 'Conversation not found' });
      }
      
      res.json(conversation);
    } catch (error) {
      console.error('Error fetching conversation:', error);
      res.status(500).json({ message: 'Failed to fetch conversation' });
    }
  });

  app.post('/api/conversations/:conversationId/messages', isAuthenticated, async (req: any, res) => {
    try {
      const conversationId = parseInt(req.params.conversationId);
      const senderId = req.user.claims.sub;
      const { content } = req.body;
      
      const message = await storage.sendMessage({
        conversationId,
        senderId,
        content,
      });
      
      res.status(201).json(message);
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ message: 'Failed to send message' });
    }
  });

  app.get('/api/conversations/:conversationId/messages', isAuthenticated, async (req: any, res) => {
    try {
      const conversationId = parseInt(req.params.conversationId);
      const messages = await storage.getMessagesByConversation(conversationId);
      res.json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ message: 'Failed to fetch messages' });
    }
  });

  app.patch('/api/conversations/:conversationId/read', isAuthenticated, async (req: any, res) => {
    try {
      const conversationId = parseInt(req.params.conversationId);
      const userId = req.user.claims.sub;
      
      await storage.markMessagesAsRead(conversationId, userId);
      res.json({ message: 'Messages marked as read' });
    } catch (error) {
      console.error('Error marking messages as read:', error);
      res.status(500).json({ message: 'Failed to mark messages as read' });
    }
  });

  app.get('/api/unread-count', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const count = await storage.getUnreadMessageCount(userId);
      res.json({ count });
    } catch (error) {
      console.error('Error fetching unread count:', error);
      res.status(500).json({ message: 'Failed to fetch unread count' });
    }
  });

  const httpServer = createServer(app);

  // WebSocket setup for real-time messaging
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket, req) => {
    console.log('WebSocket connection established');

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        // Broadcast message to all connected clients
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
          }
        });
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  return httpServer;
}