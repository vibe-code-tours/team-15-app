# ReVive — Presentation Slides
### Team 15 | Vibe Code Tours

---

## Slide 1 — Introduction

### **ReVive**
#### Give Your Old Tech a Second Life

**Team 15** | Vibe Code Tours

> A peer-to-peer e-waste recycling platform that connects people who have
> old electronics with people who need them — no middleman, no fees.

**What you're about to see:**
- Why 50 million tons of e-waste hit landfills every year
- How a 5-minute listing can redirect a device from a landfill to someone's desk
- A live demo of the full donate-to-pickup flow
- How we shipped 80+ files across 6 feature phases using AI-assisted development

---

## Slide 2 — HOOK (30s)

> **Problem in one sentence:**
> Every year, 50 million metric tons of electronic waste are dumped in landfills —
> yet millions of people can't afford the devices they need for work and school.

> **Who hurts:**
> Communities without access to affordable tech, and the planet drowning in toxic e-waste.

> **Why it matters:**
> E-waste is the fastest-growing waste stream on Earth. A single phone contains lead,
> mercury, and cadmium — toxins that leach into groundwater for decades.
> The devices are fine. The system is broken.

---

## Slide 3 — SOLUTION (30s)

> **We built:**
> **ReVive** — a peer-to-peer marketplace where anyone can list an old device
> in under 2 minutes, and someone nearby can claim it for free.
> No sellers. No shipping labels. Just a handoff.

> **For:**
> Anyone with a drawer full of old phones, laptops, and tablets —
> and anyone who needs one.
>
> Think: "Facebook Marketplace, but only for giving things away,
> and every single item keeps electronics out of a landfill."

---

## Slide 4 — DEMO: The One Flow (3.5 min) [LIVE]

### Step 1 — List a Device (30s)

> **I click:** "Donate" → fill in title, condition, category, pickup location
>
> **Viewer sees:**
> A clean multi-step form. I type "MacBook Pro 2019", select
> "Working" condition, choose "Laptops" category, set my neighborhood.
> Upload two photos. Hit submit. Done.

### Step 2 — Browse & Claim (30s)

> **I click:** "Browse" → see a grid of available items near me
>
> **Viewer sees:**
> A filterable marketplace. I filter by "Laptops" + "Working".
> There's the MacBook. I click "Request Pickup" — a scheduling
> form pops up with available time slots.

### Step 3 — The Payoff (30s)

> **I click:** Confirm pickup → check my Dashboard
>
> **Viewer sees:**
> My pickup appears in the dashboard with status tracking.
> I get a notification: "Pickup confirmed!" My impact stats
> update — CO2 saved ticks up, my points increase, and a new
> achievement badge unlocks.
>
> *(the "oh, nice" moment:)*
> The same flow that just redirected a laptop from a landfill
> also earned me a "First Donation" bronze badge and 100 impact points.
> Gamification meets environmental action.

---

## Slide 5 — TECH HIGHLIGHT (45s)

> **Hardest thing:**
> Building a full-stack platform with 14 database models, 13 API routers,
> 20+ pages, and 80+ new files across 6 feature phases — while keeping
> the entire frontend and backend codebases consistent and deployable.
>
> We used a **multi-agent architecture** approach:
> - **Next.js 16** with App Router, React 19, Tailwind CSS 4, shadcn/ui
> - **FastAPI + Python** backend with SQLAlchemy, PostgreSQL, Alembic migrations
> - Deployed on **Render** (backend) + **Vercel** (frontend) with GitHub Actions CI/CD

> **Which AI tool did it:**
> **Claude Code** by Anthropic — our primary development partner.
>
> We defined **18 specialized AI agents** (frontend-architect, backend-architect,
> security-engineer, code-reviewer, etc.) that each handled their domain.
> Claude Code wrote and reviewed the vast majority of our 80+ files,
> while the team directed architecture, made product decisions, and caught edge cases.
>
> We also used **21st.dev** for UI component sourcing and **Vercel v0**
> for initial UI generation.

---

## Slide 6 — WHAT'S NEXT (30s)

> **For the real user, next we'd:**
> - Add **real-time GPS tracking** for pickups — see your recycler approaching on a map
> - Launch **community drives** — neighborhoods can organize bulk e-waste collection events
> - Partner with **local recycling centers** for devices that can't be reused
> - Add **impact certificates** — downloadable proof of your environmental contribution
> - Scale to **multi-city** with regional hubs and logistics partners
>
> ReVive isn't just an app — it's infrastructure for a circular electronics economy.

---

## Slide 7 — OUTRO (15s)

> **"That's Team 15. Thanks for watching."**
>
> *Give Your Old Tech a Second Life.*
>
> **ReVive** — `vibe-code-tours/team-15-app`
