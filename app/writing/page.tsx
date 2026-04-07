import Link from 'next/link'
import { getBlogPosts } from '@/lib/notion'
import { ArticleRow } from '@/components/ui/ArticleRow'

export const revalidate = 60

export default async function WritingPage() {
  const posts = await getBlogPosts()

  return (
    <main className="mx-auto max-w-reading px-6 py-20">
      <Link
        href="/"
        className="mb-12 inline-block text-sm text-muted transition-colors hover:text-fg"
      >
        &larr; xikai()
      </Link>
      <h1 className="mb-10 text-3xl font-light tracking-tight">writing</h1>
      <div>
        {posts.map((post) => (
          <ArticleRow
            key={post.id}
            title={post.title}
            slug={post.slug}
            published={post.published}
          />
        ))}
      </div>
    </main>
  )
}
