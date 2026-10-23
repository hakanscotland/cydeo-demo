---
name: PINT FC Design System
description: Grassroots Football Club matchday attendance and team portal
colors:
  primary: "#1B4D3E"
  primary-dark: "#0F2F24"
  accent-gold: "#B38F22"
  bg-page: "#F8FAFC"
  bg-surface: "#FFFFFF"
  border: "#E2E8F0"
  text-main: "#0F172A"
  text-muted: "#64748B"
  status-going: "#15803D"
  status-maybe: "#B45309"
  status-not: "#B91C1C"
typography:
  display:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "clamp(2rem, 5vw, 2.75rem)"
    fontWeight: 900
    lineHeight: 1.15
  heading:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 1.25
  body:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.bg-surface}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  badge-cutoff-open:
    backgroundColor: "{colors.status-going}"
    textColor: "{colors.bg-surface}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
  badge-cutoff-closed:
    backgroundColor: "{colors.status-not}"
    textColor: "{colors.bg-surface}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
---

## Overview

The PINT FC visual system embodies the spirit of grassroots British football: proud, athletic, unpretentious, and built for immediate readability in high-stakes matchday moments (from pitchside smartphones in rainy weather to sunny pub projector screens). It strictly implements Look B ("Sport" light theme) with deep forest greens, crisp warm white surfaces, and rich athletic gold accents.

## Colors

- **Club Green (`#1B4D3E`)**: The primary brand anchor, used for headers, primary action buttons, and prominent identity elements. Achieves 9.3:1 contrast against white.
- **Club Dark (`#0F2F24`)**: Deepest forest green used for hero cards, scoreboards, and projector containers. Provides 14.8:1 contrast against white.
- **Accent Gold (`#B38F22`)**: Athletic achievement color used for squad numbers, highlights, and secondary badges. Always paired with dark text (`#0F172A`) to ensure >5:1 WCAG AA contrast.
- **Status Going (`#15803D`)**: High-visibility confirmation green for positive attendance and winning outcomes.
- **Status Maybe (`#B45309`)**: Amber/gold for uncertain availability.
- **Status Not Going (`#B91C1C`)**: Bold red for unavailable status and cutoff expiration alerts.

## Typography

- **Scale & Weight**: Bold, punchy weights (700, 800, 900) for club headers and match counters.
- **Tabular Figures**: Tabular numeral font variant (`tabular-nums`) for scores, countdown clocks, and scoreboard tallies to prevent visual jitter.
- **Fluid Sizing**: Utilizes `clamp()` for responsive hero titles and counters without breaking 320px viewport constraints.

## Layout

- **Desktop**: Max container width of 1000px, centered with 2-column dashboard widgets (Season Record alongside League Table Snapshot).
- **Mobile (320px+)**: Fully fluid responsive grid reflow. Zero horizontal scrolling with `box-sizing: border-box` on every container.

## Elevation & Depth

- **Clean Surface Architecture**: Crisp white cards (`#FFFFFF`) with subtle 1px slate borders (`#E2E8F0`) and soft ambient shadows (`0 2px 4px rgba(0,0,0,0.04)`).
- **No Over-Nesting**: Avoids nested card-inside-card anti-patterns; uses clean row dividers and semantic spacing instead.

## Shapes

- **Border Radius**: Consistent 6px (inputs, badges), 8px (buttons, player cards), and 12px (major section containers).
- **Pills**: Fully rounded (9999px) for cutoff status and outcome badges.

## Components

- **Next Match Hero**: High-contrast match announcement with kickoff countdown and direct event navigation.
- **Scoreboard Counters**: Three-column attendance summary (Going, Maybe, Not Going) optimized for large-scale projector display.
- **RSVP Action Box**: Single-tap attendance submission with private captain note field.
- **Squad Grid**: Clean 4-column positional grouping with verified photo consent handling.

## Do's and Don'ts

### Do's
- Always maintain WCAG 2.1 AA contrast ratios (minimum 4.5:1 for normal text, 3:1 for large text).
- Use `tabular-nums` on countdowns, clock ticks, and attendance figures.
- Use dark text on gold backgrounds for accessibility compliance.
- Keep matchday coordinates immediately actionable above the fold.

### Don'ts
- Do not use floating radial glow haze behind cards or headers.
- Do not nest bordered card containers inside other bordered cards.
- Do not expose private RSVP notes to teammate rosters.
- Do not show unconsented photos or unverified minors on public views.
