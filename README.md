# LessPriz SaaS

A price tracking SaaS application built with Next.js, Prisma, Neon PostgreSQL, Clerk authentication, and Inngest for background jobs.

## Features

- Track product prices across e-commerce stores
- Get price drop alerts via email (Resend)
- Dashboard with price history charts
- Automated price checking every 8 hours via Inngest
- Authentication with Clerk

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **ORM**: Prisma with Neon PostgreSQL (serverless)
- **Auth**: Clerk
- **Styling**: Tailwind CSS 4
- **Email**: Resend
- **Background Jobs**: Inngest
- **Deployment**: Vercel

## Environment Variables

Create a `.env` file in the root with the following variables:

```env
# Database (Neon)
DATABASE_URL="postgresql://...neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://...neon.tech/neondb?sslmode=require"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Scraping
RAINFOREST_API_KEY=your_rainforest_api_key

# Email
RESEND_API_KEY=your_resend_api_key

# Inngest
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
```

## Local Development

```bash
npm install
npx prisma generate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

```bash
# Push schema to database
npx prisma db push

# Or run migrations
npx prisma migrate dev --name init
```

## Deployment to Vercel

1. Push this repository to GitHub
2. Import the project in Vercel
3. Add all environment variables from `.env` to Vercel project settings
4. Deploy!

The build command is `npm run build` and output directory is `.next`.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── check-price/   # Manual price check endpoint
│   │   ├── inngest/       # Inngest webhook handler
│   │   └── products/      # Product CRUD endpoints
│   ├── dashboard/         # Dashboard page
│   └── page.tsx           # Landing page
├── components/             # React components
├── lib/                   # Utilities (Prisma, Resend, scraper)
└── inngest/               # Inngest functions
```

## License

MIT
