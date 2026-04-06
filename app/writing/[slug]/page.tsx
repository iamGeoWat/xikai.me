import { getPageBySlug, getBlogPosts } from '@/lib/notion'
import { NotionRenderer } from '@/components/notion/renderer'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const revalidate = 60

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = await getPageBySlug(slug)
  if (!page) notFound()

  return (
    <main className="mx-auto max-w-reading px-6 py-24">
      <Link href="/" className="text-muted hover:text-fg transition-colors text-sm mb-16 block">
        &larr; back
      </Link>

      <article className="mt-8">
        <NotionRenderer blocks={page.blocks} />
      </article>
    </main>
  )
}
