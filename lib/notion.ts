import { Client } from '@notionhq/client'
import type { BlogPost } from './types'
import { siteConfig } from './config'

const notion = new Client({ auth: process.env.NOTION_TOKEN })

export async function getBlogPosts(): Promise<BlogPost[]> {
  const response = await notion.databases.query({
    database_id: siteConfig.blogDatabaseId,
    filter: { property: 'Public', checkbox: { equals: true } },
    sorts: [{ property: 'Published', direction: 'descending' }],
  })

  return response.results.map((page: any) => {
    const props = page.properties
    return {
      id: page.id,
      title: props.Name?.title?.[0]?.plain_text ?? 'Untitled',
      slug: props.Slug?.rich_text?.[0]?.plain_text ?? page.id,
      description: props.Description?.rich_text?.[0]?.plain_text ?? '',
      published: props.Published?.date?.start ?? null,
      tags: props.Tags?.multi_select?.map((t: any) => t.name) ?? [],
    }
  })
}

export async function getPageBlocks(pageId: string): Promise<any[]> {
  const blocks: any[] = []
  let cursor: string | undefined

  do {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
      page_size: 100,
    })
    blocks.push(...response.results)
    cursor = response.has_more ? response.next_cursor ?? undefined : undefined
  } while (cursor)

  for (const block of blocks) {
    if ((block as any).has_children) {
      (block as any).children = await getPageBlocks(block.id)
    }
  }

  return blocks
}

export async function getPageBySlug(slug: string) {
  const response = await notion.databases.query({
    database_id: siteConfig.blogDatabaseId,
    filter: {
      and: [
        { property: 'Public', checkbox: { equals: true } },
        { property: 'Slug', rich_text: { equals: slug } },
      ],
    },
  })

  const page = response.results[0]
  if (!page) return null

  const blocks = await getPageBlocks(page.id)
  return { id: page.id, blocks }
}

export async function getProjects() {
  const blocks = await getPageBlocks(siteConfig.projectsPageId)
  const projects: { title: string; description: string; url: string | null }[] = []

  for (const block of blocks) {
    if (block.type === 'child_page') {
      const childBlocks = await getPageBlocks(block.id)
      const firstText = childBlocks.find((b: any) => b.type === 'paragraph')
      const description = firstText?.paragraph?.rich_text?.[0]?.plain_text ?? ''
      const linkBlock = childBlocks.find((b: any) => b.type === 'bookmark')
      const url = linkBlock?.bookmark?.url ?? null
      projects.push({ title: block.child_page.title, description, url })
    }
  }

  return projects
}

export async function getPhotos() {
  const blocks = await getPageBlocks(siteConfig.photosPageId)
  return blocks
    .filter((b: any) => b.type === 'image')
    .map((block: any) => ({
      src: block.image.type === 'external' ? block.image.external.url : block.image.file.url,
      alt: block.image.caption?.[0]?.plain_text ?? '',
    }))
}
