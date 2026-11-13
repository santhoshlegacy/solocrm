---
name: Obsidian Cyber-Glass
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1c1b1e'
  surface-container: '#201f22'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#b9ccb5'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#313032'
  outline: '#849581'
  outline-variant: '#3b4b3a'
  surface-tint: '#00e55b'
  primary: '#edffe8'
  on-primary: '#003911'
  primary-container: '#00ff66'
  on-primary-container: '#007128'
  inverse-primary: '#006e27'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#ebfff4'
  on-tertiary: '#003829'
  tertiary-container: '#abebd1'
  on-tertiary-container: '#2e6c57'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6bff83'
  primary-fixed-dim: '#00e55b'
  on-primary-fixed: '#002107'
  on-primary-fixed-variant: '#00531b'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#b0f0d6'
  tertiary-fixed-dim: '#95d3ba'
  on-tertiary-fixed: '#002117'
  on-tertiary-fixed-variant: '#0b513d'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.025em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  metric-numeral:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 36px
    letterSpacing: -0.03em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies high-leverage solopreneurship and disciplined financial velocity. Designed specifically for elite independent operators, developers, and agency owners who demand total clarity and high visual reward, the aesthetic sits at the intersection of technical cyber-minimalism and luxurious liquid-glass surfaces.

The emotional signature is deep focus, mechanical precision, and prestige. Rather than the generic gray backgrounds of conventional SaaS platforms, the interface adopts a zero-distraction, pitch-black void punctuated by laser-sharp neon emerald signals, refractive frosted panels, and luminous micro-telemetry.

## Colors

The color palette centers on an obsidian canvas structured to conserve cognitive bandwidth while maximizing the visual pop of mission-critical data.

- **Canvas & Obsidian Bases**:
  - Root viewport: `#08080A`
  - Elevated surfaces / card backgrounds: Frosted layers between `rgba(255, 255, 255, 0.02)` and `rgba(255, 255, 255, 0.05)`
  - Contrast borders: Subtle hairline strokes using `rgba(255, 255, 255, 0.08)` to `rgba(255, 255, 255, 0.12)`
- **Cyber Accents**:
  - Primary Highlight (`#00FF66`): Reserved strictly for primary calls-to-action, net revenue metrics, active pipeline pulses, and conversion triggers.
  - Secondary Velocity (`#10B981`): Used for stable states, secondary data trends, badges, and positive micro-charts.
  - Deep Emerald Anchor (`#064E3B`): Used for active tab backplates, subtle radial glow backdrops, and muted interactive states.
- **Text & Hierarchy**:
  - High-emphasis values: `#FFFFFF`
  - Secondary labels & table text: `#9CA3AF`
  - Muted timestamps & meta-properties: `#4B5563`

## Typography

Typography delivers immediate scannability through a dual-type pairing:

- **Plus Jakarta Sans** leads all display headlines, key summary headers, and monetary data metrics. Its tight geometric curves provide authority and momentum to numeric figures. Numerals must always use tabular figures (`font-variant-numeric: tabular-nums`) to maintain vertical parity across client invoice lines and revenue counters.
- **Inter** commands all functional UI elements, metadata, data tables, and input controls. With neutral tracking and optimized vertical metrics, it guarantees legibility against dark translucent cards.
- Label styles utilize uppercase transformation with letter-spacing tracking (`0.04em` to `0.05em`) to balance against large, saturated metric blocks.

## Layout & Spacing

The structural layout utilizes an adaptive fluid grid within a constrained maximum shell of `1440px`.

- **Desktop (1024px+)**: 12-column grid with `1.5rem` (`24px`) gutters and `2rem` (`32px`) margins. Sidebars remain docked in a fixed-width `280px` glass pillar, allowing dashboard widgets to distribute in dynamic 3, 4, 6, or 12-column blocks.
- **Tablet (768px - 1023px)**: 8-column grid with `1.25rem` (`20px`) gutters and `1.5rem` (`24px`) margins. Sidebar collapses to an icon bar or drawer.
- **Mobile (< 768px)**: 4-column grid with `1rem` (`16px`) gutters and `1rem` (`16px`) margins. Metric clusters stack vertically into full-width micro-cards.

