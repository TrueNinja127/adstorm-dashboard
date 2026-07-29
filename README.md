# ADStorm Dashboard

Professional advertising management platform for launching campaigns, reaching audiences, and optimizing ad performance.

Built with Next.js 16, React 19, TypeScript, and Tailwind CSS.

> **Note:** ADStorm is currently a front-end prototype. Every screen runs on local mock data, so no API keys, database, or backend services are needed to run it.

## Features

| Area | Capabilities |
| --- | --- |
| **Dashboard** | Stat cards with sparklines (active campaigns, impressions, click rate, spend), revenue chart, and marketplace category cards |
| **Marketplace** | Brands, sites & locations with an interactive US states map, and channels & genres — each with an animated hero carousel |
| **Campaigns** | Grid and list views, search, pagination, bulk selection, status changes, delete confirmation, details drawer, and ad preview |
| **Create campaign** | 10-step wizard with three branching flows (Direct, Automatic, AI-assisted) covering objective, targeting, ad formats, budget, and scheduling |
| **My Ads** | Ad library with search, campaign and status filters, preview, download, and delete |
| **Theming** | Light, dark, and system modes plus 9 color themes; dark mode is the default |
| **App shell** | Collapsible sidebar, global search, notifications, cart, upload-ad dialog, and assistant panel |

## Tech stack

| Layer | Technologies |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) · [React 19](https://react.dev/) · TypeScript 5.7 |
| UI | [Tailwind CSS 3](https://tailwindcss.com/) · [Radix UI](https://www.radix-ui.com/) via [shadcn/ui](https://ui.shadcn.com/) · [Lucide](https://lucide.dev/) icons |
| Forms & validation | [React Hook Form](https://react-hook-form.com/) · [Zod](https://zod.dev/) |
| Data visualization | [Recharts](https://recharts.org/) |
| Motion & media | [GSAP](https://gsap.com/) · [Embla Carousel](https://www.embla-carousel.com/) · [dotLottie](https://lottiefiles.com/) · `@mirawision/usa-map-react` |
| Tooling | pnpm · ESLint · Prettier |

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 20.9 or newer (required by Next.js 16)
- [pnpm](https://pnpm.io/)

### Install and run

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

No environment file is required — the app reads from `services/mock/` and keeps mutations in client-side state.

### Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development server with Turbopack |
| `pnpm build` | Create a production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Run ESLint (`next/core-web-vitals`) |
| `pnpm format` | Format the repository with Prettier |

## Routes

| Path | Page |
| --- | --- |
| `/` | Dashboard overview |
| `/brands` | Brand marketplace |
| `/sites` | Sites & locations |
| `/channels-genres` | Channels & genres |
| `/campaigns` | Campaign management |
| `/my-ads` | Ad library |

Sidebar entries for Analytics, Balance, Billing, and Settings are placeholders without routes.

## Project structure

```text
app/                  # App Router routes, root layout, and global styles
components/
  carousel/           # Hero carousel
  features/           # Domain UI: ads, brands, campaigns, channels, dashboard, sites
  layout/             # App shell: sidebar, header, dialogs, chatbot, loading screen
  theme/              # Theme provider and toggle
  ui/                 # shadcn-style primitives
contexts/             # Cart, chatbot, color theme, and create-campaign providers
hooks/                # use-mobile, use-toast
lib/                  # Utilities, carousel data, US state abbreviations
public/               # Images, video, and Lottie animations
services/
  mock/               # Mock data: brands, campaigns, channels, revenue, sites
types/                # Shared domain types
```

## Conventions

- Import through the `@/*` path alias and barrel exports, for example `@/components/layout`, `@/services`, `@/types`
- Components consume data from `@/services` rather than importing mock files directly
- `components/ui/` holds presentation primitives only, with no business logic
- Prettier settings: no semicolons, double quotes, two-space indentation

## Known limitations

- Data is mock and in-memory, so cart contents, campaign status changes, and ad deletions reset on reload
- Only the selected color theme persists, via `localStorage`
- `next.config.mjs` sets `typescript.ignoreBuildErrors`, so `pnpm build` can succeed with type errors