# Project structure (senior-level)

This document describes the architecture and conventions used in the ADStorm dashboard.

## Directory overview

```
├── app/                    # Next.js App Router – routes and layouts only
├── components/
│   ├── layout/             # App shell: Sidebar, Header, Chatbot, LoadingScreen, CategoryCards, ThemesDialog
│   ├── features/           # Feature modules (domain-driven)
│   │   ├── brands/         # Brands list and detail
│   │   ├── sites/          # Sites & locations + US map
│   │   ├── channels/       # Channels & genres
│   │   └── dashboard/      # Revenue chart and dashboard-specific UI
│   ├── ui/                 # Shared primitives (shadcn-style)
│   ├── theme/              # Theme toggle and provider
│   └── carousel/           # Hero carousel
├── contexts/               # React context (e.g. color theme)
├── hooks/                  # Shared hooks (toast, mobile)
├── lib/                    # Utilities (cn), constants, static data (carousel, us-state-abbr)
├── services/               # Data / API layer
│   └── mock/               # Mock data (brands, channels, sites, revenue)
└── types/                  # Shared domain types
```

## Principles

- **App** – Thin route handlers; compose layout and feature components.
- **Layout** – Reusable shell (sidebar, header, chatbot) used by all main pages.
- **Features** – One folder per domain (brands, sites, channels, dashboard). Each can have components, and optionally hooks/types later.
- **Types** – Centralized in `types/` with barrel export from `types/index.ts`.
- **Services** – All data access (mock or future API) lives under `services/`. Components import from `@/services`, not raw mock files.
- **UI** – Shared primitives only; no business logic.
- **Barrel exports** – Use `index.ts` in layout, features, and types for clean imports (e.g. `@/components/layout`, `@/components/features/brands`).

## Imports

- Prefer: `@/components/layout`, `@/components/features/brands`, `@/types`, `@/services`, `@/hooks`, `@/lib/utils`.
- UI: `@/components/ui/*`.
- Theme: `@/components/theme`.

## Legacy

- `components/dashboard/` – Previous location of layout and feature components. Replaced by `components/layout/` and `components/features/`. Can be removed after full migration verification.
