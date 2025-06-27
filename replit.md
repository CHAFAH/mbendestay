# MbendeStay - Cameroon Rental Platform

## Overview

MbendeStay is a comprehensive Airbnb-style rental platform specifically designed for Cameroon, connecting travelers with authentic accommodations across all 10 regions and 65 divisions of the country. The platform operates on a subscription-based model with separate interfaces for renters and landlords.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite with development optimizations for Replit
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state, React hooks for local state
- **Styling**: Tailwind CSS with custom design system based on Cameroon themes
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Real-time**: WebSocket support for messaging
- **File Structure**: Modular route handlers with separate business logic

### Database Strategy
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Migrations**: Drizzle Kit for schema management
- **Connection**: Connection pooling with @neondatabase/serverless

## Key Components

### Authentication System
- **Dual Authentication**: Supports both Replit OAuth and JWT-based local authentication
- **Session Management**: Express sessions with PostgreSQL store for Replit auth
- **Token-based Auth**: JWT tokens for local authentication with bcrypt password hashing
- **User Types**: Renter and Landlord account types with different permissions

### Subscription System
- **Payment Processing**: Stripe integration for subscription management
- **Subscription Tiers**: 
  - Renter Monthly: 10,000 FCFA/month
  - Landlord Monthly: 10,000 FCFA/month
  - Landlord Yearly: 80,000 FCFA/year
- **Access Control**: Subscription-based access to property details and contact information
- **Admin Override**: Special admin account (sani.ray.red@gmail.com) bypasses subscription requirements

### Property Management
- **Comprehensive Listings**: 20+ property types from apartments to beach houses
- **Rich Media**: Image gallery support with future video capabilities
- **Geographic Organization**: Properties organized by Cameroon's 10 regions and 65 divisions
- **Advanced Search**: Multi-criteria filtering including location, type, price, and amenities

### Communication System
- **Real-time Messaging**: WebSocket-based chat between renters and landlords
- **Conversation Management**: Threaded conversations linked to specific properties
- **Inquiry System**: Structured inquiry forms for property interest

### Review System
- **Property Reviews**: Star ratings with detailed comments
- **Verification**: Reviewer verification system
- **Helpful Voting**: Community-driven review quality assessment

## Data Flow

### User Registration and Authentication
1. User chooses account type (renter/landlord) and subscription plan
2. Account creation with email verification
3. Payment processing through Stripe
4. Subscription activation and access provisioning

### Property Discovery
1. Users browse properties by region/division or search criteria
2. Subscription status determines access level to property details
3. Authenticated users can save favorites and contact landlords

### Booking and Communication
1. Renters express interest through inquiry forms
2. System creates conversation threads between parties
3. Real-time messaging facilitates booking arrangements
4. Post-stay review system captures feedback

## External Dependencies

### Payment Integration
- **Stripe**: Complete payment processing including subscriptions, one-time payments, and webhook handling
- **Currency**: Central African Franc (FCFA) with proper localization

### Development Tools
- **Replit Integration**: Special development plugins and error handling for Replit environment
- **TypeScript**: Full type safety across frontend, backend, and shared schemas

### UI and Styling
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling with custom Cameroon-themed color palette
- **Lucide React**: Consistent icon system

## Deployment Strategy

### Development Environment
- **Hot Reload**: Vite development server with fast HMR
- **Error Handling**: Runtime error overlays for development
- **Environment Variables**: Separate configuration for development and production

### Production Build
- **Frontend**: Vite production build with optimized assets
- **Backend**: esbuild compilation to ESM format
- **Static Assets**: Served from dist/public directory

### Database Management
- **Schema Evolution**: Drizzle migrations for safe schema updates
- **Connection Handling**: Serverless-optimized database connections
- **Environment**: Neon PostgreSQL with connection pooling

## Changelog

- June 27, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.