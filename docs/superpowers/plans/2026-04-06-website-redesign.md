# xikai.me Redesign Implementation Plan (v3 — Liquid Glass + Symbol Matrix)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild xikai.me with liquidGL glass pills floating over a dense typographic symbol matrix. Glass IS the visual centerpiece. No Three.js — background is pure DOM, perfectly captured by html2canvas for refraction.

**Architecture:** Next.js 14 App Router, Tailwind CSS, liquidGL for glass effects, Notion official API for content. Symbol matrix background rendered as static HTML/CSS. Glass pills refract the matrix through them.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, liquidGL, @notionhq/client, JetBrains Mono

**Spec:** `docs/superpowers/specs/2026-04-06-website-redesign.md`

---

## File Structure

```
app/
  layout.tsx              — root layout: fonts (Inter, Source Serif 4, JetBrains Mono), Tailwind, liquidGL scripts
  page.tsx                — single-page: hero + writing + projects + photos
  globals.css             — Tailwind + glass fallbacks
  writing/
    [slug]/page.tsx       — article detail with glass back-nav

components/
  glass/
    GlassPills.tsx        — "use client": entry nav pills with liquidGL
    GlassNav.tsx          — "use client": floating back-nav for articles
  hero/
    SymbolMatrix.tsx      — dense monospace character grid
    ScatteredWords.tsx    — oversized low-opacity keywords
  notion/
    renderer.tsx          — Notion block → React component mapper
    blocks/
      Paragraph.tsx
      Heading.tsx
      BulletedList.tsx
      NumberedList.tsx
      Code.tsx
      Image.tsx
      Quote.tsx
      Callout.tsx
      Divider.tsx
      Bookmark.tsx
  ui/
    ProjectCard.tsx       — plain project card

lib/
  notion.ts
  config.ts
  types.ts

public/scripts/liquidGL.js
tailwind.config.ts
postcss.config.mjs
next.config.mjs
```

---

### Task 1: Scaffold — App Router + Tailwind + liquidGL + fonts

**Files:**
- Delete: `pages/`, `styles/`, old `components/*` (keep `components/shader/` for now, remove later), old `lib/*`, `site.config.ts`, `next.config.js`
- Create: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `next.config.mjs`
- Create: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `app/shader.d.ts`

- [ ] **Step 1: Write package.json**

```json
{
  "name": "xikai.me",
  "version": "2.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "@notionhq/client": "^2.2.15",
    "next": "^14.2.35",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.13",
    "typescript": "^5.6.0"
  }
}
```

Note: No Three.js, no @react-three/* — major bundle reduction.

- [ ] **Step 2: Delete old files**

```bash
rm -rf pages/ styles/ components/ lib/
rm -f site.config.ts next.config.js
```

- [ ] **Step 3: Create next.config.mjs**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.notion.so' },
      { protocol: 'https', hostname: 'notion.so' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 's3.us-west-2.amazonaws.com' },
      { protocol: 'https', hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      {
        source: '/resume',
        destination: 'https://drive.google.com/file/d/1vDNRGYird41cEnu8WIMDNabUQuELGvRH',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
```

- [ ] **Step 4: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "es2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 5: Create tailwind.config.ts**

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0a',
        fg: '#e5e5e5',
        muted: '#737373',
      },
      maxWidth: {
        reading: '680px',
        grid: '1200px',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-source-serif)', 'Georgia', 'serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      borderRadius: {
        pill: '9999px',
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 6: Create postcss.config.mjs**

```js
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

export default config
```

- [ ] **Step 7: Create app/globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-bg text-fg antialiased;
  }

  ::selection {
    @apply bg-fg/20;
  }
}

/* Liquid Glass CSS fallback */
.liquid-glass-fallback {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px) saturate(140%);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

