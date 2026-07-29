# ADStorm Dashboard

Professional advertising management platform for launching campaigns, exploring media inventory, and optimizing ad performance.

> **Note:** This is a front-end UI prototype. All data is mock-driven and requires no API keys or backend services.

## Features

| Area | Capabilities |
| --- | --- |
| **Dashboard** | Campaign metrics, sparklines, revenue charts, and marketplace category cards |
| **Marketplace** | Brands, sites & locations (US map), channels & genres with animated carousels |
| **Campaigns** | Grid/list views, search, pagination, bulk actions, status updates, and previews |
| **Create campaign** | 10-step wizard with Direct, Automatic, and AI-assisted targeting flows |
| **My Ads** | Ad library with search, filters, preview, download, and delete |
| **Theming** | Light / dark / system modes plus multiple color themes |
| **Shell** | Sidebar navigation, global search, notifications, cart, and assistant UI |

## Tech stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router) · [React 19](https://react.dev/) · TypeScript
- **UI:** [Tailwind CSS](https://tailwindcss.com/) · [Radix UI](https://www.radix-ui.com/) / shadcn-style primitives · [Lucide](https://lucide.dev/)
- **Forms & data:** React Hook Form · Zod · [Recharts](https://recharts.org/)
- **Motion & media:** GSAP · Embla Carousel · dotLottie · `@mirawision/usa-map-react`
- **Tooling:** pnpm · ESLint · Prettier · Turbopack (dev)

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/)

### Install & run

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

No `.env` file is required. The app uses local mock data and in-memory client state.

### Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development server (Turbopack) |
| `pnpm build` | Create a production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format the project with Prettier |

## Routes

| Path | Page |
| --- | --- |
| `/` | Dashboard overview |
| `/brands` | Brand marketplace |
| `/sites` | Sites & locations |
| `/channels-genres` | Channels & genres |
| `/campaigns` | Campaign management |
| `/my-ads` | Ad library |

Sidebar items such as Analytics, Balance, Billing, and Settings are placeholders and do not have routes yet.

## Project structure

```text
app/                     # Routes, layouts, and global styles
components/
  carousel/              # Hero carousel
  features/              # Domain UI (brands, sites, channels, campaigns, ads, dashboard)
  layout/                # App shell (sidebar, header, dialogs, chatbot)
  theme/                 # Theme providers and toggle
  ui/                    # Shared UI primitives
contexts/                # Client-side state (cart, color theme, …)
hooks/                   # Shared React hooks
lib/                     # Utilities and constants
public/                  # Static assets (images, video, Lottie)
services/
  mock/                  # Mock data and service layer
types/                   # Shared domain types
```

For architecture conventions, see [`docs/PROJECT_STRUCTURE.md`](docs/PROJECT_STRUCTURE.md).

## Current scope

- Data is mock/in-memory; mutations (cart, campaign status, ad deletion, etc.) reset on reload
- Color theme preference is persisted in `localStorage`
- TypeScript build errors are currently ignored via `next.config.mjs` (`typescript.ignoreBuildErrors`)
- Remote images are loaded from `images.unsplash.com` (allowlisted in Next.js config)
