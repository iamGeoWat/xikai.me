import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getBlogPosts, getArticlePage } from '@/lib/notion'
import { fmtDate } from '@/lib/format'
import { NotionBlocks } from '@/components/notion/renderer'
import { Footer } from '@/components/footer'
import { Nav } from '@/components/nav'
import type { Metadata } from 'next'

export const revalidate = 60

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const result = await getArticlePage(slug)
  if (!result) return {}
  return {
    title: result.post.title,
    description: result.post.description,
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const result = await getArticlePage(slug)
  if (!result) notFound()

  const { post, recordMap, contentBlockIds } = result

  return (
    <div className="max-w-reading mx-auto px-10 pt-14 pb-20">
      <Nav />

      <article>
        <Link
          href={post.archived ? '/#archive' : '/#writing'}
          className="font-mono text-[11px] text-mute uppercase tracking-wider hover:text-ink transition-colors"
        >
          &larr; {post.archived ? 'Archive' : 'All writing'}
        </Link>

        <h1 className="font-display text-[44px] font-normal leading-[1.1] tracking-tight mt-6 mb-4 text-balance">
          {post.title}
        </h1>

        <div className="font-mono text-[11px] text-mute uppercase tracking-wider mb-12 flex items-center gap-3 flex-wrap">
          {post.published && <span>{fmtDate(post.published)}</span>}
          {post.tags.length > 0 && (
            <>
              <span>·</span>
              <span>{post.tags.join(' · ')}</span>
            </>
          )}
          {post.archived && (
            <>
              <span>·</span>
              <span className="text-accent">Archived</span>
            </>
          )}
        </div>

        {post.archived && post.archiveNote && (
          <div className="border-l-2 border-accent/60 pl-5 py-1 mb-10 text-mute italic font-display text-[15px] leading-[1.6]">
            {post.archiveNote}
          </div>
        )}

        <div className="article-content">
          <NotionBlocks blockIds={contentBlockIds} recordMap={recordMap} />
        </div>
      </article>

      <Footer />
    </div>
  )
}
