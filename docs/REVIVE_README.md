# ReVive

An e-waste recycling platform where users donate old electronics and schedule free doorstep pickups.

## Features

- Donate phones, laptops, cables, and appliances
- Schedule free doorstep pickup
- Track your environmental impact
- Scroll-triggered entrance animations
- Dark-mode-only design with oklch theming

## Requirements

- Node.js 20+
- pnpm

## Install

```bash
pnpm install
```

## Usage

```bash
pnpm dev
```

Opens the site at `http://localhost:3000`.

## Development

```bash
# Start dev server
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Lint
pnpm lint
```

### Tech stack

- Next.js 16 (App Router, React Server Components by default)
- React 19
- Tailwind CSS 4 with oklch color variables
- shadcn/ui v4 (`base-nova` style)
- Framer Motion for animations
- Lucide React for icons

### Path aliases

`@/*` maps to the project root. Use `@/components/...`, `@/lib/...`, etc.

### Components

| Component | Purpose |
|-----------|---------|
| `site-header` | Top navigation bar |
| `hero` | Landing hero section |
| `categories` | E-waste category grid |
| `how-it-works` | Step-by-step process |
| `impact-stats` | Environmental impact numbers |
| `cta-footer` | Call-to-action section and footer |
| `reveal` | Scroll-triggered entrance animation wrapper |

### Adding UI primitives

```bash
pnpm dlx shadcn@latest add <component>
```

## License

MIT
