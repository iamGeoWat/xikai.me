# xikai.me Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild xikai.me from a generic Notion template into a custom dark-themed personal site with a generative shader hero, custom Notion rendering, and minimal design.

**Architecture:** Next.js 14 App Router with Tailwind CSS. Content fetched from Notion official API and rendered with custom React components. Landing page has a Three.js shader background. All pages server-rendered with ISR.

**Tech Stack:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, @react-three/fiber, @notionhq/client

**Spec:** `docs/superpowers/specs/2026-04-06-website-redesign.md`

---

## File Structure

```
app/
  layout.tsx              — root layout: fonts, Tailwind, metadata, dark bg
  page.tsx                — landing: shader hero + title + entry links
  writing/
    page.tsx              — article list from Notion Blog Posts DB
    [slug]/page.tsx       — article detail, custom rendered
  projects/page.tsx       — project grid from Notion
  photos/page.tsx         — large-format photo gallery
  about/page.tsx          — centered bio text

components/
  shader/
    HeroScene.tsx         — "use client" R3F canvas with noise shader
    hero.frag             — GLSL fragment shader
    hero.vert             — GLSL vertex shader
  notion/
    renderer.tsx          — maps Notion block type → React component
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
    EntryLink.tsx         — landing page nav link with hover effect
    ArticleRow.tsx        — writing list row (title + date)
    ProjectCard.tsx       — project grid card
    PhotoCard.tsx         — photo with scroll animation

lib/
  notion.ts               — Notion API client + fetch helpers
  config.ts               — site config (IDs, metadata)
  types.ts                — shared types

tailwind.config.ts        — Tailwind config with design tokens
app/globals.css           — Tailwind directives + base styles
next.config.mjs           — Next.js config (images, redirects)
```

---

### Task 1: Scaffold — Clean slate + App Router + Tailwind

