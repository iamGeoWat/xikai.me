import { getPhotos } from '@/lib/notion'
import { PhotoCard } from '@/components/ui/PhotoCard'
import Link from 'next/link'

export const revalidate = 60

export default async function PhotosPage() {
  const photos = await getPhotos()

  return (
    <main className="mx-auto max-w-4xl px-6 py-24">
      <Link href="/" className="text-muted hover:text-fg transition-colors text-sm mb-16 block">
        &larr; xikai()
      </Link>

      <h1 className="text-3xl font-light tracking-tight mb-12">photos</h1>

      <div className="space-y-16">
        {photos.map((photo, i) => (
          <PhotoCard key={i} {...photo} />
        ))}
      </div>
    </main>
  )
}
