import {
  users,
  properties,
  regions,
  divisions,
  inquiries,
  reviews,
  conversations,
  messages,
  type User,
  type UpsertUser,
  type Property,
  type PropertyWithDetails,
  type InsertProperty,
  type UpdateProperty,
  type InsertInquiry,
  type SearchProperties,
  type Region,
  type Division,
  type Inquiry,
  type Review,
  type InsertReview,
  type ReviewWithDetails,
  type Conversation,
  type ConversationWithDetails,
  type InsertConversation,
  type Message,
  type MessageWithSender,
  type InsertMessage,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, ilike, inArray, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User>;
  createUser(user: { id: string; email: string; password: string; firstName: string; lastName: string; }): Promise<User>;

  // Region/Division operations
  getRegions(): Promise<Region[]>;
  getDivisionsByRegion(regionId: number): Promise<Division[]>;

  // Property operations
  getProperties(filters: SearchProperties): Promise<{ properties: PropertyWithDetails[]; total: number }>;
  getProperty(id: number): Promise<PropertyWithDetails | undefined>;
  getPropertiesByLandlord(landlordId: string): Promise<PropertyWithDetails[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, data: UpdateProperty): Promise<Property>;
  deleteProperty(id: number): Promise<void>;

  // Inquiry operations
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  getInquiriesByProperty(propertyId: number): Promise<Inquiry[]>;
  getInquiriesByLandlord(landlordId: string): Promise<Inquiry[]>;

  // Review operations
  createReview(review: InsertReview): Promise<Review>;
  getReviewsByProperty(propertyId: number): Promise<ReviewWithDetails[]>;
  getPropertyRatingStats(propertyId: number): Promise<{ averageRating: number; reviewCount: number }>;
  deleteReview(reviewId: number, userId: string): Promise<void>;

  // Messaging operations
  getOrCreateConversation(propertyId: number, landlordId: string, renterId: string): Promise<Conversation>;
  getConversationsByUser(userId: string): Promise<ConversationWithDetails[]>;
  getConversation(conversationId: number, userId: string): Promise<ConversationWithDetails | undefined>;
  sendMessage(message: InsertMessage): Promise<Message>;
  getMessagesByConversation(conversationId: number): Promise<MessageWithSender[]>;
  markMessagesAsRead(conversationId: number, userId: string): Promise<void>;
  getUnreadMessageCount(userId: string): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: { id: string; email: string; password: string; firstName: string; lastName: string; }): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Region/Division operations
  async getRegions(): Promise<Region[]> {
    return await db.select().from(regions).orderBy(regions.name);
  }

  async getDivisionsByRegion(regionId: number): Promise<Division[]> {
    return await db
      .select()
      .from(divisions)
      .where(eq(divisions.regionId, regionId))
      .orderBy(divisions.name);
  }

  // Property operations
  async getProperties(filters: SearchProperties): Promise<{ properties: PropertyWithDetails[]; total: number }> {
    const conditions = [eq(properties.isActive, true)];

    if (filters.regionId) {
      conditions.push(eq(properties.regionId, filters.regionId));
    }
    if (filters.divisionId) {
      conditions.push(eq(properties.divisionId, filters.divisionId));
    }
    if (filters.propertyType && filters.propertyType !== "all" && filters.propertyType !== "") {
      conditions.push(eq(properties.propertyType, filters.propertyType));
    }
    if (filters.contractType && filters.contractType !== "all" && filters.contractType !== "") {
      conditions.push(eq(properties.contractType, filters.contractType));
    }
    if (filters.rooms && filters.rooms !== 0) {
      conditions.push(eq(properties.rooms, filters.rooms));
    }
    if (filters.minPrice && filters.minPrice > 0) {
      conditions.push(sql`${properties.pricePerMonth}::numeric >= ${filters.minPrice}`);
    }
    if (filters.maxPrice && filters.maxPrice > 0) {
      conditions.push(sql`${properties.pricePerMonth}::numeric <= ${filters.maxPrice}`);
    }

    const offset = (filters.page - 1) * filters.limit;

    const [propertiesResult, [countResult]] = await Promise.all([
      db
        .select({
          property: properties,
          landlord: users,
          region: regions,
          division: divisions,
        })
        .from(properties)
        .innerJoin(users, eq(properties.landlordId, users.id))
        .innerJoin(regions, eq(properties.regionId, regions.id))
        .innerJoin(divisions, eq(properties.divisionId, divisions.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(properties.createdAt))
        .limit(filters.limit)
        .offset(offset),
      
      db
        .select({ count: sql<number>`count(*)` })
        .from(properties)
        .innerJoin(regions, eq(properties.regionId, regions.id))
        .innerJoin(divisions, eq(properties.divisionId, divisions.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined),
    ]);

    const propertyDetails: PropertyWithDetails[] = propertiesResult.map(result => ({
      ...result.property,
      landlord: result.landlord,
      region: result.region,
      division: result.division,
    }));

    return {
      properties: propertyDetails,
      total: countResult.count,
    };
  }

  async getProperty(id: number): Promise<PropertyWithDetails | undefined> {
    const [result] = await db
      .select({
        property: properties,
        landlord: users,
        region: regions,
        division: divisions,
      })
      .from(properties)
      .innerJoin(users, eq(properties.landlordId, users.id))
      .innerJoin(regions, eq(properties.regionId, regions.id))
      .innerJoin(divisions, eq(properties.divisionId, divisions.id))
      .where(eq(properties.id, id));

    if (!result) return undefined;

    return {
      ...result.property,
      landlord: result.landlord,
      region: result.region,
      division: result.division,
    };
  }

  async getPropertiesByLandlord(landlordId: string): Promise<PropertyWithDetails[]> {
    const result = await db
      .select({
        property: properties,
        landlord: users,
        region: regions,
        division: divisions,
      })
      .from(properties)
      .innerJoin(users, eq(properties.landlordId, users.id))
      .innerJoin(regions, eq(properties.regionId, regions.id))
      .innerJoin(divisions, eq(properties.divisionId, divisions.id))
      .where(eq(properties.landlordId, landlordId))
      .orderBy(desc(properties.createdAt));

    return result.map(r => ({
      ...r.property,
      landlord: r.landlord,
      region: r.region,
      division: r.division,
    }));
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const [newProperty] = await db
      .insert(properties)
      .values([property])
      .returning();
    return newProperty;
  }

  async updateProperty(id: number, data: UpdateProperty): Promise<Property> {
    const [property] = await db
      .update(properties)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(properties.id, id))
      .returning();
    return property;
  }

  async deleteProperty(id: number): Promise<void> {
    await db.delete(properties).where(eq(properties.id, id));
  }

  // Inquiry operations
  async createInquiry(inquiry: InsertInquiry): Promise<Inquiry> {
    const [newInquiry] = await db
      .insert(inquiries)
      .values(inquiry)
      .returning();
    return newInquiry;
  }

  async getInquiriesByProperty(propertyId: number): Promise<Inquiry[]> {
    return await db
      .select()
      .from(inquiries)
      .where(eq(inquiries.propertyId, propertyId))
      .orderBy(desc(inquiries.createdAt));
  }

  async getInquiriesByLandlord(landlordId: string): Promise<Inquiry[]> {
    return await db
      .select({
        inquiry: inquiries,
        property: properties,
      })
      .from(inquiries)
      .innerJoin(properties, eq(inquiries.propertyId, properties.id))
      .where(eq(properties.landlordId, landlordId))
      .orderBy(desc(inquiries.createdAt))
      .then(results => results.map(r => r.inquiry));
  }

  // Review operations
  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db
      .insert(reviews)
      .values(review)
      .returning();
    return newReview;
  }

  async getReviewsByProperty(propertyId: number): Promise<ReviewWithDetails[]> {
    const result = await db
      .select({
        review: reviews,
        reviewer: users,
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.reviewerId, users.id))
      .where(eq(reviews.propertyId, propertyId))
      .orderBy(desc(reviews.createdAt));

    return result.map(r => ({
      ...r.review,
      reviewer: r.reviewer || undefined,
    }));
  }

  async getPropertyRatingStats(propertyId: number): Promise<{ averageRating: number; reviewCount: number }> {
    const [result] = await db
      .select({
        averageRating: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`,
        reviewCount: sql<number>`COUNT(${reviews.id})`,
      })
      .from(reviews)
      .where(eq(reviews.propertyId, propertyId));
    
    return {
      averageRating: Math.round(result.averageRating * 10) / 10,
      reviewCount: result.reviewCount,
    };
  }

  async deleteReview(reviewId: number, userId: string): Promise<void> {
    await db
      .delete(reviews)
      .where(and(eq(reviews.id, reviewId), eq(reviews.reviewerId, userId)));
  }

  // Messaging operations
  async getOrCreateConversation(propertyId: number, landlordId: string, renterId: string): Promise<Conversation> {
    // Check if conversation already exists
    const [existingConversation] = await db
      .select()
      .from(conversations)
      .where(
        and(
          eq(conversations.propertyId, propertyId),
          eq(conversations.landlordId, landlordId),
          eq(conversations.renterId, renterId)
        )
      );

    if (existingConversation) {
      return existingConversation;
    }

    // Create new conversation
    const [newConversation] = await db
      .insert(conversations)
      .values({
        propertyId,
        landlordId,
        renterId,
      })
      .returning();

    return newConversation;
  }

  async getConversationsByUser(userId: string): Promise<ConversationWithDetails[]> {
    const userConversations = await db
      .select()
      .from(conversations)
      .leftJoin(properties, eq(conversations.propertyId, properties.id))
      .leftJoin(users, eq(conversations.landlordId, users.id))
      .leftJoin(regions, eq(properties.regionId, regions.id))
      .leftJoin(divisions, eq(properties.divisionId, divisions.id))
      .where(
        and(
          eq(conversations.isActive, true),
          sql`(${conversations.landlordId} = ${userId} OR ${conversations.renterId} = ${userId})`
        )
      )
      .orderBy(desc(conversations.lastMessageAt));

    // Get the other participant for each conversation
    const conversationsWithDetails = await Promise.all(
      userConversations.map(async (conv) => {
        const otherUserId = conv.conversations.landlordId === userId 
          ? conv.conversations.renterId 
          : conv.conversations.landlordId;
        
        const [otherUser] = await db
          .select()
          .from(users)
          .where(eq(users.id, otherUserId));

        // Get unread message count
        const [unreadCount] = await db
          .select({ count: sql<number>`COUNT(*)` })
          .from(messages)
          .where(
            and(
              eq(messages.conversationId, conv.conversations.id),
              eq(messages.isRead, false),
              sql`${messages.senderId} != ${userId}`
            )
          );

        return {
          ...conv.conversations,
          property: conv.properties!,
          landlord: conv.conversations.landlordId === userId ? conv.users! : otherUser,
          renter: conv.conversations.renterId === userId ? conv.users! : otherUser,
          unreadCount: unreadCount.count,
        } as ConversationWithDetails;
      })
    );

    return conversationsWithDetails;
  }

  async getConversation(conversationId: number, userId: string): Promise<ConversationWithDetails | undefined> {
    const [conversationData] = await db
      .select()
      .from(conversations)
      .leftJoin(properties, eq(conversations.propertyId, properties.id))
      .leftJoin(regions, eq(properties.regionId, regions.id))
      .leftJoin(divisions, eq(properties.divisionId, divisions.id))
      .where(
        and(
          eq(conversations.id, conversationId),
          sql`(${conversations.landlordId} = ${userId} OR ${conversations.renterId} = ${userId})`
        )
      );

    if (!conversationData) {
      return undefined;
    }

    // Get landlord and renter details
    const [landlord] = await db
      .select()
      .from(users)
      .where(eq(users.id, conversationData.conversations.landlordId));

    const [renter] = await db
      .select()
      .from(users)
      .where(eq(users.id, conversationData.conversations.renterId));

    // Get messages for this conversation
    const conversationMessages = await this.getMessagesByConversation(conversationId);

    return {
      ...conversationData.conversations,
      property: conversationData.properties!,
      landlord,
      renter,
      messages: conversationMessages,
    } as ConversationWithDetails;
  }

  async sendMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db
      .insert(messages)
      .values(message)
      .returning();

    // Update conversation's last message timestamp
    await db
      .update(conversations)
      .set({ lastMessageAt: new Date() })
      .where(eq(conversations.id, message.conversationId));

    return newMessage;
  }

  async getMessagesByConversation(conversationId: number): Promise<MessageWithSender[]> {
    const conversationMessages = await db
      .select()
      .from(messages)
      .leftJoin(users, eq(messages.senderId, users.id))
      .where(eq(messages.conversationId, conversationId))
      .orderBy(desc(messages.createdAt));

    return conversationMessages.map(msg => ({
      ...msg.messages,
      sender: msg.users!,
    }));
  }

  async markMessagesAsRead(conversationId: number, userId: string): Promise<void> {
    await db
      .update(messages)
      .set({ 
        isRead: true, 
        readAt: new Date() 
      })
      .where(
        and(
          eq(messages.conversationId, conversationId),
          eq(messages.isRead, false),
          sql`${messages.senderId} != ${userId}`
        )
      );
  }

  async getUnreadMessageCount(userId: string): Promise<number> {
    // Get all conversations for the user
    const userConversationIds = await db
      .select({ id: conversations.id })
      .from(conversations)
      .where(
        and(
          eq(conversations.isActive, true),
          sql`(${conversations.landlordId} = ${userId} OR ${conversations.renterId} = ${userId})`
        )
      );

    if (userConversationIds.length === 0) {
      return 0;
    }

    const conversationIds = userConversationIds.map(c => c.id);

    const [result] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(messages)
      .where(
        and(
          inArray(messages.conversationId, conversationIds),
          eq(messages.isRead, false),
          sql`${messages.senderId} != ${userId}`
        )
      );

    return result.count;
  }
}

export const storage = new DatabaseStorage();