**Files:**
- Delete: `pages/`, `components/`, `lib/`, `styles/` (entire old directories)
- Create: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`
- Create: `tailwind.config.ts`, `postcss.config.mjs`
- Replace: `next.config.js` → `next.config.mjs`
- Replace: `package.json` (new dependencies)
- Replace: `tsconfig.json` (App Router paths)

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
    "glsl-noise": "^0.0.0",
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

- [ ] **Step 2: Delete old source directories and files**

```bash
rm -rf pages/ components/ lib/ styles/
rm -f next.config.js site.config.ts
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
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 5: Create tailwind.config.ts**

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
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
      transitionDuration: {
        DEFAULT: '200ms',
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
```

- [ ] **Step 8: Create app/layout.tsx**

```tsx
import type { Metadata } from 'next'
import { Inter, Source_Serif_4 } from 'next/font/google'
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
      <body className="font-sans">{children}</body>
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

- [ ] **Step 10: Install dependencies and verify build**

```bash
npm install
npx next build
```

Expected: Build succeeds with the single landing page.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: scaffold App Router + Tailwind, remove old Pages Router"
```

---

### Task 2: Site config + Notion API client

**Files:**
- Create: `lib/config.ts`
- Create: `lib/notion.ts`
- Create: `lib/types.ts`

- [ ] **Step 1: Create lib/config.ts**

```ts
export const siteConfig = {
  name: 'xikai()',
  domain: 'xikai.me',
  author: 'Xikai Liu',
  description: 'Software engineer at Apple.',
  github: 'iamGeoWat',
  linkedin: 'xikai-liu',

  // Notion page/database IDs
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
  isPublic: boolean
}

export interface Project {
  id: string
  title: string
  description: string
  url: string | null
}

export interface NotionBlock {
  id: string
  type: string
  [key: string]: any
}
```

- [ ] **Step 3: Create lib/notion.ts**

```ts
import { Client } from '@notionhq/client'
import type { BlogPost } from './types'
import { siteConfig } from './config'

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

export async function getBlogPosts(): Promise<BlogPost[]> {
  const response = await notion.databases.query({
    database_id: siteConfig.blogDatabaseId,
    filter: {
      property: 'Public',
      checkbox: { equals: true },
    },
    sorts: [
      { property: 'Published', direction: 'descending' },
    ],
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
      isPublic: props.Public?.checkbox ?? false,
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

  // Fetch children for blocks that have them (toggle, callout, etc.)
  for (const block of blocks) {
    if ((block as any).has_children) {
      (block as any).children = await getPageBlocks(block.id)
    }
  }

  return blocks
}

export async function getPageBySlug(slug: string): Promise<{ id: string; blocks: any[] } | null> {
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

export async function getPageContent(pageId: string): Promise<any[]> {
  return getPageBlocks(pageId)
}
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add lib/
git commit -m "feat: add Notion API client and site config"
```

---

### Task 3: Notion block renderer

**Files:**
- Create: `components/notion/renderer.tsx`
- Create: `components/notion/blocks/Paragraph.tsx`
- Create: `components/notion/blocks/Heading.tsx`
- Create: `components/notion/blocks/BulletedList.tsx`
- Create: `components/notion/blocks/NumberedList.tsx`
- Create: `components/notion/blocks/Code.tsx`
- Create: `components/notion/blocks/Image.tsx`
- Create: `components/notion/blocks/Quote.tsx`
- Create: `components/notion/blocks/Callout.tsx`
- Create: `components/notion/blocks/Divider.tsx`
- Create: `components/notion/blocks/Bookmark.tsx`

- [ ] **Step 1: Create components/notion/blocks/Paragraph.tsx**

```tsx
import { renderRichText } from '../renderer'

export function Paragraph({ block }: { block: any }) {
  return (
    <p className="my-4 leading-relaxed font-serif">
      {renderRichText(block.paragraph.rich_text)}
    </p>
  )
}
```

- [ ] **Step 2: Create components/notion/blocks/Heading.tsx**

```tsx
import { renderRichText } from '../renderer'

export function Heading1({ block }: { block: any }) {
  return (
    <h1 className="mt-12 mb-4 text-3xl font-sans font-semibold tracking-tight">
      {renderRichText(block.heading_1.rich_text)}
    </h1>
  )
}

export function Heading2({ block }: { block: any }) {
  return (
    <h2 className="mt-10 mb-3 text-2xl font-sans font-medium tracking-tight">
      {renderRichText(block.heading_2.rich_text)}
    </h2>
  )
}

export function Heading3({ block }: { block: any }) {
  return (
    <h3 className="mt-8 mb-2 text-xl font-sans font-medium tracking-tight">
      {renderRichText(block.heading_3.rich_text)}
    </h3>
  )
}
```

- [ ] **Step 3: Create components/notion/blocks/BulletedList.tsx**

```tsx
import { renderRichText } from '../renderer'
import { NotionBlockRenderer } from '../renderer'

export function BulletedListItem({ block }: { block: any }) {
  return (
    <li className="my-1 ml-6 list-disc font-serif leading-relaxed">
      {renderRichText(block.bulleted_list_item.rich_text)}
      {block.children && (
        <ul className="mt-1">
          {block.children.map((child: any) => (
            <NotionBlockRenderer key={child.id} block={child} />
          ))}
        </ul>
      )}
    </li>
  )
}
```

- [ ] **Step 4: Create components/notion/blocks/NumberedList.tsx**

```tsx
import { renderRichText } from '../renderer'
import { NotionBlockRenderer } from '../renderer'

export function NumberedListItem({ block }: { block: any }) {
  return (
    <li className="my-1 ml-6 list-decimal font-serif leading-relaxed">
      {renderRichText(block.numbered_list_item.rich_text)}
      {block.children && (
        <ol className="mt-1">
          {block.children.map((child: any) => (
            <NotionBlockRenderer key={child.id} block={child} />
          ))}
        </ol>
      )}
    </li>
  )
}
```

- [ ] **Step 5: Create components/notion/blocks/Code.tsx**

```tsx
export function Code({ block }: { block: any }) {
  const code = block.code.rich_text.map((t: any) => t.plain_text).join('')
  const language = block.code.language ?? 'plain text'

  return (
    <pre className="my-6 overflow-x-auto rounded-none border border-neutral-800 bg-neutral-900 p-4">
      <code className="text-sm font-mono text-neutral-300 leading-relaxed">
        {code}
      </code>
    </pre>
  )
}
```

- [ ] **Step 6: Create components/notion/blocks/Image.tsx**

```tsx
import NextImage from 'next/image'

export function ImageBlock({ block }: { block: any }) {
  const src =
    block.image.type === 'external'
      ? block.image.external.url
      : block.image.file.url
  const caption = block.image.caption?.[0]?.plain_text ?? ''

  return (
    <figure className="my-8">
      <img
        src={src}
        alt={caption}
        className="w-full"
        loading="lazy"
      />
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
```

- [ ] **Step 7: Create components/notion/blocks/Quote.tsx**

```tsx
import { renderRichText } from '../renderer'

export function Quote({ block }: { block: any }) {
  return (
    <blockquote className="my-6 border-l-2 border-muted pl-4 italic font-serif text-muted">
      {renderRichText(block.quote.rich_text)}
    </blockquote>
  )
}
```

- [ ] **Step 8: Create components/notion/blocks/Callout.tsx**

```tsx
import { renderRichText } from '../renderer'

export function Callout({ block }: { block: any }) {
  const icon = block.callout.icon?.emoji ?? ''

  return (
    <div className="my-4 flex gap-3 border border-neutral-800 p-4">
      {icon && <span className="text-lg shrink-0">{icon}</span>}
      <div className="font-serif leading-relaxed">
        {renderRichText(block.callout.rich_text)}
      </div>
    </div>
  )
}
```

- [ ] **Step 9: Create components/notion/blocks/Divider.tsx and Bookmark.tsx**

`components/notion/blocks/Divider.tsx`:
```tsx
export function Divider() {
  return <hr className="my-8 border-neutral-800" />
}
```

`components/notion/blocks/Bookmark.tsx`:
```tsx
export function Bookmark({ block }: { block: any }) {
  const url = block.bookmark.url
  const caption = block.bookmark.caption?.[0]?.plain_text ?? url

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="my-4 block border border-neutral-800 p-4 text-sm text-muted hover:border-fg/30 transition-colors"
    >
      {caption}
    </a>
  )
}
```

- [ ] **Step 10: Create components/notion/renderer.tsx**

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
    // Unsupported block type — render as plain text if it has rich_text
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

// Rich text renderer — handles bold, italic, code, links, color
export function renderRichText(richTexts: any[]): React.ReactNode {
  if (!richTexts?.length) return null

  return richTexts.map((text: any, i: number) => {
    const { annotations, plain_text, href } = text
    let content: React.ReactNode = plain_text

    if (annotations.bold) content = <strong key={i}>{content}</strong>
    if (annotations.italic) content = <em key={i}>{content}</em>
    if (annotations.strikethrough) content = <s key={i}>{content}</s>
    if (annotations.code) {
      content = (
        <code key={i} className="bg-neutral-800 px-1.5 py-0.5 text-sm font-mono text-neutral-300">
          {content}
        </code>
      )
    }
    if (annotations.underline) content = <u key={i}>{content}</u>

    if (href) {
      content = (
        <a
          key={i}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="border-b border-muted/40 hover:border-fg transition-colors"
        >
          {content}
        </a>
      )
    }

    return <React.Fragment key={i}>{content}</React.Fragment>
  })
}
```

- [ ] **Step 11: Verify build**

```bash
npx tsc --noEmit && npx next build
```

- [ ] **Step 12: Commit**

```bash
git add components/notion/
git commit -m "feat: add custom Notion block renderer"
```

---

### Task 4: Landing page with shader hero

**Files:**
- Create: `components/shader/HeroScene.tsx`
- Create: `components/shader/hero.frag`
- Create: `components/shader/hero.vert`
- Create: `components/ui/EntryLink.tsx`
- Modify: `app/page.tsx`
- Create: `app/shader.d.ts` (GLSL module declaration)

- [ ] **Step 1: Create app/shader.d.ts**

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

- [ ] **Step 2: Add raw-loader to next.config.mjs for GLSL files**

Replace `next.config.mjs`:

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

- [ ] **Step 3: Create components/shader/hero.vert**

```glsl
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```

- [ ] **Step 4: Create components/shader/hero.frag**

```glsl
precision highp float;

uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;

varying vec2 vUv;

// Simplex 3D noise
vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 1.0/7.0;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

void main() {
  vec2 st = vUv;
  float aspect = uResolution.x / uResolution.y;
  st.x *= aspect;

  // Mouse influence
  vec2 mouse = uMouse;
  mouse.x *= aspect;
  float mouseDist = length(st - mouse) * 2.0;
  float mouseInfluence = smoothstep(1.0, 0.0, mouseDist) * 0.15;

  // Layered noise
  float t = uTime * 0.08;
  float n1 = snoise(vec3(st * 1.5, t)) * 0.5 + 0.5;
  float n2 = snoise(vec3(st * 3.0 + 10.0, t * 1.3)) * 0.5 + 0.5;
  float n3 = snoise(vec3(st * 6.0 + 20.0, t * 0.7)) * 0.5 + 0.5;

  float n = n1 * 0.6 + n2 * 0.3 + n3 * 0.1 + mouseInfluence;

  // Color: dark base with very subtle warm/cool shifts
  vec3 color = vec3(0.04);
  color += n * 0.06;
  color.r += n1 * 0.02;
  color.b += n2 * 0.015;

  gl_FragColor = vec4(color, 1.0);
}
```

- [ ] **Step 5: Create components/shader/HeroScene.tsx**

```tsx
'use client'

import { useRef, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import vertexShader from './hero.vert'
import fragmentShader from './hero.frag'

function ShaderPlane() {
  const meshRef = useRef<THREE.Mesh>(null)
  const mouseRef = useRef(new THREE.Vector2(0.5, 0.5))
  const { size } = useThree()

  const uniforms = useRef({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uResolution: { value: new THREE.Vector2(size.width, size.height) },
  })

  useFrame(({ clock }) => {
    uniforms.current.uTime.value = clock.getElapsedTime()
    uniforms.current.uMouse.value.lerp(mouseRef.current, 0.05)
    uniforms.current.uResolution.value.set(size.width, size.height)
  })

  const handlePointerMove = useCallback((e: THREE.Event<PointerEvent>) => {
    const { uv } = e as any
    if (uv) {
      mouseRef.current.set(uv.x, uv.y)
    }
  }, [])

  return (
    <mesh ref={meshRef} onPointerMove={handlePointerMove}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms.current}
      />
    </mesh>
  )
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 1], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: false }}
        style={{ background: '#0a0a0a' }}
      >
        <ShaderPlane />
      </Canvas>
    </div>
  )
}
```

- [ ] **Step 6: Create components/ui/EntryLink.tsx**

```tsx
import Link from 'next/link'

export function EntryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-muted hover:text-fg transition-colors duration-300 text-lg tracking-wide"
    >
      {children}
    </Link>
  )
}
```

- [ ] **Step 7: Update app/page.tsx — full landing page**

```tsx
import dynamic from 'next/dynamic'
import { EntryLink } from '@/components/ui/EntryLink'

const HeroScene = dynamic(
  () => import('@/components/shader/HeroScene').then((m) => m.HeroScene),
  { ssr: false }
)

export default function Home() {
  return (
    <main className="relative flex h-screen flex-col items-center justify-center">
      <HeroScene />

      <h1 className="text-5xl font-light tracking-tight mb-12">xikai()</h1>

      <nav className="flex gap-8">
        <EntryLink href="/writing">writing</EntryLink>
        <span className="text-neutral-700">·</span>
        <EntryLink href="/projects">projects</EntryLink>
        <span className="text-neutral-700">·</span>
        <EntryLink href="/photos">photos</EntryLink>
        <span className="text-neutral-700">·</span>
        <EntryLink href="/about">about</EntryLink>
      </nav>
    </main>
  )
}
```

- [ ] **Step 8: Install Three.js deps if not already present and verify build**

```bash
npm install three @react-three/fiber @react-three/drei @types/three --legacy-peer-deps
npx next build
```

- [ ] **Step 9: Run dev server and visually verify landing page**

```bash
npx next dev -p 3001
```

Open http://localhost:3001 — should see dark background with subtle animated noise and centered "xikai()" + nav links.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: landing page with generative shader hero"
```

---

### Task 5: Writing pages (blog list + article detail)

**Files:**
- Create: `components/ui/ArticleRow.tsx`
- Create: `app/writing/page.tsx`
- Create: `app/writing/[slug]/page.tsx`

- [ ] **Step 1: Create components/ui/ArticleRow.tsx**

```tsx
import Link from 'next/link'

interface ArticleRowProps {
  title: string
  date: string | null
  slug: string
}

export function ArticleRow({ title, date, slug }: ArticleRowProps) {
  return (
    <Link
      href={`/writing/${slug}`}
      className="group flex items-baseline justify-between gap-4 py-3 border-b border-neutral-800/50"
    >
      <span className="text-fg group-hover:text-white transition-colors">
        {title}
      </span>
      {date && (
        <span className="shrink-0 text-sm text-muted tabular-nums">
          {new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
          })}
        </span>
      )}
    </Link>
  )
}
```

- [ ] **Step 2: Create app/writing/page.tsx**

```tsx
import { getBlogPosts } from '@/lib/notion'
import { ArticleRow } from '@/components/ui/ArticleRow'
import Link from 'next/link'

export const revalidate = 60

export default async function WritingPage() {
  const posts = await getBlogPosts()

  return (
    <main className="mx-auto max-w-reading px-6 py-24">
      <Link href="/" className="text-muted hover:text-fg transition-colors text-sm mb-16 block">
        &larr; xikai()
      </Link>

      <h1 className="text-3xl font-light tracking-tight mb-12">writing</h1>

      <div className="flex flex-col">
        {posts.map((post) => (
          <ArticleRow
            key={post.id}
            title={post.title}
            date={post.published}
            slug={post.slug}
          />
        ))}
      </div>
    </main>
  )
}
```

- [ ] **Step 3: Create app/writing/[slug]/page.tsx**

```tsx
import { getPageBySlug, getBlogPosts } from '@/lib/notion'
import { NotionRenderer } from '@/components/notion/renderer'
import { notFound } from 'next/navigation'
import Link from 'next/link'

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
    <main className="mx-auto max-w-reading px-6 py-24">
      <Link href="/writing" className="text-muted hover:text-fg transition-colors text-sm mb-16 block">
        &larr; writing
      </Link>

      <article className="mt-8">
        <NotionRenderer blocks={page.blocks} />
      </article>
    </main>
  )
}
```

- [ ] **Step 4: Verify build and test with dev server**

```bash
npx next build
npx next dev -p 3001
```

Open http://localhost:3001/writing — should show list of public blog posts. Click one to verify article rendering.

- [ ] **Step 5: Commit**

```bash
git add app/writing/ components/ui/ArticleRow.tsx
git commit -m "feat: writing pages with Notion-powered blog"
```

---

### Task 6: Projects page

**Files:**
- Create: `components/ui/ProjectCard.tsx`
- Create: `app/projects/page.tsx`

- [ ] **Step 1: Create components/ui/ProjectCard.tsx**

```tsx
interface ProjectCardProps {
  title: string
  description: string
  url: string | null
}

export function ProjectCard({ title, description, url }: ProjectCardProps) {
  const Wrapper = url ? 'a' : 'div'
  const linkProps = url
    ? { href: url, target: '_blank' as const, rel: 'noopener noreferrer' }
    : {}

  return (
    <Wrapper
      {...linkProps}
      className="group block border border-neutral-800 p-6 hover:-translate-y-0.5 hover:border-neutral-600 transition-all duration-200"
    >
      <h3 className="text-fg font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted leading-relaxed">{description}</p>
    </Wrapper>
  )
}
```

- [ ] **Step 2: Add getProjects to lib/notion.ts**

Append to `lib/notion.ts`:

```ts
export async function getProjects(): Promise<{ title: string; description: string; url: string | null }[]> {
  const blocks = await getPageBlocks(siteConfig.projectsPageId)

  // Projects page in Notion has child pages — each is a project
  // We extract the title and first text block as description
  const projects: { title: string; description: string; url: string | null }[] = []

  for (const block of blocks) {
    if (block.type === 'child_page') {
      const childBlocks = await getPageBlocks(block.id)
      const firstText = childBlocks.find((b: any) => b.type === 'paragraph')
      const description = firstText?.paragraph?.rich_text?.[0]?.plain_text ?? ''
      const linkBlock = childBlocks.find((b: any) => b.type === 'bookmark')
      const url = linkBlock?.bookmark?.url ?? null

      projects.push({
        title: block.child_page.title,
        description,
        url,
      })
    }
  }

  return projects
}
```

- [ ] **Step 3: Create app/projects/page.tsx**

```tsx
import { getProjects } from '@/lib/notion'
import { ProjectCard } from '@/components/ui/ProjectCard'
import Link from 'next/link'

export const revalidate = 60

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <main className="mx-auto max-w-grid px-6 py-24">
      <Link href="/" className="text-muted hover:text-fg transition-colors text-sm mb-16 block">
        &larr; xikai()
      </Link>

      <h1 className="text-3xl font-light tracking-tight mb-12">projects</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project, i) => (
          <ProjectCard key={i} {...project} />
        ))}
      </div>
    </main>
  )
}
```

- [ ] **Step 4: Verify build and visually check**

```bash
npx next build
npx next dev -p 3001
```

Open http://localhost:3001/projects

- [ ] **Step 5: Commit**

```bash
git add app/projects/ components/ui/ProjectCard.tsx lib/notion.ts
git commit -m "feat: projects page"
```

---

### Task 7: Photos page

**Files:**
- Create: `components/ui/PhotoCard.tsx`
- Create: `app/photos/page.tsx`

- [ ] **Step 1: Create components/ui/PhotoCard.tsx**

```tsx
'use client'

