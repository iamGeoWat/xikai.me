# xikai.me Redesign Spec

## Intent
Replace the generic nextjs-notion-starter-kit template with a custom-built personal site that deeply integrates Apple's Liquid Glass design language via liquidGL, layered over a generative shader background. Navigation and interactive chrome get real WebGL refraction/bevel/specular effects. Content stays clean and unadorned. The result: a site that feels like a native Apple experience rendered on the web.

## Liquid Glass Strategy (per Apple HIG)

**Glass is reserved for the navigation layer.** Following Apple's HIG:
- Glass elements: floating nav pill, entry links on landing, back-navigation, photo captions overlay
- No glass on content: article text, project descriptions, photo grids stay clean
- Never stack glass on glass
- One primary glass sheet per view
- Shapes: capsule (pill) for interactive elements, concentric corner radii for nested containers
- Accessibility: respect `prefers-reduced-transparency` (fall back to solid bg + backdrop-filter blur) and `prefers-reduced-motion` (disable tilt, reduce animations)

**liquidGL integration**: Library loaded from `/public/scripts/liquidGL.js` (no npm package). html2canvas dependency loaded from CDN. All glass elements are client-only via a `LiquidGlass` React wrapper component. The shader hero background serves as the ideal refraction source — colorful, dynamic content visible through the glass.

## Pages

### Landing (`/`)
- Full-viewport: generative shader background (already implemented via R3F + custom GLSL) fills the screen
- Center: site title `xikai()` in large sans-serif, subtitle, social links
- Entry navigation: 4 liquid glass capsule pills — `writing` · `projects` · `photos` · `about` — floating over the shader, each with refraction + bevel + specular. The shader ripples and warps through the glass surface
- Scroll indicator at bottom
- Below the fold: content sections (writing, projects, photos) for a single-page-app feel
- `data-liquid-ignore` on the title text and links to exclude them from the glass snapshot

### Writing (`/writing/[slug]`)
- Reached by clicking from landing page writing section
- Article detail: custom Notion block renderer, ~680px reading width, serif body font, generous line-height
- Floating glass back-nav pill at top: liquid glass capsule with "← xikai()" — fixed position, refracts the article content as user scrolls
- Content itself: no glass, no effects, pure reading experience

### Projects (section on landing page)
- Grid of project cards: project name + one-line description + external link
- Cards are plain (no glass) — clean borders, subtle hover translate
- Section header in muted type

