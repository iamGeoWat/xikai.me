'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

export function LiquidGlassInit() {
  const [ready, setReady] = useState(0)

  useEffect(() => {
    if (ready < 2) return // need both scripts

    const w = window as any

    // Wait for shader to render + mirror canvas to sync
    const timer = setTimeout(() => {
      if (!w.liquidGL) {
        console.warn('[LiquidGlass] liquidGL not found')
        return
      }

      // Verify mirror canvas has content
      const mirror = document.getElementById('shader-mirror') as HTMLCanvasElement
      if (mirror) {
        console.log('[LiquidGlass] Mirror canvas:', mirror.width, 'x', mirror.height)
      }

      try {
        const result = w.liquidGL({
          target: '.liquid-glass',
          snapshot: 'body',
          resolution: 1.5,
          refraction: 0.035,
          bevelDepth: 0.12,
          bevelWidth: 0.07,
          frost: 0.04,
          specular: true,
          shadow: true,
          reveal: 'fade',
          tilt: false,
          magnify: 1,
        })
        console.log('[LiquidGlass] Initialized:', result)
      } catch (e) {
        console.warn('[LiquidGlass] Init error:', e)
      }
    }, 3000) // 3s delay: scripts load + shader renders + mirror syncs

    return () => clearTimeout(timer)
  }, [ready])

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"
        strategy="afterInteractive"
        onLoad={() => setReady((r) => r + 1)}
      />
      <Script
        src="/liquidGL.js"
        strategy="afterInteractive"
        onLoad={() => setReady((r) => r + 1)}
      />
    </>
  )
}
