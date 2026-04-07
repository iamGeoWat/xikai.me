# xikai.me Redesign Implementation Plan (v2 — Liquid Glass)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild xikai.me with Apple's Liquid Glass design language (via liquidGL) over a generative shader background. Glass for navigation chrome, clean content, single-page landing with sections.

**Architecture:** Next.js 14 App Router, Tailwind CSS, liquidGL for glass effects, R3F for shader hero, Notion official API for content. Glass elements are client-only wrappers around liquidGL. Shader and glass together create the visual identity.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, liquidGL, @react-three/fiber, @notionhq/client

**Spec:** `docs/superpowers/specs/2026-04-06-website-redesign.md`

---

## File Structure

```
app/
  layout.tsx              — root layout: fonts, Tailwind, liquidGL + html2canvas scripts
  page.tsx                — single-page: hero + writing + projects + photos + footer
  globals.css             — Tailwind directives + base styles + glass fallbacks
  writing/
    [slug]/page.tsx       — article detail with floating glass back-nav

components/
  glass/
    LiquidGlass.tsx       — "use client" core wrapper: initializes liquidGL on a ref
    GlassPill.tsx         — capsule navigation button with glass effect
    GlassNav.tsx          — floating fixed-position glass back-nav for article pages
  shader/
    HeroScene.tsx         — R3F canvas with noise shader (already exists, keep as-is)
    hero.frag             — fragment shader (already exists)
    hero.vert             — vertex shader (already exists)
  notion/
    renderer.tsx          — Notion block → React component mapper + renderRichText
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
    ProjectCard.tsx        — project grid card (plain, no glass)

lib/
  notion.ts               — Notion API client + fetch helpers
  config.ts               — site config (IDs, metadata)
  types.ts                — shared types

public/
  scripts/
    liquidGL.js           — liquidGL library (already downloaded)

tailwind.config.ts
postcss.config.mjs
next.config.mjs
```

---

### Task 1: Scaffold — Clean slate + App Router + Tailwind + liquidGL scripts

**Files:**
- Delete: `pages/`, `components/` (old), `lib/` (old), `styles/` (old), `site.config.ts`
- Keep: `app/` (already partially created), `components/shader/` (already built), `public/scripts/liquidGL.js`
- Create: `tailwind.config.ts`, `postcss.config.mjs`, `next.config.mjs`
- Replace: `package.json`, `tsconfig.json`
- Modify: `app/layout.tsx` (add liquidGL script loading)
- Modify: `app/globals.css` (add glass fallback styles)

- [ ] **Step 1: Create new package.json**

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
    "@react-three/fiber": "^8.17.0",
    "@react-three/drei": "^9.114.0",
    "three": "^0.169.0",
    "next": "^14.2.35",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@types/three": "^0.169.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.13",
    "typescript": "^5.6.0"
  }
}
```

- [ ] **Step 2: Delete old source directories**

```bash
rm -rf pages/ styles/
rm -f site.config.ts next.config.js
# Keep: app/, components/shader/, public/scripts/liquidGL.js, lib/ (will be replaced), docs/
```

Remove old components except shader:
```bash
rm -f components/Footer.tsx components/GitHubShareButton.tsx components/index.ts components/Loading.tsx components/LoadingIcon.tsx components/NotionPage.tsx components/NotionPageHeader.tsx components/Page404.tsx components/PageActions.tsx components/PageAside.tsx components/PageHead.tsx components/PageSocial.tsx components/PageSocial.module.css components/styles.module.css components/ErrorPage.tsx
```

Remove old lib files:
```bash
rm -f lib/acl.ts lib/bootstrap-client.ts lib/config.ts lib/db.ts lib/fonts.ts lib/get-canonical-page-id.ts lib/get-config-value.ts lib/get-page-tweet.ts lib/get-site-map.ts lib/get-social-image-url.ts lib/map-image-url.ts lib/map-page-url.ts lib/notion-api.ts lib/notion.ts lib/oembed.ts lib/preview-images.ts lib/resolve-notion-page.ts lib/search-notion.ts lib/site-config.ts lib/types.ts lib/use-dark-mode.ts
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
  webpack(config) {
    config.module.rules.push({
      test: /\.(frag|vert|glsl)$/,
      type: 'asset/source',
    })
    return config
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
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

export default config
```

- [ ] **Step 7: Update app/globals.css**

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

/* Liquid Glass CSS fallback (when WebGL unavailable or prefers-reduced-transparency) */
@media (prefers-reduced-transparency: reduce) {
  .liquid-glass-fallback {
    background: rgba(255, 255, 255, 0.12) !important;
    backdrop-filter: blur(12px) saturate(150%);
    border: 1px solid rgba(255, 255, 255, 0.15);
  }
}

.liquid-glass-fallback {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px) saturate(140%);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

- [ ] **Step 8: Update app/layout.tsx with liquidGL script loading**

```tsx
import type { Metadata } from 'next'
import { Inter, Source_Serif_4 } from 'next/font/google'
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
    <html lang="en" className={`${inter.variable} ${sourceSerif.variable}`}>
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

- [ ] **Step 9: Create app/shader.d.ts for GLSL imports**

```ts
declare module '*.frag' {
  const value: string
  export default value
}
declare module '*.vert' {
  const value: string
  export default value
}
```

- [ ] **Step 10: Create placeholder app/page.tsx**

```tsx
export default function Home() {
  return (
    <main className="flex h-screen items-center justify-center">
      <h1 className="text-4xl font-light tracking-tight">xikai()</h1>
    </main>
  )
}
```

- [ ] **Step 11: Install dependencies and verify build**

```bash
npm install --legacy-peer-deps
npx next build
```

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "feat: scaffold App Router + Tailwind + liquidGL, remove old code"
```

---

### Task 2: Site config + Notion API client

**Files:**
- Create: `lib/config.ts`, `lib/notion.ts`, `lib/types.ts`

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

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add lib/
git commit -m "feat: Notion API client and site config"
```

---

### Task 3: Liquid Glass components

**Files:**
- Create: `components/glass/LiquidGlass.tsx`
- Create: `components/glass/GlassPill.tsx`
- Create: `components/glass/GlassNav.tsx`

- [ ] **Step 1: Create components/glass/LiquidGlass.tsx**

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    liquidGL: any
    html2canvas: any
  }
}

