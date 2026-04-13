# Recipe Finder & Meal Planner

A full-stack recipe application built with Next.js, Clerk, Supabase, and TheMealDB API.

## Project Structure
- `src/app`: App Router pages and layouts
- `src/components`: Reusable UI components
- `src/lib`: Utility functions and API clients
- `src/types`: TypeScript definitions

## Tech Stack
- Framework: Next.js 14+ (App Router)
- Styling: Tailwind CSS
- Auth: Clerk
- Database: Supabase
- API: TheMealDB

## Commands
- Build: `npm run build`
- Dev: `npm run dev`
- Lint: `npm run lint`

## Supabase Schema
### `saved_recipes`
- `id`: uuid (primary key)
- `user_id`: text (Clerk user ID)
- `recipe_id`: text (TheMealDB recipe ID)
- `title`: text
- `image_url`: text
- `created_at`: timestamp with time zone
