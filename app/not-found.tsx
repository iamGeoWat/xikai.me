import Link from 'next/link'
import { PixelSprite } from '@/components/pixel-sprite'

export default function NotFound() {
  return (
    <div className="max-w-reading mx-auto px-10 py-32 text-center">
      <div className="flex justify-center mb-6">
        <PixelSprite name="ghost" size={6} color="#c05440" />
      </div>
      <h1 className="font-display text-6xl text-ink mb-4">404</h1>
      <p className="text-mute mb-8">This page drifted off.</p>
      <Link
        href="/"
        className="font-mono text-[11px] text-mute uppercase tracking-wider hover:text-ink transition-colors"
      >
        &larr; Home
      </Link>
    </div>
  )
}
