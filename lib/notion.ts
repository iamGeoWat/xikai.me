import { Client } from '@notionhq/client'
import type { BlogPost } from './types'
import { siteConfig } from './config'

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

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

  return response.results.map((page: any) => {
    const props = page.properties
    return {
      id: page.id,
      title: props.Name?.title?.[0]?.plain_text ?? 'Untitled',
      slug: props.Slug?.rich_text?.[0]?.plain_text ?? page.id,
      description: props.Description?.rich_text?.[0]?.plain_text ?? '',
      published: props.Published?.date?.start ?? null,
      tags: props.Tags?.multi_select?.map((t: any) => t.name) ?? [],
      isPublic: props.Public?.checkbox ?? false,
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

export async function getPageBySlug(slug: string): Promise<{ id: string; blocks: any[] } | null> {
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

export async function getPageContent(pageId: string): Promise<any[]> {
  return getPageBlocks(pageId)
}

export async function getProjects(): Promise<{ title: string; description: string; url: string | null }[]> {
  const response = await notion.databases.query({
    database_id: '1526a1abb9464fed87e99266cc653cc6',
  })

  return response.results.map((page: any) => {
    const props = page.properties
    const title = props.Name?.title?.[0]?.plain_text ?? props.title?.title?.[0]?.plain_text ?? 'Untitled'
    // Try common property names for description and URL
    const description = props.Description?.rich_text?.[0]?.plain_text ?? props.description?.rich_text?.[0]?.plain_text ?? ''
    const url = props.URL?.url ?? props.Link?.url ?? props.url?.url ?? null
    return { title, description, url }
  })
}

export async function getPhotos(): Promise<{ src: string; alt: string }[]> {
  const blocks = await getPageBlocks(siteConfig.photosPageId)
  const photos: { src: string; alt: string }[] = []

  function extractImages(blocks: any[]) {
    for (const block of blocks) {
      if (block.type === 'image') {
        const src = block.image.type === 'external'
          ? block.image.external.url
          : block.image.file.url
        const alt = block.image.caption?.[0]?.plain_text ?? ''
        photos.push({ src, alt })
      }
      if (block.children) {
        extractImages(block.children)
      }
    }
  }

  extractImages(blocks)
  return photos
}
