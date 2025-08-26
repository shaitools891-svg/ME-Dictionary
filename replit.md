# Dictionary App

## Overview

This is a full-stack English-Bangla dictionary application built with React and Express. The app provides bilingual dictionary lookup, custom word management, offline package downloads, and prayer time scheduling features. It's designed as a mobile-first progressive web application (PWA) with Android installation capabilities, featuring a clean, modern interface using shadcn/ui components.

## Recent Changes (August 26, 2025)

- **Android PWA Implementation**: Converted the web application to a Progressive Web App that can be installed on Android devices
- **Android-Specific Features**: Added install banners, touch optimizations, vibration support, native sharing, and notification permissions
- **Service Worker**: Implemented comprehensive service worker for offline functionality and background prayer notifications
- **App Icons**: Generated and implemented app icons for various Android device densities
- **Mobile Optimizations**: Added safe area support, touch-friendly UI elements, and Android-specific CSS optimizations
- **GitHub Pages Deployment**: Created complete deployment pipeline with GitHub Actions, build scripts, and configuration files for static hosting

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite for build tooling
- **Routing**: Wouter for client-side routing (lightweight React router alternative)
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Design System**: Mobile-first responsive design with bottom navigation pattern

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **API Design**: RESTful API with JSON responses
- **Development**: Hot module replacement via Vite in development mode
- **Production**: Static file serving with Express in production

### Data Storage Solutions
- **Primary Database**: PostgreSQL configured via Neon Database serverless
- **ORM**: Drizzle ORM with schema-first approach for type safety
- **Schema Location**: Shared schema definitions in `/shared/schema.ts`
- **Migration Strategy**: Drizzle Kit for schema migrations
- **In-Memory Fallback**: Memory-based storage implementation for development/testing

### Authentication and Authorization
- **Current State**: No authentication implemented (using mock user ID)
- **User Management**: Basic user schema defined but not actively used
- **Session Handling**: Prepared for PostgreSQL session storage with connect-pg-simple

### Core Features Architecture
- **Dictionary Search**: Bilingual search with language detection and suggestions
- **Custom Words**: Personal vocabulary management with CRUD operations
- **Offline Packages**: Downloadable content packages for offline usage
- **Prayer Settings**: Configurable prayer time notifications with scheduling
- **Theme System**: Multiple theme support (light, dark, sepia, forest) with CSS custom properties

### Mobile-First Design Patterns
- **Navigation**: Bottom tab navigation for thumb-friendly mobile interaction
- **Responsive**: Single-column layout optimized for mobile screens
- **Progressive Enhancement**: Works offline with cached content
- **Touch Interactions**: Optimized for touch input with appropriate sizing

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Connection**: Via @neondatabase/serverless driver

### UI and Component Libraries
- **Radix UI**: Unstyled, accessible UI primitives for complex components
- **shadcn/ui**: Pre-built component library based on Radix UI
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography

### Development and Build Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Static type checking across frontend and backend
- **Drizzle Kit**: Database migration and schema management
- **ESBuild**: Fast JavaScript bundler for production builds

### Runtime Libraries
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form state management with validation
- **Wouter**: Lightweight client-side routing
- **date-fns**: Date manipulation and formatting

### Optional Integrations
- **Replit Integration**: Development environment optimizations for Replit
- **Font Awesome**: Icon fonts for legacy icon support
- **Google Fonts**: Web fonts (Inter, Noto Sans Bengali) for multilingual typography