interface LiquidGlassProps {
  children: React.ReactNode
  className?: string
  refraction?: number
  bevelDepth?: number
  bevelWidth?: number
  frost?: number
  specular?: boolean
  shadow?: boolean
  tilt?: boolean
  tiltFactor?: number
  reveal?: string
}

export function LiquidGlass({
  children,
  className = '',
  refraction = 0.02,
  bevelDepth = 0.08,
  bevelWidth = 0.05,
  frost = 0,
  specular = true,
  shadow = true,
  tilt = false,
  tiltFactor = 3,
  reveal = 'fade',
}: LiquidGlassProps) {
  const ref = useRef<HTMLDivElement>(null)
  const lensRef = useRef<any>(null)
  const [glassReady, setGlassReady] = useState(false)

  useEffect(() => {
    // Check for reduced transparency preference
    const prefersReduced = window.matchMedia('(prefers-reduced-transparency: reduce)').matches

    if (prefersReduced || !window.liquidGL) {
      // Use CSS fallback
      return
    }

    // Wait for liquidGL to be available
    const initGlass = () => {
      if (!window.liquidGL || !window.html2canvas || !ref.current) return

      // Small delay to ensure DOM is painted
      requestAnimationFrame(() => {
        try {
          lensRef.current = window.liquidGL({
            target: ref.current,
            resolution: 1.5,
            refraction,
            bevelDepth,
            bevelWidth,
            frost,
            specular,
            shadow,
            tilt,
            tiltFactor,
            reveal,
            magnify: 1,
          })
          setGlassReady(true)
        } catch (e) {
          console.warn('liquidGL init failed, using fallback', e)
        }
      })
    }

    // liquidGL might not be loaded yet (async script)
    if (window.liquidGL && window.html2canvas) {
      initGlass()
    } else {
      const check = setInterval(() => {
        if (window.liquidGL && window.html2canvas) {
          clearInterval(check)
          initGlass()
        }
      }, 100)
      return () => clearInterval(check)
    }
  }, [refraction, bevelDepth, bevelWidth, frost, specular, shadow, tilt, tiltFactor, reveal])

  return (
    <div
      ref={ref}
      className={`${className} ${!glassReady ? 'liquid-glass-fallback' : ''}`}
      style={{ position: 'fixed' }}
      data-liquid-ignore
    >
      <div data-liquid-ignore>{children}</div>
    </div>
  )
}
```

- [ ] **Step 2: Create components/glass/GlassPill.tsx**

```tsx
'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

interface GlassPillProps {
  href: string
  children: React.ReactNode
}