@media (prefers-reduced-transparency: reduce) {
  .liquid-glass-fallback {
    background: rgba(255, 255, 255, 0.15) !important;
    backdrop-filter: blur(16px) saturate(160%);
  }
}
```

- [ ] **Step 8: Create app/layout.tsx**

```tsx
import type { Metadata } from 'next'
import { Inter, Source_Serif_4, JetBrains_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'xikai()',
  description: 'Software engineer at Apple.',
  metadataBase: new URL('https://xikai.me'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${sourceSerif.variable} ${jetbrains.variable}`}>
      <body className="font-sans">
        {children}
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="/scripts/liquidGL.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
```

- [ ] **Step 9: Create placeholder app/page.tsx**

```tsx
export default function Home() {
  return (
    <main className="flex h-screen items-center justify-center">
      <h1 className="text-4xl font-light tracking-tight">xikai()</h1>
    </main>
  )
}
```

- [ ] **Step 10: Install and build**

```bash
npm install --legacy-peer-deps
npx next build
```

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: scaffold App Router + Tailwind + liquidGL, remove old code"
```

---

### Task 2: Site config + Notion API client

**Files:** `lib/config.ts`, `lib/types.ts`, `lib/notion.ts`

- [ ] **Step 1: Create lib/config.ts**

```ts
export const siteConfig = {
  name: 'xikai()',
  domain: 'xikai.me',
  author: 'Xikai Liu',
  description: 'Software engineer at Apple.',
  github: 'iamGeoWat',
  linkedin: 'xikai-liu',
  blogDatabaseId: 'd7f6f711-e2e9-4288-aa4a-a77013800ab2',
  projectsPageId: '91468021-e9fa-41b9-a840-6f3f777a025e',
  photosPageId: 'b7991dd4-1479-4f52-bb8d-ac3285901388',
  aboutPageId: '1bc5954a-1068-47c0-8dd1-3f0fba032930',
} as const
```

- [ ] **Step 2: Create lib/types.ts**

```ts
export interface BlogPost {
  id: string
  title: string
  slug: string
  description: string
  published: string | null
  tags: string[]
}

export interface Project {
  title: string
  description: string
  url: string | null
}
```

- [ ] **Step 3: Create lib/notion.ts**

```ts
import { Client } from '@notionhq/client'
import type { BlogPost } from './types'
import { siteConfig } from './config'

const notion = new Client({ auth: process.env.NOTION_TOKEN })

export async function getBlogPosts(): Promise<BlogPost[]> {
  const response = await notion.databases.query({
    database_id: siteConfig.blogDatabaseId,
    filter: { property: 'Public', checkbox: { equals: true } },
    sorts: [{ property: 'Published', direction: 'descending' }],
  })

  return response.results.map((page: any) => {
    const props = page.properties
    return {
      id: page.id,
      title: props.Name?.title?.[0]?.plain_text ?? 'Untitled',
      slug: props.Slug?.rich_text?.[0]?.plain_text ?? page.id,
      description: props.Description?.rich_text?.[0]?.plain_text ?? '',
      published: props.Published?.date?.start ?? null,
      tags: props.Tags?.multi_select?.map((t: any) => t.name) ?? [],
    }
  })
}

export async function getPageBlocks(pageId: string): Promise<any[]> {
  const blocks: any[] = []
  let cursor: string | undefined

  do {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
      page_size: 100,
    })
    blocks.push(...response.results)
    cursor = response.has_more ? response.next_cursor ?? undefined : undefined
  } while (cursor)

  for (const block of blocks) {
    if ((block as any).has_children) {
      (block as any).children = await getPageBlocks(block.id)
    }
  }

  return blocks
}

export async function getPageBySlug(slug: string) {
  const response = await notion.databases.query({
    database_id: siteConfig.blogDatabaseId,
    filter: {
      and: [
        { property: 'Public', checkbox: { equals: true } },
        { property: 'Slug', rich_text: { equals: slug } },
      ],
    },
  })

  const page = response.results[0]
  if (!page) return null

  const blocks = await getPageBlocks(page.id)
  return { id: page.id, blocks }
}

