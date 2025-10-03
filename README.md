# TradeU

A campus marketplace platform where students can buy, sell, and trade textbooks, furniture, electronics, and services. Features .edu email verification, campus-specific hubs, and cross-school connectivity for a trusted student network.

## Tech Stack

**Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
**Backend:** Express.js, Node.js
**Database & Auth:** Supabase

## Setup

### Frontend

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your Supabase credentials:
```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

4. Start the server (once implemented):
```bash
npm start
```
