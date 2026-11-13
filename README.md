# SoloCRM — Obsidian Cyber-Glass Operator OS

A dark-themed, liquid-glass frontend dashboard built for elite freelance developers, designers, and operators. Built with **Next.js (App Router)**, **React**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, **Lucide React**, and **Recharts**.

---

## Aesthetic System: The Liquid Glass Masterclass

1. **Ultra-Dark Void Base**: Pitch-dark obsidian canvas (`#050505` / `#08080a`) with soft ambient emerald radial glows (`rgba(0, 255, 102, 0.06)`).
2. **Hyper-Realistic Liquid Glass**:
   - **Backdrop Blur & Translucency**: `backdrop-blur-2xl bg-white/[0.03]`
   - **Internal Gradient Mesh**: `bg-gradient-to-br from-white/[0.05] via-transparent to-transparent`
   - **Specular Edge Lighting**: Inset top-edge highlight (`shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]`) mimicking refracted light on thick beveled glass.
   - **Hairline Borders**: `border border-white/[0.08]`
   - **Depth**: `shadow-2xl shadow-black/50`
3. **Cyber Accents**: Vibrant neon emerald signals (`#00FF66` & `#4edea3`) with luminous volumetric glow (`shadow-[0_0_20px_-3px_rgba(0,255,102,0.45)]`).
4. **Precision Typography**: Geometric **Plus Jakarta Sans** for large numeric metrics (with `tabular-nums`) and **Inter** for readable interface typography.

---

## Component Architecture

- `components/ui/GlassCard.tsx`: Reusable liquid glass container encapsulating blur, specular rim, mesh, and optional neon glow.
- `components/ui/StatBlock.tsx`: Top KPI metric blocks with dynamic sparklines and client avatar clusters.
- `components/dashboard/Sidebar.tsx`: Docked navigation featuring Framer Motion `layoutId="sidebar-active-pill"` for physical sliding pill transitions, plus user profile card.
- `components/dashboard/Header.tsx`: Glass header with quick search (`⌘K`), active notification bell, primary cyber CTA, greeting, and target velocity telemetry.
- `components/dashboard/RevenueChart.tsx`: Recharts responsive area chart with period toggles (Weekly, Monthly, Quarterly), luminous gradient area fill, and sub-metric performance stats.
- `components/dashboard/RecentActivity.tsx`: Chronological stream of recent milestones, payments, contracts, and deliverables.
- `components/dashboard/QuickActions.tsx`: Shortcut action tiles and live interactive billable session timer.
- `components/dashboard/ActiveDeadlines.tsx`: Progress tracking for deliverables and monthly financial quota.

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the live dashboard.

