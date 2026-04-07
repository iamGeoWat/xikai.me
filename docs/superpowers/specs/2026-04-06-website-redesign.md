# xikai.me Redesign Spec

## Intent
Replace the generic nextjs-notion-starter-kit template with a custom-built personal site that deeply integrates Apple's Liquid Glass design language via liquidGL. The hero background is a dense typographic matrix (monospace symbols, code fragments, emoji) with scattered oversized keywords — all pure DOM/CSS, perfectly capturable by html2canvas. Liquid glass pills float over this texture, refracting and warping the characters through them. The glass IS the visual centerpiece. Content stays clean.

## Visual Concept: Symbol Matrix + Scattered Type

The landing hero background is a full-viewport layer of:

**Symbol Matrix (primary):**
- Dense monospace grid of characters: code symbols (`{}`, `=>`, `//`, `&&`, `0x`, `fn`), math notation (`∑`, `∂`, `∫`, `π`, `∞`), unicode blocks (`░`, `▓`, `█`, `◆`, `●`), emoji (`📷`, `🍎`, `⌘`, `✦`), and short code fragments
- Very low opacity (~0.06-0.12), varied sizes (0.6rem-1.2rem), slight rotation variance
- Monospace font (system or SF Mono), muted neutral colors on #0a0a0a background
- Static — no animation needed. The glass pills bring them to life through refraction

**Scattered Keywords (accent):**
- 5-8 oversized words placed at angles across the viewport: `code`, `curiosity`, `build`, `xikai`, `WWDC`, `∞`
- Very large (8-15vw), extremely low opacity (~0.03-0.05), rotated
- Provides large-scale shape variation for the glass to refract — you barely see the words directly, but through the glass they warp and become visible

**Why this works for liquidGL:**
- 100% DOM content → html2canvas captures it perfectly
- High character density = rich refraction texture (every glass pill shows warped symbols)
- Low opacity = doesn't compete with foreground UI
- No JS, no canvas, no WebGL for the background — liquidGL is the only WebGL on the page
- Very lightweight, loads instantly

## Liquid Glass Strategy (per Apple HIG)

**Glass is reserved for the navigation layer.** Following Apple's HIG:
- Glass elements: entry links on landing (capsule pills), floating back-nav on article pages
- No glass on content: article text, project descriptions, photo grids stay clean
- Never stack glass on glass
- One primary glass sheet per view
- Shapes: capsule (pill) for interactive elements
- Accessibility: respect `prefers-reduced-transparency` (fall back to CSS backdrop-filter) and `prefers-reduced-motion` (disable tilt)

**liquidGL integration**: Library loaded from `/public/scripts/liquidGL.js`. html2canvas from CDN. All glass elements are client-only. The symbol matrix background is the refraction source.

## Pages

### Landing (`/`)
- Full-viewport hero: symbol matrix + scattered keywords as background layer (CSS positioned div behind everything)
- Center: site title in large sans-serif, one-liner subtitle, social links
- Entry navigation: 4 liquid glass capsule pills — `writing` · `projects` · `photos` · `about` — refracting the symbol matrix through them
- Scroll indicator at bottom
- Below the fold: content sections (writing, projects, photos)
- `data-liquid-ignore` on foreground text to exclude from glass snapshot

### Writing (`/writing/[slug]`)
- Article detail: custom Notion block renderer, ~680px, serif body, generous line-height
- Floating glass back-nav pill at top (appears on scroll), refracting article content beneath it
- Content: no glass, pure reading experience

### Projects (section on landing)
- Grid of plain project cards: name + description + external link
- Subtle hover: translate-y + border color shift
- No glass

### Photos (section on landing)
- Masonry/columns layout, large photos
- No glass, no effects — photos speak for themselves

### About (section on landing)
- Centered text, large type
- Name, title, one-liner, links

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 14, App Router | Modern, RSC, streaming |
| Liquid Glass | liquidGL + html2canvas | Real WebGL refraction on DOM content |
| Background | Pure CSS/HTML (symbol matrix) | Zero JS, html2canvas-friendly, fast |
| CMS | Notion official API (@notionhq/client) | Full rendering control |
| Styling | Tailwind CSS | Design tokens, rapid iteration |
| Fonts | Inter (UI) + Source Serif 4 (body) + JetBrains Mono (matrix) | Clean UI + reading + code aesthetic |
| Deploy | Vercel | Auto-deploy |

**Removed:** @react-three/fiber, three, @react-three/drei, glsl-noise — no shader needed.

## Architecture

```
app/
  layout.tsx              — root layout, fonts, Tailwind, liquidGL scripts
  page.tsx                — single-page: hero + content sections
  globals.css             — Tailwind + glass fallbacks
  writing/
    [slug]/page.tsx       — article detail with glass back-nav

components/
  glass/
    GlassPills.tsx        — "use client": initializes liquidGL on entry nav pills
    GlassNav.tsx          — "use client": floating back-nav pill for articles
  hero/
    SymbolMatrix.tsx      — the background matrix of characters/symbols/emoji
    ScatteredWords.tsx    — oversized low-opacity keywords
  notion/
    renderer.tsx          — Notion block → React mapper
    blocks/               — Paragraph, Heading, Code, Image, Quote, Callout, Divider, Bookmark
  ui/
    ProjectCard.tsx       — plain project card

lib/
  notion.ts               — Notion API client
  config.ts               — site config
  types.ts                — shared types

public/
  scripts/
    liquidGL.js           — liquidGL library
```

## Design Tokens

- **Colors**: bg `#0a0a0a`, fg `#e5e5e5`, muted `#737373`, matrix chars `#e5e5e5` at 6-12% opacity, scattered words at 3-5% opacity
- **Fonts**: Inter (UI), Source Serif 4 (reading), JetBrains Mono (symbol matrix)
- **Border radius**: pill (9999px) for glass, 0 for content
- **Touch targets**: 44px minimum
- **Transitions**: 200-300ms ease
- **Max width**: 680px reading, 1200px grids

## Accessibility
- `prefers-reduced-transparency`: glass falls back to CSS `backdrop-filter: blur(12px)`
- `prefers-reduced-motion`: disable tilt on glass
- 4.5:1 contrast on all readable text
- Symbol matrix is decorative (aria-hidden)

## Notion Integration (unchanged)
- Blog Posts DB: `d7f6f711-e2e9-4288-aa4a-a77013800ab2`
- Projects page: `91468021-e9fa-41b9-a840-6f3f777a025e`
- Photos page: `b7991dd4-1479-4f52-bb8d-ac3285901388`
- About page: `1bc5954a-1068-47c0-8dd1-3f0fba032930`

## Out of Scope
- Search, RSS, comments, analytics, i18n
- Dark/light toggle (dark only)
- Three.js / WebGL shader background (replaced by symbol matrix)
