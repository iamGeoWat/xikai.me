import { getPageBySlug, getBlogPosts } from '@/lib/notion'
import { NotionRenderer } from '@/components/notion/renderer'
import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'

const GlassNav = dynamic(
  () => import('@/components/glass/GlassNav').then((m) => m.GlassNav),
  { ssr: false }
)

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
    <>
      <GlassNav href="/" label="xikai()" />
      <main className="mx-auto max-w-reading px-6 py-24">
        <article className="mt-8">
          <NotionRenderer blocks={page.blocks} />
        </article>
      </main>
    </>
  )
}