import { useRef } from 'react'

interface PhotoCardProps {
  src: string
  alt: string
}

export function PhotoCard({ src, alt }: PhotoCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={ref}
      className="my-4"
    >
      <img
        src={src}
        alt={alt}
        className="w-full transition-transform duration-700 ease-out"
        loading="lazy"
      />
    </div>
  )
}
```

- [ ] **Step 2: Add getPhotos to lib/notion.ts**

Append to `lib/notion.ts`:

```ts
export async function getPhotos(): Promise<{ src: string; alt: string }[]> {
  const blocks = await getPageBlocks(siteConfig.photosPageId)
  const photos: { src: string; alt: string }[] = []

  for (const block of blocks) {
    if (block.type === 'image') {
      const src =
        block.image.type === 'external'
          ? block.image.external.url
          : block.image.file.url
      const alt = block.image.caption?.[0]?.plain_text ?? ''
      photos.push({ src, alt })
    }
  }

  return photos
}
```

- [ ] **Step 3: Create app/photos/page.tsx**

```tsx
import { getPhotos } from '@/lib/notion'
import { PhotoCard } from '@/components/ui/PhotoCard'
import Link from 'next/link'

export const revalidate = 60

export default async function PhotosPage() {
  const photos = await getPhotos()

  return (
    <main className="mx-auto max-w-4xl px-6 py-24">
      <Link href="/" className="text-muted hover:text-fg transition-colors text-sm mb-16 block">
        &larr; xikai()
      </Link>

      <h1 className="text-3xl font-light tracking-tight mb-12">photos</h1>

      <div className="space-y-16">
        {photos.map((photo, i) => (
          <PhotoCard key={i} {...photo} />
        ))}
      </div>
    </main>
  )
}
```

- [ ] **Step 4: Verify build and visually check**

```bash
npx next build
npx next dev -p 3001
```

Open http://localhost:3001/photos

- [ ] **Step 5: Commit**

```bash
git add app/photos/ components/ui/PhotoCard.tsx lib/notion.ts
git commit -m "feat: photos page with large-format display"
```

---

### Task 8: About page

**Files:**
- Create: `app/about/page.tsx`

- [ ] **Step 1: Create app/about/page.tsx**

```tsx
import { siteConfig } from '@/lib/config'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <p className="text-xl leading-relaxed mb-6">
          Software engineer at Apple. Previously TikTok, Meituan.
        </p>
        <p className="text-xl leading-relaxed mb-6">
          Two-time Apple WWDC Swift Student Challenge winner.
        </p>
        <p className="text-xl leading-relaxed mb-12">
          I build things with code.
        </p>
        <div className="flex justify-center gap-6 text-muted">
          <a
            href={`https://github.com/${siteConfig.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-fg transition-colors"
          >
            GitHub
          </a>
          <span className="text-neutral-700">·</span>
          <a
            href={`https://www.linkedin.com/in/${siteConfig.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-fg transition-colors"
          >
            LinkedIn
          </a>
          <span className="text-neutral-700">·</span>
          <a
            href="mailto:realxikai@gmail.com"
            className="hover:text-fg transition-colors"
          >
            Email
          </a>
        </div>
      </div>

      <Link
        href="/"
        className="fixed bottom-8 text-muted hover:text-fg transition-colors text-sm"
      >
        &larr; xikai()
      </Link>
    </main>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npx next build
```

- [ ] **Step 3: Commit**

```bash
git add app/about/
git commit -m "feat: about page"
```

---

### Task 9: Final cleanup + .gitignore + Vercel env

**Files:**
- Modify: `.gitignore`
- Delete: remaining old files (public assets check, old configs)
- Create: `.env.example`

- [ ] **Step 1: Create .env.example**

```
NOTION_TOKEN=your_notion_integration_token_here
```

- [ ] **Step 2: Update .gitignore if needed**

Ensure `.env.local` is in `.gitignore` (it already is).

- [ ] **Step 3: Full build + dev server smoke test**

```bash
npx next build
npx next dev -p 3001
```

Visit all pages:
- http://localhost:3001 — shader hero + links
- http://localhost:3001/writing — blog list
- http://localhost:3001/writing/[any-slug] — article
- http://localhost:3001/projects — project grid
- http://localhost:3001/photos — photo gallery
- http://localhost:3001/about — bio

- [ ] **Step 4: Commit all remaining changes**

```bash
git add -A
git commit -m "chore: cleanup and finalize redesign"
```

- [ ] **Step 5: Push and deploy**

Once `gh auth login` is done:

```bash
git push origin master
```

Vercel will auto-deploy. Set `NOTION_TOKEN` in Vercel project settings → Environment Variables.

---

## Summary

| Task | What it builds | Estimated steps |
|------|---------------|-----------------|
| 1 | Scaffold: clean slate + App Router + Tailwind | 11 |
| 2 | Site config + Notion API client | 5 |
| 3 | Custom Notion block renderer | 12 |
| 4 | Landing page with shader hero | 10 |
| 5 | Writing pages (list + detail) | 5 |
| 6 | Projects page | 5 |
| 7 | Photos page | 5 |
| 8 | About page | 3 |
| 9 | Cleanup + deploy | 5 |
