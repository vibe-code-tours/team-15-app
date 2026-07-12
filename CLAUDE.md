# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ReVive** — A peer-to-peer e-waste platform where users donate, share, and pick up electronics directly from each other. No middleman, no fees — just community-driven recycling. Built as a Next.js 16 landing site with React 19 and Tailwind CSS 4.

## Development Commands

```bash
# Install dependencies (uses pnpm)
pnpm install

# Development server
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Lint
pnpm lint
```

No test suite is currently configured.

## Tech Stack

- **Framework**: Next.js 16 (App Router, React Server Components by default)
- **UI Components**: shadcn/ui v4 (`base-nova` style) — add new components via `pnpm dlx shadcn@latest add <component>`
- **Styling**: Tailwind CSS 4 with CSS variables for theming (oklch color space)
- **Animations**: Framer Motion — use the `<Reveal>` wrapper component for scroll-triggered entrance animations
- **Icons**: Lucide React

## Architecture

### Path Aliases

`@/*` maps to the project root. Always use `@/components/...`, `@/lib/...`, etc.

### Component Conventions

- **Server Components** (default): All components are server components unless marked with `'use client'` at the top
- **Client Components**: Hero, Reveal, and interactive components use `'use client'` — required when using React hooks, Framer Motion, or browser APIs
- **UI primitives**: shadcn components live in `components/ui/`
- **Feature components**: Domain-specific components (hero, categories, etc.) live in `components/`

### Styling

- Use `cn()` from `@/lib/utils` to merge Tailwind classes (wraps `clsx` + `tailwind-merge`)
- Theme colors are defined as CSS variables in `app/globals.css` using oklch — reference them via Tailwind utility classes (e.g., `bg-primary`, `text-muted-foreground`)
- Dark mode is the only color scheme (no light mode toggle)

### Key Files

- `app/layout.tsx` — Root layout with fonts (Space Grotesk for sans, Inter for mono), metadata, and Vercel Analytics
- `app/globals.css` — Theme tokens and Tailwind configuration
- `components.json` — shadcn/ui configuration (base-nova style, lucide icons)
- `next.config.mjs` — TypeScript build errors are ignored; images are unoptimized

## Content & SEO

The site has comprehensive OpenGraph and Twitter metadata defined in `app/layout.tsx`. When modifying the layout or adding pages, maintain the metadata structure and keyword set for SEO consistency.
