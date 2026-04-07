import { Client } from '@notionhq/client'
import { siteConfig } from '@/lib/config'
import type { BlogPost, Project } from '@/lib/types'

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

// ---------------------------------------------------------------------------
// Blog Posts
// ---------------------------------------------------------------------------

export async function getBlogPosts(): Promise<BlogPost[]> {
  const response = await notion.databases.query({
    database_id: siteConfig.blogDatabaseId,
    filter: {
      property: 'Public',
      checkbox: { equals: true },
    },
    sorts: [
      { property: 'Published', direction: 'descending' },
    ],
  })

  return response.results.map((page) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const props = (page as any).properties
    return {
      id: page.id,
      title: props.Name?.title?.[0]?.plain_text ?? '',
      slug: props.Slug?.rich_text?.[0]?.plain_text ?? '',
      description: props.Description?.rich_text?.[0]?.plain_text ?? '',
      published: props.Published?.date?.start ?? null,
      tags: props.Tags?.multi_select?.map((t: { name: string }) => t.name) ?? [],
      isPublic: props.Public?.checkbox ?? false,
    }
  })
}

export async function getPageBySlug(
  slug: string,
): Promise<{ id: string; blocks: any[] } | null> {
  const response = await notion.databases.query({
    database_id: siteConfig.blogDatabaseId,
    filter: {
      and: [
        { property: 'Slug', rich_text: { equals: slug } },
        { property: 'Public', checkbox: { equals: true } },
      ],
    },
    page_size: 1,
  })

  const page = response.results[0]
  if (!page) return null

  const blocks = await getPageBlocks(page.id)
  return { id: page.id, blocks }
}

// ---------------------------------------------------------------------------
// Blocks (recursive)
// ---------------------------------------------------------------------------

export async function getPageBlocks(pageId: string): Promise<any[]> {
  const blocks: any[] = []
  let cursor: string | undefined

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
      page_size: 100,
    })

    for (const block of response.results) {
      const b = block as any
      if (b.has_children) {
        b.children = await getPageBlocks(b.id)
      }
      blocks.push(b)
    }

    if (!response.has_more) break
    cursor = response.next_cursor ?? undefined
  }

  return blocks
}

/** Alias for getPageBlocks */
export const getPageContent = getPageBlocks

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export async function getProjects(): Promise<Project[]> {
  const children = await getPageBlocks(siteConfig.projectsPageId)

  const projects: Project[] = []

  for (const child of children) {
    if (child.type !== 'child_page') continue

    const blocks = await getPageBlocks(child.id)

    let description = ''
    let url: string | null = null

    for (const block of blocks) {
      if (
        block.type === 'paragraph' &&
        !description &&
        block.paragraph?.rich_text?.length
      ) {
        description = block.paragraph.rich_text
          .map((t: { plain_text: string }) => t.plain_text)
          .join('')
      }
      if (block.type === 'bookmark' && block.bookmark?.url) {
        url = block.bookmark.url
      }
    }

    projects.push({
      id: child.id,
      title: child.child_page?.title ?? '',
      description,
      url,
    })
  }

  return projects
}

// ---------------------------------------------------------------------------
// Photos
// ---------------------------------------------------------------------------

export async function getPhotos(): Promise<
  { src: string; alt: string }[]
> {
  const blocks = await getPageBlocks(siteConfig.photosPageId)

  return blocks
    .filter((b) => b.type === 'image')
    .map((b) => {
      const image = b.image
      const src =
        image?.type === 'external'
          ? image.external?.url
          : image?.file?.url
      const alt =
        image?.caption?.[0]?.plain_text ?? ''

      return { src: src ?? '', alt }
    })
    .filter((p) => p.src !== '')
}
