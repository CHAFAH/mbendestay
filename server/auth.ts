import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import type { Request, Response, NextFunction } from "express";
import { storage } from "./storage";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    subscriptionStatus: string;
  };
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateJWT(user: { id: string; email: string; subscriptionStatus: string }): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyJWT(token: string): { id: string; email: string; subscriptionStatus: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string; subscriptionStatus: string };
  } catch {
    return null;
  }
}

export function generateResetToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  const decoded = verifyJWT(token);
  if (!decoded) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  const user = await storage.getUser(decoded.id);
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  req.user = {
    id: user.id,
    email: user.email!,
    subscriptionStatus: user.subscriptionStatus || "inactive",
  };

  next();
}

export async function requireSubscription(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (req.user.subscriptionStatus !== "active") {
    return res.status(403).json({ 
      message: "Active subscription required",
      subscriptionRequired: true 
    });
  }

  next();
}