export async function getProjects() {
  const blocks = await getPageBlocks(siteConfig.projectsPageId)
  const projects: { title: string; description: string; url: string | null }[] = []

  for (const block of blocks) {
    if (block.type === 'child_page') {
      const childBlocks = await getPageBlocks(block.id)
      const firstText = childBlocks.find((b: any) => b.type === 'paragraph')
      const description = firstText?.paragraph?.rich_text?.[0]?.plain_text ?? ''
      const linkBlock = childBlocks.find((b: any) => b.type === 'bookmark')
      const url = linkBlock?.bookmark?.url ?? null
      projects.push({ title: block.child_page.title, description, url })
    }
  }

  return projects
}

export async function getPhotos() {
  const blocks = await getPageBlocks(siteConfig.photosPageId)
  return blocks
    .filter((b: any) => b.type === 'image')
    .map((block: any) => ({
      src: block.image.type === 'external' ? block.image.external.url : block.image.file.url,
      alt: block.image.caption?.[0]?.plain_text ?? '',
    }))
}
```

- [ ] **Step 4: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add lib/
git commit -m "feat: Notion API client and site config"
```

---

### Task 3: Symbol Matrix + Scattered Words background

**Files:**
- Create: `components/hero/SymbolMatrix.tsx`
- Create: `components/hero/ScatteredWords.tsx`

- [ ] **Step 1: Create components/hero/SymbolMatrix.tsx**

```tsx
const SYMBOLS = [
  // Code
  '{}', '=>', '//', '&&', '||', '0x', 'fn', '++', '!=', '<<', '::', '[]', '()', '**',
  // Math
  '∑', '∂', '∫', 'π', '∞', 'Δ', 'λ', 'Ω', '√', '≈', '∈', '⊂',
  // Unicode blocks
  '░', '▓', '█', '◆', '●', '○', '◈', '▪', '▫', '◇', '△', '▽',
  // Emoji/symbols
  '📷', '🍎', '⌘', '✦', '⚡', '◎', '❋', '※',
  // Fragments
  'let', 'nil', 'pub', 'use', 'mut', 'def', 'new', 'var', 'async', 'self',
]

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export function SymbolMatrix() {
  // Generate a deterministic grid of symbols
  const cells: { symbol: string; opacity: number; size: string; rotate: number }[] = []

  for (let i = 0; i < 400; i++) {
    const r1 = seededRandom(i * 7 + 1)
    const r2 = seededRandom(i * 13 + 2)
    const r3 = seededRandom(i * 19 + 3)
    const r4 = seededRandom(i * 31 + 4)

    cells.push({
      symbol: SYMBOLS[Math.floor(r1 * SYMBOLS.length)],
      opacity: 0.04 + r2 * 0.08, // 0.04 to 0.12
      size: `${0.55 + r3 * 0.7}rem`, // 0.55rem to 1.25rem
      rotate: -8 + r4 * 16, // -8deg to +8deg
    })
  }

  return (
    <div
      className="absolute inset-0 overflow-hidden font-mono text-fg select-none pointer-events-none"
      aria-hidden="true"
    >
      <div className="grid grid-cols-[repeat(20,1fr)] gap-0 w-full h-full place-items-center">
        {cells.map((cell, i) => (
          <span
            key={i}
            style={{
              opacity: cell.opacity,
              fontSize: cell.size,
              transform: `rotate(${cell.rotate}deg)`,
            }}
          >
            {cell.symbol}
          </span>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create components/hero/ScatteredWords.tsx**

```tsx
const WORDS = [
  { text: 'code', x: '8%', y: '15%', size: '12vw', rotate: -12 },
  { text: 'curiosity', x: '55%', y: '70%', size: '10vw', rotate: 8 },
  { text: 'build', x: '70%', y: '20%', size: '9vw', rotate: -5 },
  { text: 'xikai', x: '15%', y: '75%', size: '14vw', rotate: 15 },
  { text: 'WWDC', x: '80%', y: '50%', size: '8vw', rotate: -18 },
  { text: '∞', x: '40%', y: '85%', size: '11vw', rotate: 3 },
]

