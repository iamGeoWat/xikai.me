'use client'

export function PhotoCard({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="mx-auto">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full"
      />
    </div>
  )
}
