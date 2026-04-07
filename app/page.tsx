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
