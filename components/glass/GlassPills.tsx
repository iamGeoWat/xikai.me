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
