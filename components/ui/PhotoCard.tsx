'use client'

import { useRef } from 'react'

interface PhotoCardProps {
  src: string
  alt: string
}

export function PhotoCard({ src, alt }: PhotoCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div ref={ref} className="my-4">
      <img
        src={src}
        alt={alt}
        className="w-full transition-transform duration-700 ease-out"
        loading="lazy"
      />
    </div>
  )
}
