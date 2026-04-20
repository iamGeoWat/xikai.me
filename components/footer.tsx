import { PixelSprite } from './pixel-sprite'
import { siteConfig } from '@/lib/site-config'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="mt-20 pt-5 border-t border-rule flex justify-between font-mono text-[11px] text-mute tracking-wide">
      <span>© {year} {siteConfig.author} (Casey)</span>
      <span className="flex items-center gap-2.5">
        hand-written · no trackers
        <PixelSprite name="ghost" size={3} color="#6c6559" />
      </span>
    </footer>
  )
}
