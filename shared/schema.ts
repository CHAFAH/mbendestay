import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  password: varchar("password"), // For local authentication
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  username: varchar("username").unique(),
  profileImageUrl: varchar("profile_image_url"),
  userType: varchar("user_type").notNull().default("renter"), // "renter" | "landlord"
  phoneNumber: varchar("phone_number"),
  nationalIdFront: varchar("national_id_front"),
  nationalIdBack: varchar("national_id_back"),
  isVerified: boolean("is_verified").default(false),
  subscriptionType: varchar("subscription_type"), // "monthly" | "yearly"
  subscriptionStatus: varchar("subscription_status").default("inactive"), // "active" | "inactive" | "expired"
  subscriptionExpiresAt: timestamp("subscription_expires_at"),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  resetToken: varchar("reset_token"),
  resetTokenExpiresAt: timestamp("reset_token_expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const regions = pgTable("regions", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  slug: varchar("slug").notNull().unique(),
});

export const divisions = pgTable("divisions", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  slug: varchar("slug").notNull(),
  regionId: integer("region_id").notNull().references(() => regions.id),
});

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  propertyType: varchar("property_type").notNull(), // "apartment" | "guestHouse" | "room" | "studio" | "officeSpace" | "commercial"
  contractType: varchar("contract_type").notNull(), // "short_stay" | "long_stay" | "daily" | "monthly"
  regionId: integer("region_id").notNull().references(() => regions.id),
  divisionId: integer("division_id").notNull().references(() => divisions.id),
  address: text("address"),
  pricePerNight: decimal("price_per_night", { precision: 10, scale: 2 }),
  pricePerMonth: decimal("price_per_month", { precision: 10, scale: 2 }),
  rooms: integer("rooms"),
  size: integer("size"), // in square meters
  maxTenants: integer("max_tenants"),
  amenities: jsonb("amenities").$type<string[]>(),
  images: jsonb("images").$type<string[]>(),
  videoUrl: varchar("video_url"),
  isActive: boolean("is_active").default(true),
  landlordId: varchar("landlord_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull().references(() => properties.id),
  guestName: varchar("guest_name").notNull(),
  guestEmail: varchar("guest_email").notNull(),
  guestPhone: varchar("guest_phone"),
  message: text("message").notNull(),
  checkInDate: timestamp("check_in_date"),
  checkOutDate: timestamp("check_out_date"),
  guests: integer("guests").default(1),
  status: varchar("status").default("pending"), // "pending" | "responded" | "closed"
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull().references(() => properties.id),
  reviewerId: varchar("reviewer_id").references(() => users.id),
  rating: integer("rating").notNull(), // 1-5 stars
  title: varchar("title", { length: 200 }).notNull(),
  comment: text("comment").notNull(),
  stayDuration: varchar("stay_duration", { length: 50 }), // e.g., "3 months", "1 week"
  reviewerName: varchar("reviewer_name", { length: 100 }).notNull(),
  reviewerEmail: varchar("reviewer_email", { length: 100 }).notNull(),
  isVerified: boolean("is_verified").default(false).notNull(),
  isHelpful: integer("helpful_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Conversations table for messaging between landlords and renters
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").references(() => properties.id).notNull(),
  landlordId: varchar("landlord_id").references(() => users.id).notNull(),
  renterId: varchar("renter_id").references(() => users.id).notNull(),
  lastMessageAt: timestamp("last_message_at").defaultNow(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Messages table for storing individual messages
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").references(() => conversations.id).notNull(),
  senderId: varchar("sender_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  messageType: varchar("message_type", { length: 20 }).default("text").notNull(), // text, image, system
  isRead: boolean("is_read").default(false).notNull(),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  properties: many(properties),
  reviews: many(reviews),
  landlordConversations: many(conversations, { relationName: "landlordConversations" }),
  renterConversations: many(conversations, { relationName: "renterConversations" }),
  sentMessages: many(messages),
}));

export const regionsRelations = relations(regions, ({ many }) => ({
  divisions: many(divisions),
  properties: many(properties),
}));

export const divisionsRelations = relations(divisions, ({ one, many }) => ({
  region: one(regions, {
    fields: [divisions.regionId],
    references: [regions.id],
  }),
  properties: many(properties),
}));

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  landlord: one(users, {
    fields: [properties.landlordId],
    references: [users.id],
  }),
  region: one(regions, {
    fields: [properties.regionId],
    references: [regions.id],
  }),
  division: one(divisions, {
    fields: [properties.divisionId],
    references: [divisions.id],
  }),
  inquiries: many(inquiries),
  reviews: many(reviews),
  conversations: many(conversations),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  property: one(properties, {
    fields: [conversations.propertyId],
    references: [properties.id],
  }),
  landlord: one(users, {
    fields: [conversations.landlordId],
    references: [users.id],
    relationName: "landlordConversations",
  }),
  renter: one(users, {
    fields: [conversations.renterId],
    references: [users.id],
    relationName: "renterConversations",
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
}));

export const inquiriesRelations = relations(inquiries, ({ one }) => ({
  property: one(properties, {
    fields: [inquiries.propertyId],
    references: [properties.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  property: one(properties, {
    fields: [reviews.propertyId],
    references: [properties.id],
  }),
  reviewer: one(users, {
    fields: [reviews.reviewerId],
    references: [users.id],
  }),
}));

// Zod schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
  resetToken: true,
  resetTokenExpiresAt: true,
});

export const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z.string().min(3, "Username must be at least 3 characters").regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  userType: z.enum(["renter", "landlord"], { required_error: "Please select account type" }),
  subscriptionType: z.enum(["renter_monthly", "landlord_monthly", "landlord_yearly"]).optional(),
  phoneNumber: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const subscriptionSchema = z.object({
  type: z.enum(["monthly", "yearly"]),
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  propertyType: z.enum(["apartment", "guestHouse", "room", "studio", "officeSpace", "commercial"]),
});

export const insertInquirySchema = createInsertSchema(inquiries).omit({
  id: true,
  createdAt: true,
  status: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isVerified: true,
  isHelpful: true,
}).extend({
  rating: z.number().min(1).max(5),
});

export const updateUserSchema = insertUserSchema.partial();
export const updatePropertySchema = insertPropertySchema.partial();

export const searchPropertiesSchema = z.object({
  regionId: z.coerce.number().optional(),
  divisionId: z.coerce.number().optional(),
  propertyType: z.string().optional(),
  contractType: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  rooms: z.coerce.number().optional(),
  amenities: z.array(z.string()).optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(12),
});

// Types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Property = typeof properties.$inferSelect;
export type PropertyWithDetails = Property & {
  landlord: User;
  region: typeof regions.$inferSelect;
  division: typeof divisions.$inferSelect;
  reviews?: ReviewWithDetails[];
  averageRating?: number;
  reviewCount?: number;
};
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type UpdateProperty = z.infer<typeof updatePropertySchema>;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type SearchProperties = z.infer<typeof searchPropertiesSchema>;
export type Region = typeof regions.$inferSelect;
export type Division = typeof divisions.$inferSelect;
export type Inquiry = typeof inquiries.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type ReviewWithDetails = Review & {
  reviewer?: User;
};

// Messaging types
export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = typeof conversations.$inferInsert;
export type ConversationWithDetails = Conversation & {
  property: Property;
  landlord: User;
  renter: User;
  messages?: MessageWithSender[];
  unreadCount?: number;
};

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;
export type MessageWithSender = Message & {
  sender: User;
};
