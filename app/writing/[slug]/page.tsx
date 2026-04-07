import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getBlogPosts, getPageBySlug } from '@/lib/notion'
import { NotionRenderer } from '@/components/notion/renderer'

export const revalidate = 60

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts
    .filter((post) => post.slug)
    .map((post) => ({ slug: post.slug }))
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
    <main className="mx-auto max-w-reading px-6 py-20">
      <Link
        href="/writing"
        className="mb-12 inline-block text-sm text-muted transition-colors hover:text-fg"
      >
        &larr; writing
      </Link>
      <article className="prose-custom space-y-5">
        <NotionRenderer blocks={page.blocks} />
      </article>
    </main>
  )
}
