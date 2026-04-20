import type { Photo } from './types'

const USERNAME = 'shekai'
const ENDPOINT = `https://api.unsplash.com/users/${USERNAME}/photos`

interface UnsplashPhoto {
  id: string
  description: string | null
  alt_description: string | null
  urls: {
    raw: string
    full: string
    regular: string
    small: string
  }
  links: {
    html: string
  }
  width: number
  height: number
}

/**
 * Fetches photos from the user's Unsplash profile.
 * Requires UNSPLASH_ACCESS_KEY env var (free tier: 50 req/hour).
 * Get one at https://unsplash.com/oauth/applications
 */
export async function getUnsplashPhotos(count = 24): Promise<Photo[]> {
  const key = process.env.UNSPLASH_ACCESS_KEY
  if (!key) {
    return []
  }

  try {
    const url = `${ENDPOINT}?per_page=${count}&order_by=latest`
    const res = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${key}`,
        'Accept-Version': 'v1',
      },
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      console.error('Unsplash fetch failed:', res.status, await res.text())
      return []
    }

    const data: UnsplashPhoto[] = await res.json()

    return data.map((p) => ({
      src: p.urls.regular,
      alt: p.description || p.alt_description || '',
      href: p.links.html,
      width: p.width,
      height: p.height,
    }))
  } catch (err) {
    console.error('Unsplash error:', err)
    return []
  }
}
