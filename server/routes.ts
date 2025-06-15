import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { authenticateToken, hashPassword, comparePassword, generateJWT } from "./auth";
import jwt from "jsonwebtoken";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

      // Check if username already exists
      const existingUsername = await storage.getUserByUsername(validatedData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username is already taken" });
      }

      // Hash password and create user
      const hashedPassword = await hashPassword(validatedData.password);
      const newUser = await storage.createUser({
        id: Date.now().toString(), // Simple ID generation
        email: validatedData.email,
        password: hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        username: validatedData.username,
        userType: validatedData.userType,
        phoneNumber: validatedData.phoneNumber
      });

      res.status(201).json({ 
        message: "User created successfully",
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          username: newUser.username,
          userType: newUser.userType
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
        email: user.email || '',
        subscriptionStatus: isAdmin ? 'admin' : (user.subscriptionStatus || 'none')
      });

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          userType: user.userType,
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
    // First try custom JWT auth
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
        const user = await storage.getUser(decoded.id);
        
        if (user) {
          const isAdmin = user.email === ADMIN_EMAIL;
          return res.json({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            subscriptionStatus: isAdmin ? 'admin' : (user.subscriptionStatus || 'none'),
            isAdmin
          });
        }
      } catch (error) {
        console.error("JWT auth error:", error);
      }
    }

    // Try Replit auth
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

    res.status(401).json({ message: "Unauthorized" });
  });

  // Combined authentication middleware
  const authenticateUser = async (req: any, res: any, next: any) => {
    // Try JWT auth first
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
        const user = await storage.getUser(decoded.id);
        if (user) {
          req.user = { 
            id: user.id, 
            email: user.email, 
            isAdmin: user.email === ADMIN_EMAIL,
            userType: user.userType,
            subscriptionStatus: user.subscriptionStatus
          };
          return next();
        }
      } catch (error) {
        console.error("JWT auth error:", error);
      }
    }

    // Try Replit auth
    if (req.isAuthenticated && req.isAuthenticated()) {
      req.user = {
        id: req.user.claims.sub,
        email: req.user.claims.email,
        isAdmin: req.user.claims.email === ADMIN_EMAIL
      };
      return next();
    }

    res.status(401).json({ message: "Unauthorized" });
  };

  // Subscription creation endpoint (protected by combined auth)
  app.post('/api/subscription/create', authenticateUser, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const userEmail = req.user.email;
      
      // Check if admin - bypass subscription requirement
      if (req.user.isAdmin || userEmail === ADMIN_EMAIL) {
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
        message: 'Subscription created successfully',
        user: updatedUser
      });
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ message: "Failed to create subscription" });
    }
  });

  // Stripe payment intent endpoint
  app.post('/api/create-payment-intent', authenticateUser, async (req: any, res) => {
    try {
      const { amount, subscriptionType, description } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount), // Amount in FCFA cents
        currency: "xaf", // Central African CFA franc
        metadata: {
          userId: req.user.id,
          subscriptionType: subscriptionType || "landlord_monthly",
          description: description || "MbendeStay Landlord Subscription"
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Get regions
  app.get('/api/regions', async (req, res) => {
    try {
      const regions = await storage.getRegions();
      res.json(regions);
    } catch (error) {
      console.error("Error fetching regions:", error);
      res.status(500).json({ message: "Failed to fetch regions" });
    }
  });

  // Get divisions by region
  app.get('/api/regions/:regionId/divisions', async (req, res) => {
    try {
      const regionId = parseInt(req.params.regionId);
      const divisions = await storage.getDivisionsByRegion(regionId);
      res.json(divisions);
    } catch (error) {
      console.error("Error fetching divisions:", error);
      res.status(500).json({ message: "Failed to fetch divisions" });
    }
  });

  // Search properties
  app.get('/api/properties', async (req, res) => {
    try {
      // Handle amenities parameter conversion from string to array
      const query: any = { ...req.query };
      if (query.amenities) {
        if (typeof query.amenities === 'string') {
          try {
            query.amenities = JSON.parse(query.amenities);
          } catch {
            query.amenities = query.amenities.split(',').filter(Boolean);
          }
        } else if (Array.isArray(query.amenities)) {
          // Already an array, keep as is
        } else {
          delete query.amenities; // Remove invalid amenities parameter
        }
      }
      
      const filters = searchPropertiesSchema.parse(query);
      const result = await storage.getProperties(filters);
      res.json(result);
    } catch (error) {
      console.error("Error searching properties:", error);
      res.status(500).json({ message: "Failed to search properties" });
    }
  });

  // Get property by ID
  app.get('/api/properties/:id', async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const property = await storage.getProperty(propertyId);
      
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      res.json(property);
    } catch (error) {
      console.error("Error fetching property:", error);
      res.status(500).json({ message: "Failed to fetch property" });
    }
  });

  // Get properties by landlord
  app.get('/api/landlord/properties', authenticateUser, async (req: any, res) => {
    try {
      const landlordId = req.user.id;
      const properties = await storage.getPropertiesByLandlord(landlordId);
      res.json(properties);
    } catch (error) {
      console.error("Error fetching landlord properties:", error);
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  // Create property
  app.post('/api/properties', authenticateUser, async (req: any, res) => {
    try {
      const landlordId = req.user.id;
      const validatedData = insertPropertySchema.parse(req.body);
      
      const property = await storage.createProperty({
        ...validatedData,
        landlordId,
      });

      res.status(201).json(property);
    } catch (error: any) {
      console.error("Error creating property:", error);
      res.status(400).json({ message: error.message || "Failed to create property" });
    }
  });

  // Update property
  app.patch('/api/properties/:id', isAuthenticated, async (req: any, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const landlordId = req.user.claims.sub;
      
      // Check if property belongs to landlord
      const existingProperty = await storage.getProperty(propertyId);
      if (!existingProperty || existingProperty.landlordId !== landlordId) {
        return res.status(403).json({ message: "Unauthorized to update this property" });
      }

      const validatedData = updatePropertySchema.parse(req.body);
      const updatedProperty = await storage.updateProperty(propertyId, validatedData);
      
      res.json(updatedProperty);
    } catch (error: any) {
      console.error("Error updating property:", error);
      res.status(400).json({ message: error.message || "Failed to update property" });
    }
  });

  // Delete property
  app.delete('/api/properties/:id', isAuthenticated, async (req: any, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const landlordId = req.user.claims.sub;
      
      // Check if property belongs to landlord
      const existingProperty = await storage.getProperty(propertyId);
      if (!existingProperty || existingProperty.landlordId !== landlordId) {
        return res.status(403).json({ message: "Unauthorized to delete this property" });
      }

      await storage.deleteProperty(propertyId);
      res.json({ message: "Property deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting property:", error);
      res.status(400).json({ message: error.message || "Failed to delete property" });
    }
  });

  // Create inquiry
  app.post('/api/inquiries', async (req, res) => {
    try {
      const validatedData = insertInquirySchema.parse(req.body);
      const inquiry = await storage.createInquiry(validatedData);
      res.status(201).json(inquiry);
    } catch (error: any) {
      console.error("Error creating inquiry:", error);
      res.status(400).json({ message: error.message || "Failed to create inquiry" });
    }
  });

  // Get inquiries by property
  app.get('/api/properties/:id/inquiries', isAuthenticated, async (req: any, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const landlordId = req.user.claims.sub;
      
      // Check if property belongs to landlord
      const property = await storage.getProperty(propertyId);
      if (!property || property.landlordId !== landlordId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const inquiries = await storage.getInquiriesByProperty(propertyId);
      res.json(inquiries);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      res.status(500).json({ message: "Failed to fetch inquiries" });
    }
  });

  // Get all inquiries for landlord
  app.get('/api/landlord/inquiries', authenticateUser, async (req: any, res) => {
    try {
      const landlordId = req.user.id;
      const inquiries = await storage.getInquiriesByLandlord(landlordId);
      res.json(inquiries);
    } catch (error) {
      console.error("Error fetching landlord inquiries:", error);
      res.status(500).json({ message: "Failed to fetch inquiries" });
    }
  });

  // Create review
  app.post('/api/reviews', isAuthenticated, async (req: any, res) => {
    try {
      const reviewerId = req.user.claims.sub;
      const reviewerEmail = req.user.claims.email;
      const validatedData = insertReviewSchema.parse(req.body);
      
      const review = await storage.createReview({
        ...validatedData,
        reviewerId,
        reviewerEmail,
      });

      res.status(201).json(review);
    } catch (error: any) {
      console.error("Error creating review:", error);
      res.status(400).json({ message: error.message || "Failed to create review" });
    }
  });

  // Get reviews by property
  app.get('/api/properties/:id/reviews', async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const reviews = await storage.getReviewsByProperty(propertyId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  // Get property rating stats
  app.get('/api/properties/:id/rating-stats', async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const stats = await storage.getPropertyRatingStats(propertyId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching rating stats:", error);
      res.status(500).json({ message: "Failed to fetch rating stats" });
    }
  });

  // Delete review
  app.delete('/api/reviews/:id', isAuthenticated, async (req: any, res) => {
    try {
      const reviewId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      await storage.deleteReview(reviewId, userId);
      res.json({ message: "Review deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting review:", error);
      res.status(400).json({ message: error.message || "Failed to delete review" });
    }
  });

  // Get conversations for user
  app.get('/api/conversations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const conversations = await storage.getConversationsByUser(userId);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  // Get specific conversation
  app.get('/api/conversations/:id', isAuthenticated, async (req: any, res) => {
    try {
      const conversationId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      const conversation = await storage.getConversation(conversationId, userId);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      res.json(conversation);
    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(500).json({ message: "Failed to fetch conversation" });
    }
  });

  // Send message
  app.post('/api/conversations/:id/messages', isAuthenticated, async (req: any, res) => {
    try {
      const conversationId = parseInt(req.params.id);
      const senderId = req.user.claims.sub;
      const { content } = req.body;

      if (!content || content.trim() === '') {
        return res.status(400).json({ message: "Message content is required" });
      }

      const message = await storage.sendMessage({
        conversationId,
        senderId,
        content: content.trim(),
      });

      res.status(201).json(message);
    } catch (error: any) {
      console.error("Error sending message:", error);
      res.status(400).json({ message: error.message || "Failed to send message" });
    }
  });

  // Mark messages as read
  app.patch('/api/conversations/:id/read', isAuthenticated, async (req: any, res) => {
    try {
      const conversationId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      await storage.markMessagesAsRead(conversationId, userId);
      res.json({ message: "Messages marked as read" });
    } catch (error: any) {
      console.error("Error marking messages as read:", error);
      res.status(400).json({ message: error.message || "Failed to mark messages as read" });
    }
  });

  // Get unread message count
  app.get('/api/messages/unread-count', isAuthenticated, async (req: any, res) => {
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

  // WebSocket setup for real-time messaging
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket, req) => {
    console.log('WebSocket client connected');

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'join') {
          // Join a conversation room
          (ws as any).conversationId = message.conversationId;
          (ws as any).userId = message.userId;
        }
        
        if (message.type === 'message') {
          // Broadcast message to other clients in the same conversation
          wss.clients.forEach((client) => {
            if (client !== ws && 
                client.readyState === WebSocket.OPEN &&
                (client as any).conversationId === message.conversationId) {
              client.send(JSON.stringify({
                type: 'message',
                data: message.data
              }));
            }
          });
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

  return httpServer;
}