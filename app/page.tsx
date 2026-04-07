import dynamic from 'next/dynamic'
import { EntryLink } from '@/components/ui/EntryLink'

const HeroScene = dynamic(
  () => import('@/components/shader/HeroScene').then((m) => m.HeroScene),
  { ssr: false },
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
