'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

export function LiquidGlassInit() {
  const [ready, setReady] = useState(0)

  useEffect(() => {
    if (ready < 2) return

    const w = window as any
    const timer = setTimeout(() => {
      if (!w.liquidGL) return

      try {
        w.liquidGL({
          target: '.glass-nav',
          snapshot: 'body',
          resolution: 2.0,
          refraction: 0.03,
          bevelDepth: 0.12,
          bevelWidth: 0.06,
          frost: 0.03,
          specular: true,
          shadow: true,
          reveal: 'fade',
          tilt: false,
          magnify: 1,
        })
      } catch (e) {
        console.warn('liquidGL error:', e)
      }
    }, 2500)

    return () => clearTimeout(timer)
  }, [ready])

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"
        strategy="afterInteractive"
        onLoad={() => setReady(r => r + 1)}
      />
      <Script
        src="/liquidGL.js"
        strategy="afterInteractive"
        onLoad={() => setReady(r => r + 1)}
      />
    </>
  )
}
