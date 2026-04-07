import Link from 'next/link'
import { getPhotos } from '@/lib/notion'
import { PhotoCard } from '@/components/ui/PhotoCard'

export const revalidate = 60

export default async function PhotosPage() {
  const photos = await getPhotos()

  return (
    <main className="mx-auto max-w-4xl px-6 py-20">
      <Link
        href="/"
        className="mb-12 inline-block text-sm text-muted transition-colors hover:text-fg"
      >
        &larr; xikai()
      </Link>
      <h1 className="mb-10 text-3xl font-light tracking-tight">photos</h1>
      <div className="space-y-16">
        {photos.map((photo, i) => (
          <PhotoCard key={i} src={photo.src} alt={photo.alt} />
        ))}
      </div>
    </main>
  )
}
