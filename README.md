# 🌱 ReVive

### *Revolutionizing E-Waste Recycling Through Community*

[![GitHub Stars](https://img.shields.io/github/stars/vibe-code-tours/team-15-app?style=flat-square&color=2f6b4d)](https://github.com/vibe-code-tours/team-15-app/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/vibe-code-tours/team-15-app?style=flat-square&color=4ade80)](https://github.com/vibe-code-tours/team-15-app/network/members)
[![GitHub Issues](https://img.shields.io/github/issues/vibe-code-tours/team-15-app?style=flat-square&color=eab308)](https://github.com/vibe-code-tours/team-15-app/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/vibe-code-tours/team-15-app?style=flat-square&color=22c55e)](https://github.com/vibe-code-tours/team-15-app/pulls)
[![License](https://img.shields.io/github/license/vibe-code-tours/team-15-app?style=flat-square&color=ef4444)](LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/vibe-code-tours/team-15-app?style=flat-square&color=3b82f6)](https://github.com/vibe-code-tours/team-15-app/commits/main)

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Framer Motion](https://img.shields.io/badge/Framer-Motion-12-FF0055?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion/)

---

## 🎯 What is ReVive?

**ReVive** is a peer-to-peer e-waste platform where users donate, share, and pick up electronics directly from each other. No middleman, no fees — just community-driven recycling.

> *"Turn your old electronics into someone else's treasure while saving the planet."*

## ✨ Features

### 🏠 Smart Home Page
- Hero section with scroll-triggered animations
- Dynamic category grid for e-waste types
- Environmental impact statistics
- Call-to-action sections

### 📊 Admin Dashboard
- Real-time analytics and metrics
- Pickup management with search/filter
- User management system
- Platform performance insights

### 🔔 Notifications System
- Real-time notification bell
- Type-based icons (pickup, referral, milestone)
- Mark as read/unread
- Auto-generated templates

### 🔍 Advanced Search
- Full-text search across devices
- Filter by status, category, condition
- Debounced search (300ms)
- Match highlighting in results

### ⚙️ User Settings
- Profile editing
- Notification preferences
- Data export (JSON)
- Account management

### 🏆 Achievements
- 19 achievements across 4 categories
- 4 tiers: bronze → platinum
- Progress tracking with visuals
- Milestone celebrations

## 🎨 Design System

### 🎨 Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| 🟢 Eco Green | `#2f6b4d` | Primary actions |
| 🔵 Canvas | `#f8f9fa` | Page background |
| ⚫ Ink | `#1a1a1a` | High-contrast text |
| 🟡 Accent | `#4ade80` | Success states |

### ✨ Design Highlights
- **Dark-mode-only** design with oklch theming
- **Modern aesthetic** focusing on sustainability
- **Vibrant eco-greens** with soft neutrals
- **Crisp typography** using Inter font
- **Responsive layouts** for all devices
- **Micro-interactions** with Framer Motion

## 📸 Screenshots

### 🏠 Landing Page
![Landing Page](screenshots/landing-full.png)

*Scroll-triggered animations • Dark theme • Eco-friendly design*

### 📊 Sign In Dashboard
![Admin Dashboard](screenshots/sign-in.png)

*Real-time analytics • Metric cards • Interactive charts*

### Browse
![Browse](screenshots/browse-item.png)

### 📦 Pickups Management
![Pickups](screenshots/pickup-management.png)

*Search and filter • Status tracking • User management*

### Referral
![Referral](screenshots/referral-program.png)

*Full-text search • Filter chips • Match highlighting*

### ⚙️ User Settings
![Settings](screenshots/account-setting.png)
![Settings](screenshots/account-setting2.png)
![Settings](screenshots/account-setting3.png)

*Profile editing • Notification preferences • Data export*

## 🚀 Quick Start

### 📋 Prerequisites

| Requirement | Version | Check |
|-------------|---------|-------|
| Node.js | 20+ | `node --version` |
| pnpm | Latest | `pnpm --version` |

### 🛠️ Installation

```bash
# 1️⃣ Clone the repository
git clone https://github.com/vibe-code-tours/team-15-app.git
cd team-15-app

# 2️⃣ Install dependencies
pnpm install

# 3️⃣ Start development server
pnpm dev
```

### 🎯 Access the App

Open [http://localhost:3000](http://localhost:3000) in your browser.

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/admin` | Admin dashboard |
| `/admin/pickups` | Pickup management |
| `/admin/users` | User management |
| `/admin/analytics` | Platform analytics |
| `/settings` | User settings |
| `/dashboard/search` | Advanced search |
| `/dashboard/notifications` | Notifications |
| `/dashboard/achievements` | Achievements |

## 🛠️ Development Commands

```bash
# 🚀 Start development server
pnpm dev

# 🏗️ Production build
pnpm build

# ▶️ Start production server
pnpm start

# 🔍 Lint code
pnpm lint

# 📦 Add shadcn/ui component
pnpm dlx shadcn@latest add <component>
```

## 🏗️ Architecture

```
ReVive/
├── 📁 app/                    # Next.js App Router
│   ├── 📄 layout.tsx         # Root layout
│   ├── 📄 globals.css        # Theme tokens
│   ├── 📁 admin/             # Admin dashboard
│   ├── 📁 dashboard/         # User dashboard
│   ├── 📁 settings/          # User settings
│   └── 📁 api/               # API routes
├── 📁 components/            # React components
│   ├── 📁 ui/                # shadcn/ui primitives
│   ├── 📁 admin/             # Admin components
│   ├── 📁 notifications/     # Notification system
│   ├── 📁 search/            # Search components
│   ├── 📁 settings/          # Settings components
│   └── 📁 achievements/      # Achievement system
├── 📁 lib/                   # Utilities & configs
│   ├── 📁 db/                # Database schemas
│   ├── 📁 api/               # API helpers
│   ├── 📁 achievements/      # Achievement logic
│   ├── 📁 notifications/     # Notification logic
│   └── 📁 search/            # Search logic
└── 📁 public/                # Static assets
```

## 🧩 Component System

| Component | Purpose | Features |
|-----------|---------|----------|
| `site-header` | Top navigation bar | Responsive • Auth-aware |
| `hero` | Landing hero section | Animated • Interactive |
| `categories` | E-waste category grid | Dynamic • Filterable |
| `how-it-works` | Step-by-step process | Visual • Scrolling |
| `impact-stats` | Environmental impact | Animated counters |
| `cta-footer` | Call-to-action + Footer | Engaging • Clean |
| `reveal` | Scroll-triggered animation | Framer Motion powered |

## 🎨 Adding UI Components

```bash
# Add a new shadcn/ui component
pnpm dlx shadcn@latest add button

# Add with specific style
pnpm dlx shadcn@latest add card --style base-nova
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/user/profile` | Get user profile |
| `PUT` | `/api/user/profile` | Update profile |
| `GET` | `/api/pickups` | List pickups (paginated) |
| `POST` | `/api/pickups` | Create pickup |
| `PATCH` | `/api/pickups/:id` | Update pickup status |
| `POST` | `/api/search` | Search pickups |
| `GET` | `/api/admin/stats` | Admin statistics |

## 🏆 Achievement System

| Category | Tiers | Examples |
|----------|-------|----------|
| 🎯 Donation | Bronze → Platinum | First Steps → Recycling Legend |
| 🌍 Impact | Bronze → Platinum | Carbon Reducer → Environmental Guardian |
| 👥 Referral | Bronze → Platinum | Social Butterfly → Movement Starter |
| 🔥 Streak | Bronze → Platinum | Consistent Recycler → Year-Round Hero |

## 📚 Documentation

| Document | Description |
|----------|-------------|
| `NOTIFICATIONS_README.md` | Notifications system guide |
| `SEARCH_README.md` | Search and filtering guide |
| `DESIGN.md` | Design system documentation |
| `IMPLEMENTATION_COMPLETE.md` | Implementation summary |
| `lib/api/README.md` | API documentation |

## 🤝 Contributing

We welcome contributions! Here's how to get started:

```bash
# 1️⃣ Fork the repository
# 2️⃣ Create your feature branch
git checkout -b feature/amazing-feature

# 3️⃣ Commit your changes
git commit -m 'feat: add amazing feature'

# 4️⃣ Push to the branch
git push origin feature/amazing-feature

# 5️⃣ Open a Pull Request
```

### 📋 Contribution Guidelines

- ✅ Follow the existing code style
- ✅ Add tests for new features
- ✅ Update documentation as needed
- ✅ Keep commits atomic and well-described
- ✅ Ensure all tests pass before submitting

<!-- ## 📊 Stats & Metrics

![GitHub Stats](https://github-stats-extended.vercel.app/api?username=vibe-code-tours&show_icons=true&theme=dark&bg_color=18181b&title_color=4ade80&icon_color=4ade80&text_color=ffffff&border_color=2f6b4d)

![Top Languages](https://github-stats-extended.vercel.app/api/top-langs?username=vibe-code-tours&layout=compact&theme=dark&bg_color=18181b&title_color=4ade80&text_color=ffffff&border_color=2f6b4d) -->

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful components
- [Lucide React](https://lucide.dev/) - Icon library
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [Better Auth](https://www.better-auth.com/) - Authentication

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

### 🌱 Made with 💚 for a sustainable future

**[Report Bug](https://github.com/vibe-code-tours/team-15-app/issues)** • **[Request Feature](https://github.com/vibe-code-tours/team-15-app/issues)** • **[View Docs](https://github.com/vibe-code-tours/team-15-app#readme)**

*ReVive © 2026 • Built with Next.js 16, React 19, and Tailwind CSS 4*
