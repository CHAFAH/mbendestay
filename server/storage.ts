import {
  users,
  properties,
  regions,
  divisions,
  inquiries,
  reviews,
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
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, ilike, inArray, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User>;

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
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
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

    if (filters.region && filters.region !== "all" && filters.region !== "") {
      conditions.push(eq(properties.regionId, parseInt(filters.region)));
    }
    if (filters.division && filters.division !== "all" && filters.division !== "") {
      // Handle both division ID (number) and slug (string)
      if (!isNaN(Number(filters.division))) {
        conditions.push(eq(properties.divisionId, parseInt(filters.division)));
      } else {
        conditions.push(eq(divisions.slug, filters.division));
      }
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
      .values(property)
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
}

export const storage = new DatabaseStorage();