export function GlassPill({ href, children }: GlassPillProps) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [glassReady, setGlassReady] = useState(false)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-transparency: reduce)').matches
    if (prefersReduced) return

    const initGlass = () => {
      if (!window.liquidGL || !window.html2canvas || !ref.current) return

      requestAnimationFrame(() => {
        try {
          window.liquidGL({
            target: ref.current,
            resolution: 1.5,
            refraction: 0.02,
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
          console.warn('GlassPill init failed', e)
        }
      })
    }

    if (window.liquidGL && window.html2canvas) {
      initGlass()
    } else {
      const check = setInterval(() => {
        if (window.liquidGL && window.html2canvas) {
          clearInterval(check)
          initGlass()
        }
      }, 100)
      return () => clearInterval(check)
    }
  }, [])

  return (
    <Link
      ref={ref}
      href={href}
      className={`inline-flex items-center px-6 py-2.5 rounded-pill text-fg/80 hover:text-fg transition-colors text-lg tracking-wide min-h-[44px] ${!glassReady ? 'liquid-glass-fallback rounded-pill' : ''}`}
      style={{ position: 'fixed' }}
      data-liquid-ignore
    >
      <span data-liquid-ignore>{children}</span>
    </Link>
  )
}
```

- [ ] **Step 3: Create components/glass/GlassNav.tsx**

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
    if (!visible) return

    const prefersReduced = window.matchMedia('(prefers-reduced-transparency: reduce)').matches
    if (prefersReduced) return

    const initGlass = () => {
      if (!window.liquidGL || !window.html2canvas || !ref.current || glassReady) return

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
      initGlass()
    } else {
      const check = setInterval(() => {
        if (window.liquidGL && window.html2canvas) {
          clearInterval(check)
          initGlass()
        }
      }, 100)
      return () => clearInterval(check)
    }
  }, [visible, glassReady])

  return (
    <Link
      ref={ref}
      href={href}
      className={`fixed top-6 left-6 z-50 inline-flex items-center px-5 py-2 rounded-pill text-sm text-fg/70 hover:text-fg transition-all duration-300 min-h-[44px] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'} ${!glassReady ? 'liquid-glass-fallback rounded-pill' : ''}`}
      data-liquid-ignore
    >
      <span data-liquid-ignore>← {label}</span>
    </Link>
  )
}
```

- [ ] **Step 4: Verify build**

```bash
npx tsc --noEmit && npx next build
```

- [ ] **Step 5: Commit**

```bash
git add components/glass/
git commit -m "feat: Liquid Glass components (LiquidGlass, GlassPill, GlassNav)"
```

---

### Task 4: Notion block renderer

Same as original plan Task 3 — create `components/notion/renderer.tsx` and all block components. No changes needed from v1 plan. Refer to the code in the original Task 3 steps 1-12.

- [ ] **Steps 1-12: Create all block components and renderer.tsx** (same code as v1 plan Task 3)

- [ ] **Step 13: Commit**

```bash
git add components/notion/
git commit -m "feat: custom Notion block renderer"
```

---

### Task 5: Landing page — Hero + Glass pills + Content sections

**Files:**
- Modify: `app/page.tsx` — full single-page layout with shader hero, glass entry pills, writing/projects/photos sections

- [ ] **Step 1: Update app/page.tsx**

```tsx
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { getBlogPosts, getProjects, getPhotos } from '@/lib/notion'
import { siteConfig } from '@/lib/config'

const HeroScene = dynamic(
  () => import('@/components/shader/HeroScene').then((m) => m.HeroScene),
  { ssr: false }
)