### Photos (section on landing page)
- Masonry/columns layout for photos
- No glass on the photos themselves (HIG: don't glass content)
- Clean, full-bleed presentation

### About (section on landing page or `/about`)
- Centered text block, large type
- Minimal: name, title, one-liner, links

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 14, App Router | Modern routing, RSC, streaming |
| Liquid Glass | liquidGL (vanilla JS) + html2canvas | Real WebGL refraction, Apple-grade glass material |
| Shader Background | @react-three/fiber + custom GLSL | Already implemented, generative noise field |
| CMS | Notion official API (@notionhq/client) | Full rendering control |
| Styling | Tailwind CSS | Design tokens, rapid iteration |
| Fonts | Inter (UI) + Source Serif 4 (body) | Clean UI + comfortable reading |
| Deploy | Vercel | Auto-deploy from GitHub |

## Architecture

```
app/
  layout.tsx              — root layout, fonts, Tailwind, liquidGL script loading
  page.tsx                — single-page: hero + writing + projects + photos + footer
  writing/
    [slug]/page.tsx       — article detail with floating glass back-nav
  about/page.tsx          — standalone about (optional, can also be section)

components/
  glass/
    LiquidGlass.tsx       — "use client" wrapper: initializes liquidGL on a target element
    GlassNav.tsx          — floating glass navigation pill (back button, page title)
    GlassPill.tsx         — glass capsule button for entry links
  shader/
    HeroScene.tsx         — R3F canvas with noise shader (already built)
    hero.frag             — fragment shader (already built)
    hero.vert             — vertex shader (already built)
  notion/
    renderer.tsx          — Notion block → React component mapper
    blocks/               — Paragraph, Heading, Code, Image, Quote, Callout, Divider, Bookmark
  ui/
    ArticleRow.tsx        — writing list row
    ProjectCard.tsx       — project grid card

lib/
  notion.ts               — Notion API client
  config.ts               — site config (IDs, metadata)
  types.ts                — shared types

public/
  scripts/
    liquidGL.js           — liquidGL library (downloaded from repo)
```

## Liquid Glass Component Design

### `LiquidGlass.tsx` — Core Wrapper
- Client component that wraps any element in a liquidGL-enabled container
- Handles script loading (html2canvas + liquidGL.js) with `next/script`
- Configurable props: `refraction`, `bevelDepth`, `bevelWidth`, `frost`, `specular`, `shadow`, `tilt`, `reveal`
- Graceful fallback: if WebGL unavailable or `prefers-reduced-transparency`, use `backdrop-filter: blur(12px)` with semi-transparent background
- Cleanup on unmount

### `GlassPill.tsx` — Entry Links
- Capsule-shaped (pill) container with liquidGL applied
- Fixed position on landing page, floats over the shader hero
- Props: `href`, `children`
- liquidGL config: `refraction: 0.02`, `bevelDepth: 0.08`, `bevelWidth: 0.05`, `frost: 0`, `specular: true`, `shadow: true`, `tilt: true` (subtle, tiltFactor: 3)
- Size: auto from content, min-height for touch target (44px per Apple HIG)

### `GlassNav.tsx` — Floating Back Navigation
- Fixed-position pill at top of article pages
- Shows "← xikai()" or "← writing"
- liquidGL config: `refraction: 0.015`, `frost: 8`, `specular: true`, `shadow: true`
- Appears after 100px scroll, fades in
- `data-liquid-ignore` on the text inside

## Design Tokens (revised)

- **Colors**: Near-black bg `#0a0a0a`, off-white text `#e5e5e5`, mid-gray `#737373`
- **Glass surfaces**: ~15-20% white opacity base, no border (bevel handles edges)
- **Spacing**: 8px grid, generous margins (32-64px)
- **Border radius**: Capsule (9999px) for glass pills, 12px for cards, 0 for content blocks
- **Transitions**: 200-300ms ease, no bounce
- **Touch targets**: Minimum 44px height (Apple HIG)
- **Max content width**: 680px reading, 1200px grids

## Shader Design (unchanged)
- Generative noise field background for landing hero
- Responds to mouse position
- Evolves over time
- Already implemented and tuned

## Data Flow (unchanged)
1. Next.js routes fetch from Notion API at build/request time
2. Custom renderer maps blocks to React components
3. ISR with 60s revalidate
4. liquidGL and shader are client-only, loaded after hydration

## Accessibility

- `prefers-reduced-transparency`: liquidGL falls back to CSS `backdrop-filter: blur(12px)` with solid-ish background
- `prefers-reduced-motion`: disable shader animation, disable tilt on glass, reduce transition durations
- Minimum 4.5:1 contrast ratio on all text (text never directly on glass without solid backing)
- All interactive elements have ≥44px touch target

## Notion Integration (unchanged)
- `@notionhq/client` with `NOTION_TOKEN` env var
- Blog Posts DB: `d7f6f711-e2e9-4288-aa4a-a77013800ab2`
- Projects page: `91468021-e9fa-41b9-a840-6f3f777a025e`
- Photos page: `b7991dd4-1479-4f52-bb8d-ac3285901388`
- About page: `1bc5954a-1068-47c0-8dd1-3f0fba032930`

## What Gets Deleted
- All react-notion-x dependency and related code
- All Pages Router files (`pages/` directory)
- Old CSS files and components

## Out of Scope
- Search, RSS, comments, analytics, i18n
- Dark/light mode toggle (dark only, optimized for glass + shader)
- Multiple glass sheets per view (HIG: one primary)
