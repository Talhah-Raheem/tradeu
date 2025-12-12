# TradeU

A peer-to-peer marketplace platform for college students to buy, sell, and trade items within their campus community.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Architecture](#architecture)
- [Key Features](#key-features)
- [Database Schema](#database-schema)

## Overview

TradeU is a full-stack application that enables students to create listings, browse items by category, communicate with buyers/sellers, and complete transactions securely. The platform includes user authentication, image uploads, real-time messaging, and order management.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **UI:** React 19, Tailwind CSS 4
- **Backend:** Supabase (PostgreSQL, Authentication, Storage)


## Project Structure

```
tradeu/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── checkout/          # Checkout flow
│   │   ├── listings/          # Listing creation, browsing, editing
│   │   ├── messages/          # Messaging interface
│   │   ├── orders/            # Order management
│   │   ├── profile/           # User profiles
│   │   ├── login/             # Authentication
│   │   ├── signup/            # User registration
│   │   └── page.tsx           # Landing page
│   ├── components/            # Reusable React components
│   │   ├── landing/           # Landing page sections
│   │   ├── AuthLayout.tsx     # Auth page wrapper
│   │   ├── Button.tsx         # UI components
│   │   ├── Input.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ReviewCard.tsx
│   │   └── StarRating.tsx
│   ├── contexts/              # React contexts
│   │   └── AuthContext.tsx    # Authentication state
│   ├── lib/                   # Utilities and API clients
│   │   ├── api/               # API functions
│   │   │   ├── categories.ts
│   │   │   ├── listings.ts
│   │   │   ├── messages.ts
│   │   │   ├── orders.ts
│   │   │   ├── storage.ts
│   │   │   └── users.ts
│   │   └── supabase.ts        # Supabase client configuration
│   └── types/                 # TypeScript type definitions
│       └── database.ts        # Database types
├── public/                    # Static assets
├── .env.example              # Environment variables template
├── next.config.ts            # Next.js configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies

```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tradeu
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials (see [Environment Variables](#environment-variables)).

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

To obtain these credentials:
1. Create a project at [supabase.com](https://supabase.com)
2. Navigate to Project Settings > API
3. Copy the Project URL and anon/public key

## Development

```bash
# Development mode with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm start
```

## Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       │ HTTPS
       ▼
┌─────────────────────────────────────────┐
│          Next.js App (Port 3000)        │
│  ┌─────────────────────────────────┐   │
│  │      App Router (src/app)       │   │
│  │  - Server Components (default)  │   │
│  │  - Client Components ('use client') │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │    API Layer (src/lib/api)      │   │
│  │  - listings.ts                  │   │
│  │  - orders.ts                    │   │
│  │  - messages.ts                  │   │
│  │  - users.ts                     │   │
│  │  - categories.ts                │   │
│  │  - storage.ts                   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │   Supabase Client (src/lib)     │   │
│  │  - Authentication state         │   │
│  │  - Database queries             │   │
│  │  - File uploads                 │   │
│  └─────────────────────────────────┘   │
└──────────────┬──────────────────────────┘
               │
               │ REST/GraphQL
               ▼
┌───────────────────────────────────┐
│     Supabase Backend (Cloud)      │
│  ┌────────────────────────────┐   │
│  │  PostgreSQL Database       │   │
│  │  - users                   │   │
│  │  - listings                │   │
│  │  - orders                  │   │
│  │  - messages                │   │
│  │  - categories              │   │
│  └────────────────────────────┘   │
│  ┌────────────────────────────┐   │
│  │  Authentication            │   │
│  │  - JWT tokens              │   │
│  │  - Session management      │   │
│  └────────────────────────────┘   │
│  ┌────────────────────────────┐   │
│  │  Storage Buckets           │   │
│  │  - listing-images          │   │
│  │  - profile-pictures        │   │
│  └────────────────────────────┘   │
└───────────────────────────────────┘
```

## Key Features

### User Management
- User registration and authentication via Supabase Auth
- User profiles with editable information
- Profile picture uploads

### Listings
- Create, read, update, and delete product listings
- Multi-image upload support
- Category-based organization
- Search functionality
- Condition ratings (New, Like New, Good, Fair, Poor)
- Automatic status tracking (active, sold, inactive)

### Messaging
- Direct messaging between buyers and sellers
- Conversation threads grouped by listing
- Real-time message updates

### Orders
- Checkout flow for purchasing items
- Order history and status tracking
- Seller order management
- Automatic listing status updates on sale completion

### Categories
- Pre-defined product categories
- Category-based browsing and filtering
- Visual category cards on landing page

## Database Schema

### Core Tables

**users**
- user_id (UUID, PK)
- email, first_name, last_name
- created_at, updated_at

**listings**
- listing_id (serial, PK)
- user_id (FK → users)
- categories_id (FK → categories)
- title, description, price, location, condition
- status (active, sold, inactive)
- created_at, updated_at

**categories**
- category_id (serial, PK)
- category_name
- created_at

**orders**
- order_id (serial, PK)
- listing_id (FK → listings)
- buyer_id (FK → users)
- seller_id (FK → users)
- total_price, status
- created_at

**messages**
- message_id (serial, PK)
- sender_id (FK → users)
- receiver_id (FK → users)
- listing_id (FK → listings)
- content
- created_at

**listing_images**
- image_id (serial, PK)
- listing_id (FK → listings)
- image_url
- created_at
