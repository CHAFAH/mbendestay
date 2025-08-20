# MbendeStay: Modern Real Estate Platform

![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0.0-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20.0+-339933?logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.0-06B6D4?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

**MbendeStay** is a full-stack, Airbnb-inspired rental platform designed specifically for the Cameroonian market. It connects landlords with potential tenants through a modern, intuitive interface featuring advanced search, robust filtering, and a seamless user experience. 

<img width="1667" height="824" alt="image" src="https://github.com/user-attachments/assets/265b405c-45dd-4023-a515-da67b4029451" />


##  Features

### For Tenants & Guests
- **Advanced Property Search**: Filter listings by city, price range, number of bedrooms/bathrooms, and property type.
- **Interactive Map View**: Visualize property locations for easier decision-making.
- **Favorites System**: Save interesting properties for later review.
- **Responsive Design**: Seamless experience on desktop, tablet, and mobile devices.

### For Landlords
- **Streamlined Listing Management**: Intuitive dashboard to add, edit, and manage property listings.
- **High-Quality Media Upload**: Support for multiple high-resolution images and virtual tours.
- **Booking & Inquiry Management**: Centralized hub to handle tenant communications and booking requests.

### Technical Excellence
- **Type-Safe Full-Stack**: Built end-to-end with TypeScript for superior reliability and developer experience.
- **Modern Build Tooling**: Leverages Vite for lightning-fast development and builds.
- **Performance Optimized**: Code splitting, lazy loading, and optimized images for rapid page loads.
- **Secure Authentication**: Robust auth system protecting user data and transactions.

## Architecture & Tech Stack

MbendeStay is built on a modern, scalable JAMstack architecture.

**Frontend (Client):**
- **React 18** with TypeScript
- **Vite** for build tooling and dev server
- **Tailwind CSS** for utility-first styling
- **Shadcn/UI** for accessible, customizable components

**Backend (Server):**
- **Node.js** with Express.js or Hono
- **TypeScript** for type safety
- **PostgreSQL** with Drizzle ORM for robust data management
- **JWT-based Authentication** for secure sessions

**Development & Deployment:**
- **Drizzle ORM** for type-safe database interactions
- **GitHub Actions** for CI/CD (optional)
- **Vercel/Netlify** for frontend deployment
- **Railway/Render** for backend deployment

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CHAFAH/mbendestay.git
   cd mbendestay
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies (if any)
   npm install
   
   # Install client dependencies
   cd client
   npm install
   
   # Install server dependencies
   cd ../server
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create environment files
   cp .env.example .env
   ```
   
   Update the `.env` file with your database connection and other secrets:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/mbendestay"
   JWT_SECRET="your-super-secret-jwt-key"
   ```

4. **Set up the database**
   ```bash
   # Run database migrations
   npm run db:push
   # or
   npx drizzle-kit push
   ```

5. **Start the development servers**
   ```bash
   # Start the backend server (from /server directory)
   npm run dev
   
   # Start the frontend server (from /client directory in a new terminal)
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173` to view the application.

##  Testing

```bash
# Run frontend tests
cd client
npm run test

# Run backend tests
cd ../server
npm run test
```

## 📖 API Documentation

The MbendeStay API provides endpoints for:

- `GET /api/properties` - Retrieve properties with filtering options
- `POST /api/properties` - Create a new property listing (authenticated)
- `GET /api/properties/:id` - Get a specific property
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration

For detailed API documentation, see the [API Docs](docs/API.md).

## 🛠️ Deployment

### Frontend Deployment (Vercel)

1. Connect your GitHub repository to Vercel
2. Set build command: `cd client && npm run build`
3. Set output directory: `client/dist`
4. Add environment variables for API endpoints

### Backend Deployment (Railway)

1. Connect your GitHub repository to Railway
2. Set root directory to `/server`
3. Add environment variables for database and secrets
4. Deploy automatically on git push

### Database

A cloud PostgreSQL provider like Neon.tech, Supabase, or Railway PostgreSQL is recommended for production.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by the need for modern rental solutions in Cameroon
- Shadcn/UI for the excellent component library
- Vite team for the fantastic build tool
- Drizzle ORM for type-safe database interactions

## 📞 Contact

Sani Chafah - [@sani_chafah](https://twitter.com/sani_chafah) - [LinkedIn](https://www.linkedin.com/in/sani-chafah/)

Project Link: [https://github.com/CHAFAH/mbendestay](https://github.com/CHAFAH/mbendestay)

---

**⭐ Star this repo if you found it useful!**

