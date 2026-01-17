# Sparta App

## Overview

Sparta App is a fitness training tracker built with a mobile-first approach. The application allows users to register, view daily workout routines, log their training sessions, and track their exercise history through a calendar view. The app follows a "Spartan" theme with Portuguese language interface elements.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state management
- **Styling**: Tailwind CSS with custom theme configuration
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Animations**: Framer Motion for page transitions and interactions
- **Form Handling**: React Hook Form with Zod validation via @hookform/resolvers

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **API Pattern**: RESTful API with typed route definitions
- **Build Tool**: Vite for frontend, esbuild for server bundling

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Validation**: Zod schemas auto-generated from Drizzle schemas via drizzle-zod
- **Database**: PostgreSQL (connection via DATABASE_URL environment variable)

### Key Design Patterns
- **Shared Types**: The `shared/` directory contains schema and route definitions used by both client and server
- **Type-safe API**: Route definitions in `shared/routes.ts` include input validation schemas and response types
- **Storage Abstraction**: `server/storage.ts` implements an IStorage interface for database operations
- **Path Aliases**: `@/` maps to client/src, `@shared/` maps to shared directory

### Database Schema
Three main tables:
1. **users**: User registration (id, name, email, password)
2. **trainings**: Workout definitions (id, title, description, durationSeconds, isFeatured)
3. **trainingLogs**: User workout history (id, userId, trainingId, date, keptPace, withinTime, allReps, notes)

### Build & Development
- **Development**: `npm run dev` runs tsx server with Vite middleware for HMR
- **Production Build**: `npm run build` compiles frontend with Vite, bundles server with esbuild
- **Database Migrations**: `npm run db:push` uses Drizzle Kit to push schema changes

## External Dependencies

### Database
- **PostgreSQL**: Primary database, requires DATABASE_URL environment variable
- **connect-pg-simple**: Session storage (available but not currently implemented)

### UI Libraries
- **Radix UI**: Full suite of accessible, unstyled components
- **Lucide React**: Icon library
- **embla-carousel-react**: Carousel functionality
- **react-day-picker**: Calendar component for history page
- **date-fns**: Date formatting utilities with Portuguese locale support
- **vaul**: Drawer component
- **cmdk**: Command palette component

### Development Tools
- **Vite**: Development server and build tool
- **Drizzle Kit**: Database migration tooling
- **@replit/vite-plugin-***: Replit-specific development plugins