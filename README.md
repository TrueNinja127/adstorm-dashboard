# ADStorm Dashboard

ADStorm is a modern advertising management dashboard for planning campaigns,
exploring media inventory, and reviewing ad performance. The project is a
front-end demo powered by mock data, so it can be run locally without API keys
or external services.

## Features

- Performance overview with campaign metrics and revenue charts
- Marketplace pages for brands, sites, locations, channels, and genres
- Campaign management with search, filters, bulk actions, and detailed previews
- 10-step campaign creation flow with direct, automatic, and AI-assisted paths
- Ad library with filtering, previews, downloads, and deletion
- Light, dark, and system modes with multiple color themes
- Responsive sidebar, global search, notifications, cart, and assistant UI

## Tech stack

- [Next.js 16](https://nextjs.org/) with the App Router
- [React 19](https://react.dev/) and TypeScript
- [Tailwind CSS](https://tailwindcss.com/) and Radix UI primitives
- [Recharts](https://recharts.org/) for data visualization
- GSAP, Embla Carousel, and dotLottie for motion and interactive content
- React Hook Form and Zod for forms and validation

## Getting started

### Prerequisites

- Node.js
- [pnpm](https://pnpm.io/)

### Installation

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

No environment variables are required. The application currently uses local
mock data and in-memory state.

## Available scripts

```bash
pnpm dev      # Start the development server with Turbopack
pnpm build    # Create a production build
pnpm start    # Start the production server
pnpm lint     # Run ESLint
pnpm format   # Format the project with Prettier
```

## Routes

- `/` — Dashboard overview
- `/brands` — Brand marketplace
- `/sites` — Sites and locations
- `/channels-genres` — Channels and genres
- `/campaigns` — Campaign management
- `/my-ads` — Ad library

## Project structure

```text
app/                  Next.js routes and global styles
components/
  features/           Feature-specific components
  layout/             Application shell and shared dialogs
  ui/                 Reusable UI primitives
contexts/             Client-side state providers
hooks/                Shared React hooks
lib/                  Utilities
public/               Static images, videos, and animations
services/mock/         Mock application data
```

## Current scope

ADStorm is currently a UI prototype. Data changes are stored in client-side
state and reset when the page reloads; the color theme preference is persisted
in local storage. Sidebar entries without corresponding routes are placeholders
for future functionality.
