# Design Brief

## Direction

Carol's Adventures — A story-driven pixel-art arcade game with synthwave visual identity and emotional narrative about long-distance love.

## Tone

Retro arcade meets synthwave — bold neon contrast, minimal clutter, dramatic lighting, nostalgic yet modern, grounded (no bouncy animations).

## Differentiation

Neon glow effects on UI with scanline textures, portrait-optimized canvas overlay, and emotional story moments between flights.

## Color Palette

| Token         | OKLCH           | Role                             |
| ------------- | --------------- | -------------------------------- |
| background    | 0.08 0.01 260   | Deep synthwave dark (near black) |
| foreground    | 0.95 0.02 255   | Off-white text                   |
| primary       | 0.56 0.26 330   | Neon pink accent (#FF1493)       |
| secondary     | 0.91 0.26 200   | Electric blue (#00FFFF)          |
| accent        | 0.97 0.31 100   | Neon yellow (#FFFF00)            |
| muted         | 0.25 0.03 260   | Dark UI element backgrounds      |
| destructive   | 0.56 0.26 330   | Neon pink (danger/alert)         |
| border        | 0.20 0.03 260   | Subtle UI dividers               |

## Typography

- Display: Space Grotesk — geometric, tech-forward, retro-modern arcade feel
- Body: General Sans — clean, readable, minimal distraction
- Mono: JetBrains Mono — score/stats display
- Scale: hero `text-4xl md:text-5xl font-bold`, h2 `text-2xl font-bold`, label `text-xs font-semibold`, body `text-base`

## Elevation & Depth

Minimal shadows; depth via color contrast and layer separation. Dark card backgrounds with neon accent borders, no soft blur-based elevation.

## Structural Zones

| Zone    | Background                | Border              | Notes                                |
| ------- | ------------------------- | ------------------- | ------------------------------------ |
| Header  | `bg-muted` with neon line | `border-b border-primary` | Game title, level indicator          |
| Canvas  | `bg-background`           | `border-2 border-accent` | Mini-game overlay, portrait 480x800  |
| Status  | `bg-card`                 | —                   | Health/stability bar, score overlay  |
| Dialogs | `bg-popover`              | `border border-primary` | Story dialogue and choice boxes      |
| Footer  | `bg-muted`                | `border-t border-secondary` | Continue/restart buttons             |

## Spacing & Rhythm

Dense mobile-first layout with 12px, 16px, 24px gaps between sections. Micro-spacing 4px within components. Alternating `bg-muted/50` and `bg-card` for visual rhythm.

## Component Patterns

- Buttons: neon pink (`bg-primary text-primary-foreground`) with `.tap-feedback` active state (scale 0.95), 8px rounded corners
- Cards: `bg-card border border-primary/50` with minimal shadow, crisp edges
- Status bars: `bg-secondary` for health, `bg-accent` for danger, animated width transitions

## Motion

- Entrance: 0.3s fade-in via `opacity-0 → opacity-100` on story scenes
- Hover: 0.2s scale and color shift on interactive buttons
- Decorative: Subtle scanline overlay, no bouncy animations

## Constraints

- Portrait mode only (480x800px effective canvas)
- No external gradients; use color tokens and scanline texture only
- Tap feedback must be immediate (0.15s) for arcade feel
- All interactive elements ≥44px for mobile touch targets

## Signature Detail

Neon pink glow text on UI buttons and story titles, paired with scanline texture overlay — creates retro arcade authenticity while maintaining emotional narrative moments.