export function ScatteredWords() {
  return (
    <div
      className="absolute inset-0 overflow-hidden select-none pointer-events-none"
      aria-hidden="true"
    >
      {WORDS.map((word, i) => (
        <span
          key={i}
          className="absolute font-sans font-bold text-fg whitespace-nowrap"
          style={{
            left: word.x,
            top: word.y,
            fontSize: word.size,
            transform: `rotate(${word.rotate}deg)`,
            opacity: 0.03,
          }}
        >
          {word.text}
        </span>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Quick visual test — temporarily add to page.tsx**

```tsx
import { SymbolMatrix } from '@/components/hero/SymbolMatrix'
import { ScatteredWords } from '@/components/hero/ScatteredWords'

export default function Home() {
  return (
    <main className="relative flex h-screen items-center justify-center">
      <SymbolMatrix />
      <ScatteredWords />
      <h1 className="text-4xl font-light tracking-tight z-10">xikai()</h1>
    </main>
  )
}
```

```bash
npx next dev -p 3001
```

Open http://localhost:3001 — should see dark bg with faint monospace characters and barely-visible large words behind the title.

- [ ] **Step 4: Commit**

```bash
git add components/hero/
git commit -m "feat: symbol matrix + scattered words hero background"
```

---

### Task 4: Liquid Glass components

**Files:**
- Create: `components/glass/GlassPills.tsx`
- Create: `components/glass/GlassNav.tsx`

- [ ] **Step 1: Create components/glass/GlassPills.tsx**

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    liquidGL: any
    html2canvas: any
  }
}

const NAV_LINKS = [
  { id: 'writing', label: 'writing' },
  { id: 'projects', label: 'projects' },
  { id: 'photos', label: 'photos' },
  { id: 'about', label: 'about' },
]

export function GlassPills() {
  const [glassReady, setGlassReady] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-transparency: reduce)').matches) return

    const init = () => {
      if (!window.liquidGL || !window.html2canvas) return

      // Delay so DOM (symbol matrix) is fully painted before html2canvas snapshot
      setTimeout(() => {
        try {
          window.liquidGL({
            target: '.glass-pill',
            resolution: 1.5,
            refraction: 0.025,
            bevelDepth: 0.1,
            bevelWidth: 0.06,
            frost: 0,
            specular: true,
            shadow: true,
            tilt: true,
            tiltFactor: 3,
            reveal: 'fade',
            magnify: 1,
          })
          setGlassReady(true)
        } catch (e) {
          console.warn('GlassPills init failed', e)
        }
      }, 300)
    }

    if (window.liquidGL && window.html2canvas) {
      init()
    } else {
      const check = setInterval(() => {
        if (window.liquidGL && window.html2canvas) {
          clearInterval(check)
          init()
        }
      }, 100)
      return () => clearInterval(check)
    }
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {NAV_LINKS.map((link) => (
        <button
          key={link.id}
          onClick={() => scrollTo(link.id)}
          className={`glass-pill inline-flex items-center px-6 py-2.5 rounded-pill text-fg/80 hover:text-fg transition-colors text-lg tracking-wide min-h-[44px] ${
            !glassReady ? 'liquid-glass-fallback rounded-pill' : ''
          }`}
          style={{ position: 'fixed' }}
          data-liquid-ignore
        >
          <span data-liquid-ignore>{link.label}</span>
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Create components/glass/GlassNav.tsx**

```tsx
'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

interface GlassNavProps {
  href: string
  label: string
}

export function GlassNav({ href, label }: GlassNavProps) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [visible, setVisible] = useState(false)
  const [glassReady, setGlassReady] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 100)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!visible || glassReady) return
    if (window.matchMedia('(prefers-reduced-transparency: reduce)').matches) return

    const init = () => {
      if (!window.liquidGL || !window.html2canvas || !ref.current) return

      requestAnimationFrame(() => {
        try {
          window.liquidGL({
            target: ref.current,
            resolution: 1.5,
            refraction: 0.015,
            bevelDepth: 0.08,
            bevelWidth: 0.05,
            frost: 8,
            specular: true,
            shadow: true,
            tilt: false,
            reveal: 'fade',
            magnify: 1,
          })
          setGlassReady(true)
        } catch (e) {
          console.warn('GlassNav init failed', e)
        }
      })
    }

    if (window.liquidGL && window.html2canvas) {
      init()
    } else {
      const check = setInterval(() => {
        if (window.liquidGL && window.html2canvas) {
          clearInterval(check)
          init()
        }
      }, 100)
      return () => clearInterval(check)
    }
  }, [visible, glassReady])

  return (
    <Link
      ref={ref}
      href={href}
      className={`fixed top-6 left-6 z-50 inline-flex items-center px-5 py-2 rounded-pill text-sm text-fg/70 hover:text-fg transition-all duration-300 min-h-[44px] ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
      } ${!glassReady ? 'liquid-glass-fallback rounded-pill' : ''}`}
      data-liquid-ignore
    >
      <span data-liquid-ignore>← {label}</span>
    </Link>
  )
}
```

- [ ] **Step 3: Verify build**

```bash
npx tsc --noEmit && npx next build
```

- [ ] **Step 4: Commit**

```bash
git add components/glass/
git commit -m "feat: Liquid Glass components (GlassPills, GlassNav)"
```

---

### Task 5: Notion block renderer

**Files:** `components/notion/renderer.tsx` + all block components in `components/notion/blocks/`

- [ ] **Step 1: Create components/notion/renderer.tsx**

```tsx
import React from 'react'
import { Paragraph } from './blocks/Paragraph'
import { Heading1, Heading2, Heading3 } from './blocks/Heading'
import { BulletedListItem } from './blocks/BulletedList'
import { NumberedListItem } from './blocks/NumberedList'
import { Code } from './blocks/Code'
import { ImageBlock } from './blocks/Image'
import { Quote } from './blocks/Quote'
import { Callout } from './blocks/Callout'
import { Divider } from './blocks/Divider'
import { Bookmark } from './blocks/Bookmark'

const blockComponents: Record<string, React.FC<{ block: any }>> = {
  paragraph: Paragraph,
  heading_1: Heading1,
  heading_2: Heading2,
  heading_3: Heading3,
  bulleted_list_item: BulletedListItem,
  numbered_list_item: NumberedListItem,
  code: Code,
  image: ImageBlock,
  quote: Quote,
  callout: Callout,
  divider: Divider,
  bookmark: Bookmark,
}

export function NotionBlockRenderer({ block }: { block: any }) {
  const Component = blockComponents[block.type]
  if (!Component) {
    const richText = block[block.type]?.rich_text
    if (richText) {
      return <p className="my-4 font-serif text-muted">{renderRichText(richText)}</p>
    }
    return null
  }
  return <Component block={block} />
}

export function NotionRenderer({ blocks }: { blocks: any[] }) {
  return (
    <div>
      {blocks.map((block) => (
        <NotionBlockRenderer key={block.id} block={block} />
      ))}
    </div>
  )
}

export function renderRichText(richTexts: any[]): React.ReactNode {
  if (!richTexts?.length) return null

  return richTexts.map((text: any, i: number) => {
    const { annotations, plain_text, href } = text
    let content: React.ReactNode = plain_text

    if (annotations.bold) content = <strong>{content}</strong>
    if (annotations.italic) content = <em>{content}</em>
    if (annotations.strikethrough) content = <s>{content}</s>
    if (annotations.code) {
      content = (
        <code className="bg-neutral-800 px-1.5 py-0.5 text-sm font-mono text-neutral-300">
          {content}
        </code>
      )
    }
    if (annotations.underline) content = <u>{content}</u>

    if (href) {
      content = (
        <a href={href} target="_blank" rel="noopener noreferrer"
          className="border-b border-muted/40 hover:border-fg transition-colors">
          {content}
        </a>
      )
    }

    return <React.Fragment key={i}>{content}</React.Fragment>
  })
}
```

- [ ] **Step 2: Create all block components**

Create each file in `components/notion/blocks/`:

`Paragraph.tsx`:
```tsx
import { renderRichText } from '../renderer'

export function Paragraph({ block }: { block: any }) {
  return <p className="my-4 leading-relaxed font-serif">{renderRichText(block.paragraph.rich_text)}</p>
}
```

`Heading.tsx`:
```tsx
import { renderRichText } from '../renderer'

export function Heading1({ block }: { block: any }) {
  return <h1 className="mt-12 mb-4 text-3xl font-sans font-semibold tracking-tight">{renderRichText(block.heading_1.rich_text)}</h1>
}

export function Heading2({ block }: { block: any }) {
  return <h2 className="mt-10 mb-3 text-2xl font-sans font-medium tracking-tight">{renderRichText(block.heading_2.rich_text)}</h2>
}

export function Heading3({ block }: { block: any }) {
  return <h3 className="mt-8 mb-2 text-xl font-sans font-medium tracking-tight">{renderRichText(block.heading_3.rich_text)}</h3>
}
```

`BulletedList.tsx`:
```tsx
import { renderRichText, NotionBlockRenderer } from '../renderer'

export function BulletedListItem({ block }: { block: any }) {
  return (
    <li className="my-1 ml-6 list-disc font-serif leading-relaxed">
      {renderRichText(block.bulleted_list_item.rich_text)}
      {block.children && <ul className="mt-1">{block.children.map((child: any) => <NotionBlockRenderer key={child.id} block={child} />)}</ul>}
    </li>
  )
}
```

`NumberedList.tsx`:
```tsx
import { renderRichText, NotionBlockRenderer } from '../renderer'

export function NumberedListItem({ block }: { block: any }) {
  return (
    <li className="my-1 ml-6 list-decimal font-serif leading-relaxed">
      {renderRichText(block.numbered_list_item.rich_text)}
      {block.children && <ol className="mt-1">{block.children.map((child: any) => <NotionBlockRenderer key={child.id} block={child} />)}</ol>}
    </li>
  )
}
```

`Code.tsx`:
```tsx
export function Code({ block }: { block: any }) {
  const code = block.code.rich_text.map((t: any) => t.plain_text).join('')
  return (
    <pre className="my-6 overflow-x-auto border border-neutral-800 bg-neutral-900 p-4">
      <code className="text-sm font-mono text-neutral-300 leading-relaxed">{code}</code>
    </pre>
  )
}
```

`Image.tsx`:
```tsx
export function ImageBlock({ block }: { block: any }) {
  const src = block.image.type === 'external' ? block.image.external.url : block.image.file.url
  const caption = block.image.caption?.[0]?.plain_text ?? ''
  return (
    <figure className="my-8">
      <img src={src} alt={caption} className="w-full" loading="lazy" />
      {caption && <figcaption className="mt-2 text-center text-sm text-muted">{caption}</figcaption>}
    </figure>
  )
}
```

`Quote.tsx`:
```tsx
import { renderRichText } from '../renderer'

export function Quote({ block }: { block: any }) {
  return <blockquote className="my-6 border-l-2 border-muted pl-4 italic font-serif text-muted">{renderRichText(block.quote.rich_text)}</blockquote>
}
```

`Callout.tsx`:
```tsx
import { renderRichText } from '../renderer'

export function Callout({ block }: { block: any }) {
  const icon = block.callout.icon?.emoji ?? ''
  return (
    <div className="my-4 flex gap-3 border border-neutral-800 p-4">
      {icon && <span className="text-lg shrink-0">{icon}</span>}
      <div className="font-serif leading-relaxed">{renderRichText(block.callout.rich_text)}</div>
    </div>
  )
}
```

`Divider.tsx`:
```tsx
export function Divider() {
  return <hr className="my-8 border-neutral-800" />
}
```

`Bookmark.tsx`:
```tsx
export function Bookmark({ block }: { block: any }) {
  const url = block.bookmark.url
  const caption = block.bookmark.caption?.[0]?.plain_text ?? url
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className="my-4 block border border-neutral-800 p-4 text-sm text-muted hover:border-fg/30 transition-colors">
      {caption}
    </a>
  )
}
```

- [ ] **Step 3: Verify build**

```bash
npx tsc --noEmit && npx next build
```

- [ ] **Step 4: Commit**

```bash
git add components/notion/
git commit -m "feat: custom Notion block renderer"
```

---

### Task 6: Landing page — full assembly

**Files:** `app/page.tsx`

- [ ] **Step 1: Write app/page.tsx**

```tsx
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { getBlogPosts, getProjects, getPhotos } from '@/lib/notion'
import { siteConfig } from '@/lib/config'
import { SymbolMatrix } from '@/components/hero/SymbolMatrix'
import { ScatteredWords } from '@/components/hero/ScatteredWords'

const GlassPills = dynamic(
  () => import('@/components/glass/GlassPills').then((m) => m.GlassPills),
  { ssr: false }
)

export const revalidate = 60

export default async function Home() {
  const [posts, projects, photos] = await Promise.all([
    getBlogPosts(),
    getProjects(),
    getPhotos(),
  ])

  return (
    <main>
      {/* Hero */}
      <section className="relative flex h-screen flex-col items-center justify-center px-6 overflow-hidden">
        <SymbolMatrix />
        <ScatteredWords />

        <div className="text-center z-10" data-liquid-ignore>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4" data-liquid-ignore>
            xikai()
          </h1>
          <p className="text-lg text-muted max-w-md mx-auto mb-10" data-liquid-ignore>
            software engineer. building things with code.
          </p>

          <GlassPills />

          <div className="flex justify-center gap-6 text-sm text-muted mt-10" data-liquid-ignore>
            <a href={`https://github.com/${siteConfig.github}`} target="_blank" rel="noopener noreferrer" className="hover:text-fg transition-colors">GitHub</a>
            <a href={`https://www.linkedin.com/in/${siteConfig.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:text-fg transition-colors">LinkedIn</a>
            <a href="mailto:realxikai@gmail.com" className="hover:text-fg transition-colors">Email</a>
          </div>
        </div>

        <div className="absolute bottom-8 text-muted/40 text-xs tracking-widest animate-pulse" data-liquid-ignore>
          scroll
        </div>
      </section>

      {/* Writing */}
      {posts.length > 0 && (
        <section id="writing" className="mx-auto max-w-reading px-6 py-24">
          <h2 className="text-2xl font-light tracking-tight mb-10 text-muted">writing</h2>
          <div className="flex flex-col">
            {posts.map((post) => (
              <Link key={post.id} href={`/writing/${post.slug}`}
                className="group flex items-baseline justify-between gap-4 py-3 border-b border-neutral-800/50">
                <span className="text-fg group-hover:text-white transition-colors">{post.title}</span>
                {post.published && (
                  <span className="shrink-0 text-sm text-muted tabular-nums">
                    {new Date(post.published).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section id="projects" className="mx-auto max-w-grid px-6 py-24">
          <h2 className="text-2xl font-light tracking-tight mb-10 text-muted">projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project, i) => {
              const Tag = project.url ? 'a' : 'div'
              const linkProps = project.url ? { href: project.url, target: '_blank' as const, rel: 'noopener noreferrer' } : {}
              return (
                <Tag key={i} {...linkProps} className="group block border border-neutral-800 p-6 hover:-translate-y-0.5 hover:border-neutral-600 transition-all duration-200">
                  <h3 className="text-fg font-medium mb-2">{project.title}</h3>
                  {project.description && <p className="text-sm text-muted leading-relaxed">{project.description}</p>}
                </Tag>
              )
            })}
          </div>
        </section>
      )}

      {/* Photos */}
      {photos.length > 0 && (
        <section id="photos" className="mx-auto max-w-4xl px-6 py-24">
          <h2 className="text-2xl font-light tracking-tight mb-10 text-muted">photos</h2>
          <div className="columns-2 gap-4">
            {photos.map((photo, i) => (
              <div key={i} className="mb-4 break-inside-avoid">
                <img src={photo.src} alt={photo.alt} className="w-full" loading="lazy" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* About */}
      <section id="about" className="mx-auto max-w-lg px-6 py-24 text-center">
        <p className="text-xl leading-relaxed mb-6">
          Software engineer at Apple. Previously TikTok, Meituan.
        </p>
        <p className="text-xl leading-relaxed mb-6">
          Two-time WWDC Swift Student Challenge winner.
        </p>
        <p className="text-xl leading-relaxed text-muted">
          I build things with code.
        </p>
      </section>

      {/* Footer */}
      <footer className="py-16 text-center text-sm text-muted/50">
        xikai()
      </footer>
    </main>
  )
}
```

- [ ] **Step 2: Dev server test**

```bash
npx next dev -p 3001
```

Open http://localhost:3001 — symbol matrix behind glass pills, content sections below.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: landing page — glass pills over symbol matrix + content sections"
```

---

### Task 7: Article detail page with glass back-nav

**Files:** `app/writing/[slug]/page.tsx`

- [ ] **Step 1: Create app/writing/[slug]/page.tsx**

```tsx
import { getPageBySlug, getBlogPosts } from '@/lib/notion'
import { NotionRenderer } from '@/components/notion/renderer'
import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'

const GlassNav = dynamic(
  () => import('@/components/glass/GlassNav').then((m) => m.GlassNav),
  { ssr: false }
)

export const revalidate = 60

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = await getPageBySlug(slug)
  if (!page) notFound()

  return (
    <>
      <GlassNav href="/" label="xikai()" />
      <main className="mx-auto max-w-reading px-6 py-24">
        <article className="mt-8">
          <NotionRenderer blocks={page.blocks} />
        </article>
      </main>
    </>
  )
}
```

- [ ] **Step 2: Verify build + test an article**

```bash
npx next build
npx next dev -p 3001
```

- [ ] **Step 3: Commit**

```bash
git add app/writing/
git commit -m "feat: article page with liquid glass back-nav"
```

---

### Task 8: Final cleanup + deploy

- [ ] **Step 1: Create .env.example**

```
NOTION_TOKEN=your_notion_integration_token_here
```

- [ ] **Step 2: Remove leftover shader files (no longer needed)**

```bash
rm -rf components/shader/
```

- [ ] **Step 3: Full build**

```bash
npx next build
```

- [ ] **Step 4: Smoke test**

```bash
npx next dev -p 3001
```

- `/` — symbol matrix + glass pills + sections
- `/writing/[slug]` — article + glass back-nav
- Glass refraction visible through pills

- [ ] **Step 5: Commit + push**

```bash
git add -A
git commit -m "chore: finalize liquid glass redesign, remove shader"
git push origin master
```

Set `NOTION_TOKEN` in Vercel → Environment Variables.

---

## Summary

| Task | What it builds |
|------|---------------|
| 1 | Scaffold: App Router + Tailwind + liquidGL + 3 fonts |
| 2 | Notion API client + config |
| 3 | Symbol matrix + scattered words background |
| 4 | Liquid Glass components (GlassPills, GlassNav) |
| 5 | Notion block renderer (10 block types) |
| 6 | Landing page: full assembly |
| 7 | Article detail with glass back-nav |
| 8 | Cleanup + deploy |

**Key decisions:**
- No Three.js — removed entirely. Symbol matrix is pure DOM, ~0 JS
- liquidGL is the only WebGL on the page — clean html2canvas capture
- Glass only on navigation (pills, back-nav) per Apple HIG
- JetBrains Mono for the matrix, Inter for UI, Source Serif for reading
