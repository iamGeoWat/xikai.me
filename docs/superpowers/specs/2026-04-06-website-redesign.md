# xikai.me Redesign Spec

## Intent
Replace the generic nextjs-notion-starter-kit template with a custom-built personal site that reflects Kai's aesthetic: international/Swiss design rigor + Eastern restraint + generative visual warmth. An engineer's site with taste.

## Pages

### Landing (`/`)
- Full-viewport hero with a WebGL shader background (generative noise field / flowing particles / geometric morph), responding to mouse position and evolving over time
- Overlaid: site title `xikai()` in large sans-serif type
- Below title: entry links — `writing` · `projects` · `photos` · `about`
- No navbar, no scroll. A single-screen portal
- Color: dark base (~#0a0a0a) with subtle animated light/color from the shader. Or inverted: light base with dark shader lines. Decide during implementation based on what looks better
- Shader loads asynchronously; page renders immediately with a solid background, shader fades in

### Writing (`/writing`)
- Article list: minimal — title + date per row, no cards, no cover images, monospace or sans-serif, sorted by date descending
- Article detail (`/writing/[slug]`): custom Markdown renderer, ~680px reading width, serif body font, generous line-height (~1.8), ample vertical spacing between blocks
- Content source: Notion API → blocks → custom React components
- Supported Notion blocks: paragraph, headings (h1-h3), bulleted/numbered list, code, image, quote, callout, divider, bookmark. Unsupported blocks render as plain text fallback
- Light scroll-based micro-animations on headings (fade-in on enter)

### Projects (`/projects`)
- Grid of project cards: project name + one-line description + external link
- Hover: subtle translate-y shift + opacity change
- Content source: a Notion database (existing "projects" page), queried via Notion API
- Each card links externally (GitHub, App Store, etc.) — no detail pages needed initially

### Photos (`/photos`)
- Large-format photo display, one or two per viewport row
- Scroll-driven: parallax or gentle scale transitions as photos enter/exit viewport
- Photos loaded from Notion (existing "photos" page) or a hardcoded list of image URLs
- No lightbox initially — photos are the layout

### About (`/about`)
- Centered text block, large type
- Content: the few lines already written (engineer at Apple, WWDC winner, builds things with code, links)
- Optional: a subtle breathing background texture or gradient shift

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 14, App Router | Modern routing, RSC support, better than Pages Router for new projects |
| 3D/Visual | @react-three/fiber + @react-three/drei + glsl-noise | Mature React-Three ecosystem, community shaders, good DX |
| CMS | Notion official API (@notionhq/client) | Full control over rendering, no react-notion-x lock-in |
| Styling | Tailwind CSS | Rapid iteration, design-system consistency, purged in prod |
| Fonts | Inter (UI) + serif TBD for body (candidates: Newsreader, Source Serif, Lora) | Inter is clean/neutral for UI; serif for long-form reading comfort |
| Deploy | Vercel | Already configured, zero-config for Next.js |

## Architecture

```
app/
  layout.tsx          — root layout, font loading, Tailwind
  page.tsx            — landing page (hero + shader + links)
  writing/
    page.tsx          — article list
    [slug]/page.tsx   — article detail
  projects/page.tsx   — project grid
  photos/page.tsx     — photo gallery
  about/page.tsx      — about text

components/
  shader/
    HeroScene.tsx     — R3F canvas with shader material
    shaders/          — GLSL fragment/vertex shader files
  notion/
    renderer.tsx      — maps Notion block types to React components
    blocks/           — individual block components (Paragraph, Heading, Code, Image, etc.)
  ui/
    EntryLink.tsx     — landing page link component
    PhotoCard.tsx     — photo with scroll-driven animation
    ProjectCard.tsx   — project grid card
    ArticleRow.tsx    — writing list row

lib/
  notion.ts           — Notion API client, getPage(), getDatabase(), getBlocks()
  types.ts            — shared TypeScript types
```

## Data Flow

1. **Build/request time**: Next.js route calls `lib/notion.ts` to fetch page/database content from Notion API
2. **Notion API returns**: block objects (paragraphs, headings, images, etc.)
3. **Custom renderer**: `components/notion/renderer.tsx` maps each block type to a styled React component
4. **Static generation**: pages are statically generated with ISR (revalidate: 60s) for content freshness
5. **Shader**: loaded client-side only, behind `"use client"` boundary, with lazy loading

## Notion Integration

- Use `@notionhq/client` with an integration token (internal integration)
- Need: `NOTION_TOKEN` env var (Kai to create an internal integration at notion.so/my-integrations and share relevant pages with it)
- Fetch functions:
  - `getPage(pageId)` → page properties + child blocks (recursive for nested blocks)
  - `getDatabase(databaseId)` → list of pages with properties (for blog list, project list)
- Blog Posts database ID: `d7f6f711-e2e9-4288-aa4a-a77013800ab2`
- Projects page ID: `91468021-e9fa-41b9-a840-6f3f777a025e`
- Photos page ID: `b7991dd4-1479-4f52-bb8d-ac3285901388`
- About page ID: `1bc5954a-1068-47c0-8dd1-3f0fba032930`

## Shader Design

- A single generative visual for the landing hero
- Starting point: a noise-based flow field or particle system with subtle color gradients
- Responds to mouse position (gentle distortion / attraction)
- Evolves slowly over time (autonomous animation)
- Performance budget: 60fps on M1 MacBook, graceful fallback (solid background) on low-end devices
- Implementation: ShaderMaterial on a fullscreen plane in R3F, custom fragment shader using simplex/perlin noise from glsl-noise

## Design Tokens

- **Colors**: Near-black bg `#0a0a0a`, off-white text `#e5e5e5`, mid-gray secondary `#737373`, one accent TBD (muted blue or warm neutral)
- **Spacing**: 8px base grid, generous margins (32-64px between sections)
- **Border radius**: 0 everywhere (sharp, rational)
- **Transitions**: 200-300ms ease, no bounce/spring (calm)
- **Max content width**: 680px for reading, 1200px for grids

## What Gets Deleted

- All react-notion-x dependency and related code
- All Pages Router files (`pages/` directory)
- Old CSS files (`styles/notion.css`, `styles/prism-theme.css`, `styles/global.css`)
- Old components that wrap react-notion-x (`NotionPage.tsx`, `PageSocial.tsx`, etc.)
- The `lib/` files that use the unofficial Notion client (`notion-api.ts`, `notion.ts`, `resolve-notion-page.ts`, etc.)

## What Stays

- `site.config.ts` (adapted for new structure)
- Git history
- Vercel deployment config
- Domain configuration

## Requirements from Kai

- Create a Notion internal integration and share relevant pages/databases with it
- Provide the `NOTION_TOKEN` to set as env var (local `.env` and Vercel)

## Out of Scope (for now)

- Search functionality
- RSS feed
- Dark/light mode toggle (start with dark only, matching the shader aesthetic)
- Comments
- Analytics
- i18n
