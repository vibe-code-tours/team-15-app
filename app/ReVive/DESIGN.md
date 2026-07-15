---
version: 1.0
name: ReVive-design-system
description: The design system for ReVive, an eco-friendly e-waste donation platform. The system uses a clean, modern aesthetic focusing on sustainability, utilizing vibrant eco-greens, soft neutrals, and crisp typography to inspire trust and environmental action.

colors:
  primary: "#2f6b4d"
  primary-active: "#214c36"
  primary-disabled: "#a0bfae"
  ink: "#1a1a1a"
  body: "#4a4a4a"
  body-strong: "#2c2c2c"
  muted: "#71717a"
  muted-soft: "#a1a1aa"
  hairline: "#e4e4e7"
  canvas: "#f8f9fa"
  surface-card: "#ffffff"
  surface-dark: "#18181b"
  on-primary: "#ffffff"
  on-dark: "#ffffff"
  accent-leaf: "#4ade80"
  success: "#22c55e"
  warning: "#eab308"
  error: "#ef4444"

typography:
  fontFamily: "Inter, -apple-system, sans-serif"
  display:
    fontSize: 48px
    fontWeight: 700
    letterSpacing: -1px
  title:
    fontSize: 24px
    fontWeight: 600
  body:
    fontSize: 16px
    fontWeight: 400
  button:
    fontSize: 14px
    fontWeight: 500

rounded:
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  full: 9999px

spacing:
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  section: 64px
---

## Overview
ReVive's design system is built to evoke sustainability, trust, and community action. The aesthetic relies heavily on clean white surfaces (`{colors.surface-card}`) over a soft neutral canvas (`{colors.canvas}`), highlighted by our signature Eco Green (`{colors.primary}`).

## Colors
- **Eco Green / Primary** (`{colors.primary}`): The core brand color. Used for primary actions, prominent icons, and the logo.
- **Canvas** (`{colors.canvas}`): A very soft, cool off-white used for the page background to make white cards pop.
- **Ink** (`{colors.ink}`): High-contrast dark gray for primary text, ensuring excellent readability.

## Typography
The system uses **Inter** as the primary typeface. It is highly legible, modern, and objective, keeping the focus on the user's content and the environmental impact metrics.

## Layout & Components
- **Cards:** All listings and dashboard widgets are housed in white cards with subtle borders (`{colors.hairline}`) and an 8px or 12px border radius. Shadows are kept minimal to maintain a flat, modern appearance.
- **Buttons:** Primary buttons are solidly filled with Eco Green. Secondary buttons use a white background with a hairline border.
- **Badges:** Small, rounded pills used to display item conditions (e.g. "Working", "Needs Repair") and status tags ("Available", "Donated").

## Imagery
Imagery focuses on clean, well-lit photos of electronics, community engagement, and environmental metrics. Icons are outlined and straightforward (e.g., Lucide React icons).
