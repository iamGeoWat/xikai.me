import { getBlogPosts } from '@/lib/notion'
import { ArticleRow } from '@/components/ui/ArticleRow'
import Link from 'next/link'

export const revalidate = 60

export default async function WritingPage() {
  const posts = await getBlogPosts()

  return (
    <main className="mx-auto max-w-reading px-6 py-24">
      <Link href="/" className="text-muted hover:text-fg transition-colors text-sm mb-16 block">
        &larr; xikai()
      </Link>

      <h1 className="text-3xl font-light tracking-tight mb-12">writing</h1>

      <div className="flex flex-col">
        {posts.map((post) => (
          <ArticleRow
            key={post.id}
            title={post.title}
            date={post.published}
            slug={post.slug}
          />
        ))}
      </div>
    </main>
  )
}