Internal card rhythm relies on the 4px baseline scale: inputs and badges conform to `space-xs` and `space-sm` insets, standard cards employ `space-lg` internal padding, and section groupings separate across `space-xl` spans.

## Elevation & Depth

Visual hierarchy is maintained via stacked frosted translucency and localized neon radiance, rather than heavy opaque drop shadows.

- **Frosted Glassmorphism**: Cards and floating panels utilize `backdrop-filter: blur(24px)` combined with layered fills (`rgba(255, 255, 255, 0.03)`). Each panel receives a continuous hairline border: `1px solid rgba(255, 255, 255, 0.08)`.
- **Top Rim Lighting**: Cards feature an inset top-edge highlight using an inner shadow: `inset 0 1px 1px 0 rgba(255, 255, 255, 0.12)`, mimicking light striking the bevel of thick glass.
- **Luminescent Glows**: High-emphasis elements cast colored volumetric light:
  - Primary button hover: `box-shadow: 0 0 20px -3px rgba(0, 255, 102, 0.45)`
  - Active pipeline cards: `box-shadow: inset 0 0 12px 0 rgba(0, 255, 102, 0.06), 0 8px 32px -4px rgba(0, 0, 0, 0.6)`
  - Background radial anchors: Ambient soft gradients (`radial-gradient(circle at 50% 0%, rgba(0, 255, 102, 0.05) 0%, transparent 60%)`) placed beneath primary hero metrics.

## Shapes

The design system standardizes on modern rounded corners that soften the dark, high-contrast palette without feeling overly bubbly or informal.

- Interactive buttons, form inputs, and status badges take the baseline `rounded` geometry (`0.5rem` / `8px`).
- KPI metrics, charts, tables, and invoice preview cards scale to `rounded-lg` (`1rem` / `16px`).
- Modal overlays, bottom sheets, and major viewport segments scale to `rounded-xl` (`1.5rem` / `24px`).
- Badges and status pills strictly retain full radial caps (`9999px`) to maintain immediate differentiation from action buttons.

## Components

### Buttons
- **Primary Cyber Action**: Solid `#00FF66` background with `#08080A` high-contrast typography, semibold weight. Borderless, with an active state glow (`box-shadow: 0 0 16px rgba(0, 255, 102, 0.4)`).
- **Secondary Glass Button**: Frosted translucent backplate (`rgba(255, 255, 255, 0.05)`), border `1px solid rgba(255, 255, 255, 0.12)`, text `#FFFFFF`. Hover reveals an emerald edge shift (`border-color: #00FF66`).

### Input Fields & Controls
- **Text Inputs**: Flat charcoal surface (`rgba(255, 255, 255, 0.02)`) with a subtle `1px solid rgba(255, 255, 255, 0.08)` border. On focus, the field casts an emerald rim glow (`box-shadow: 0 0 0 1px #00FF66, 0 0 12px rgba(0, 255, 102, 0.15)`). Placeholder text is tinted `#4B5563`.
- **Checkboxes & Radios**: Boxed obsidian elements that toggle to `#00FF66` fill with an interior `#08080A` mark when active.

### Cards & KPI Tiles
- Encased in `backdrop-blur-xl`, with background set to `rgba(255, 255, 255, 0.03)` and hairline stroke `rgba(255, 255, 255, 0.08)`.
- KPI Tiles contain a small, uppercase category label (`label-sm`), followed by a bold oversized value (`metric-numeral`), coupled with an inline micro-badge signaling percentage delta.

### Status Badges & Chips
- Fully rounded pills (`padding: 2px 8px`).
- High-priority / Active: Background `rgba(0, 255, 102, 0.12)`, border `1px solid rgba(0, 255, 102, 0.3)`, text `#00FF66`. Features an inline animated `4px` emerald pulsing dot.
- Pending / Neutral: Background `rgba(255, 255, 255, 0.04)`, border `1px solid rgba(255, 255, 255, 0.1)`, text `#9CA3AF`.

### Micro-Charts
- Integrated sparklines inside metric cards feature high-velocity vector paths: `2px` stroke in `#00FF66` backed by a vertical gradient fill tapering from `rgba(0, 255, 102, 0.2)` down to `transparent`.
- Tooltip crosshairs highlight data nodes via small glowing white anchor circles surrounded by an emerald halo.