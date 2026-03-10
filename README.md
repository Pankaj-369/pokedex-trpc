# Pokedex TRPC

A full-stack Pokemon search application built with Next.js App Router, tRPC, Prisma, and React Query. The app supports multiple search modes, server-side validation, and fast typed APIs backed by SQL.

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- tRPC v11
- Prisma ORM 6
- React Query (TanStack Query)
- Material UI (MUI)
- Zod validation

## Features

- Search Pokemon by single name
- Search Pokemon by multiple names
- Search Pokemon by type with pagination
- SQL-backed data access through Prisma
- Typed API layer with tRPC procedures
- Fallback lookup from PokeAPI for single-name searches not found in DB
- Cached external API fetches on the server for performance

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create `.env` in the project root:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
```

### 3. Generate Prisma client

```bash
npm run prisma:generate
```

### 4. Run database migrations

```bash
npx prisma migrate dev
```

### 5. Seed data (optional)

```bash
npx prisma db seed
```

### 6. Start development server

```bash
npm run dev
```

Open http://localhost:3000.

## Available Scripts

- `npm run dev` - Start local dev server
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Create/apply development migration

## Notes

- Ensure your SQL database is reachable before running Prisma commands.
- `getByName` is designed to return DB data first and use PokeAPI as fallback when needed.
- For production deployments, set `DATABASE_URL` in your hosting platform environment variables.