const GlassPills = dynamic(
  () => import('./GlassPills').then((m) => m.GlassPills),
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
      {/* Hero Section */}
      <section className="relative flex h-screen flex-col items-center justify-center px-6">
        <HeroScene />
        <div className="text-center z-10" data-liquid-ignore>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4" data-liquid-ignore>
            hi, i'm xikai
          </h1>
          <p className="text-lg text-muted max-w-md mx-auto mb-10" data-liquid-ignore>
            software engineer, building things out of curiosity.
          </p>

          {/* Glass pill navigation */}
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

      {/* Writing Section */}
      {posts.length > 0 && (
        <section className="mx-auto max-w-reading px-6 py-24">
          <h2 className="text-2xl font-light tracking-tight mb-10 text-muted">writing</h2>
          <div className="flex flex-col">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/writing/${post.slug}`}
                className="group flex items-baseline justify-between gap-4 py-3 border-b border-neutral-800/50"
              >
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

      {/* Projects Section */}
      {projects.length > 0 && (
        <section className="mx-auto max-w-grid px-6 py-24">
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

      {/* Photos Section */}
      {photos.length > 0 && (
        <section className="mx-auto max-w-4xl px-6 py-24">
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

      {/* Footer */}
      <footer className="py-16 text-center text-sm text-muted/50">
        xikai()
      </footer>
    </main>
  )
}
```

- [ ] **Step 2: Create app/GlassPills.tsx — client component for the glass entry links**

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'

const links = [
  { href: '#writing', label: 'writing' },
  { href: '#projects', label: 'projects' },
  { href: '#photos', label: 'photos' },
  { href: '#about', label: 'about' },
]

export function GlassPills() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [glassReady, setGlassReady] = useState(false)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-transparency: reduce)').matches
    if (prefersReduced) return

    const initGlass = () => {
      if (!window.liquidGL || !window.html2canvas || !containerRef.current) return

      // liquidGL needs elements to exist in DOM, give it a frame
      requestAnimationFrame(() => {
        try {
          const targets = containerRef.current?.querySelectorAll('.glass-pill')
          if (targets?.length) {
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
          }
        } catch (e) {
          console.warn('GlassPills init failed', e)
        }
      })
    }

    if (window.liquidGL && window.html2canvas) {
      // Delay to ensure shader has rendered for snapshot
      setTimeout(initGlass, 500)
    } else {
      const check = setInterval(() => {
        if (window.liquidGL && window.html2canvas) {
          clearInterval(check)
          setTimeout(initGlass, 500)
        }
      }, 100)
      return () => clearInterval(check)
    }
  }, [])

  const scrollTo = (hash: string) => {
    const el = document.querySelector(hash)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div ref={containerRef} className="flex flex-wrap justify-center gap-4">
      {links.map((link) => (
        <button
          key={link.href}
          onClick={() => scrollTo(link.href)}
          className={`glass-pill inline-flex items-center px-6 py-2.5 rounded-pill text-fg/80 hover:text-fg transition-colors text-lg tracking-wide min-h-[44px] ${!glassReady ? 'liquid-glass-fallback rounded-pill' : ''}`}
          data-liquid-ignore
        >
          <span data-liquid-ignore>{link.label}</span>
        </button>
      ))}
    </div>
  )
}
```

Note: Add `id="writing"`, `id="projects"`, `id="photos"`, `id="about"` to each section in page.tsx accordingly.

- [ ] **Step 3: Verify dev server — shader hero + glass pills render**

```bash
npx next dev -p 3001
```

Open http://localhost:3001 — should see shader background with glass capsule pills refracting the noise through them.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx app/GlassPills.tsx
git commit -m "feat: landing page with shader hero + liquid glass pills + content sections"
```

---

### Task 6: Article detail page with glass back-nav

**Files:**
- Create: `app/writing/[slug]/page.tsx`

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

Navigate to a writing link from the landing page. Glass back-nav pill should appear on scroll with frosted refraction of the article content.

- [ ] **Step 3: Commit**

```bash
git add app/writing/
git commit -m "feat: article detail page with liquid glass back-nav"
```

---

### Task 7: Final cleanup + build verification + deploy

- [ ] **Step 1: Create .env.example**

```
NOTION_TOKEN=your_notion_integration_token_here
```

- [ ] **Step 2: Full build**

```bash
npx next build
```

All pages should generate successfully.

- [ ] **Step 3: Dev server smoke test**

```bash
npx next dev -p 3001
```

Verify:
- `/` — shader hero + glass pills + content sections
- `/writing/[slug]` — article with glass back-nav
- Scroll behavior, glass refraction, shader animation all working

- [ ] **Step 4: Commit everything**

```bash
git add -A
git commit -m "chore: cleanup and finalize liquid glass redesign"
```

- [ ] **Step 5: Push and deploy**

```bash
git push origin master
```

Set `NOTION_TOKEN` in Vercel project settings → Environment Variables.

---

## Summary

| Task | What it builds |
|------|---------------|
| 1 | Scaffold: clean slate + App Router + Tailwind + liquidGL scripts |
| 2 | Notion API client + site config |
| 3 | Liquid Glass components (LiquidGlass, GlassPill, GlassNav) |
| 4 | Custom Notion block renderer (same as v1) |
| 5 | Landing page: shader hero + glass pills + writing/projects/photos sections |
| 6 | Article detail page with floating glass back-nav |
| 7 | Cleanup + build + deploy |

**Key HIG compliance:**
- Glass only on navigation chrome (pills, back-nav), never on content
- Capsule shapes with 44px min touch targets
- CSS fallback for `prefers-reduced-transparency`
- One glass sheet per view
- `data-liquid-ignore` on text to exclude from snapshot
