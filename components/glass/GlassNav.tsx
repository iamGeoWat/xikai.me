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
