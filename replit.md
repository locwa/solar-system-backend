# Solar System API

## Overview
A Node.js/TypeScript backend API for a solar system governance application. It manages planets, citizens, planetary leaders, proposals, votes, and citizenship requests.

## Project Architecture
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT tokens with session management

## Key Directories
- `/config` - Database configuration
- `/controllers` - Request handlers for auth, citizens, planets, proposals
- `/middleware` - Authentication and role-based authorization
- `/migrations` - Database migrations
- `/models` - Sequelize models (User, Planet, Citizen, Vote, etc.)
- `/routes` - API route definitions
- `/seeders` - Database seed data

## Running the Project
The server runs on port 5000 via `npx ts-node server.ts`

## API Endpoints
- `/api/auth/*` - Authentication routes
- `/api/*` - Planet and citizen routes

## Database
Uses Replit's built-in PostgreSQL database via DATABASE_URL environment variable.
