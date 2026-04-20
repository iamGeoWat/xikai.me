import { NotionAPI } from 'notion-client'
import {
  getTextContent,
  getPageProperty,
  getDateValue,
  idToUuid,
} from 'notion-utils'
import type { ExtendedRecordMap, Block } from 'notion-types'
import { siteConfig } from './site-config'
import type { BlogPost, Project } from './types'

const api = new NotionAPI()

export async function getPage(pageId: string): Promise<ExtendedRecordMap> {
  return api.getPage(pageId)
}

/** notion-client v7 double-wraps records as { value: { value: ... } }. Unwrap safely. */
function unwrap<T = any>(entry: any): T | undefined {
  if (!entry) return undefined
  const first = entry.value ?? entry
  if (
    first &&
    typeof first === 'object' &&
    'value' in first &&
    !('type' in first) &&
    !('schema' in first)
  ) {
    return first.value as T
  }
  return first as T
}

function getBlockValue(recordMap: ExtendedRecordMap, blockId: string): Block | undefined {
  return unwrap<Block>(recordMap.block[blockId])
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const recordMap = await getPage(siteConfig.rootPageId)

  const collectionId = Object.keys(recordMap.collection ?? {})[0]
  if (!collectionId) return []

  const viewId = Object.keys(recordMap.collection_view ?? {})[0]
  const blockIds =
    recordMap.collection_query?.[collectionId]?.[viewId]?.collection_group_results?.blockIds ??
    (recordMap.collection_query?.[collectionId]?.[viewId] as any)?.blockIds ??
    []

  const posts: BlogPost[] = []

  for (const blockId of blockIds) {
    const block = getBlockValue(recordMap, blockId)
    if (!block) continue

    const title = getTextContent(block.properties?.title) || ''
    if (!title) continue

    const isPublic = getPageProperty<boolean>('Public', block, recordMap)
    if (!isPublic) continue

    const rawSlug = getPageProperty<string>('Slug', block, recordMap)
    const slug = rawSlug?.trim() || slugify(title)
    const description = getPageProperty<string>('Description', block, recordMap) || ''
    const tagsRaw = getPageProperty<string[]>('Tags', block, recordMap) as unknown
    const tags: string[] = Array.isArray(tagsRaw)
      ? (tagsRaw as string[])
      : typeof tagsRaw === 'string'
        ? (tagsRaw as string).split(',').map((t) => t.trim()).filter(Boolean)
        : []
    const featured = getPageProperty<boolean>('Featured', block, recordMap) || false

    const publishedRaw = getPageProperty<any>('Published', block, recordMap)
    let published: string | null = null
    if (publishedRaw) {
      const dateVal = getDateValue(publishedRaw)
      if (dateVal?.type === 'date' && dateVal.start_date) {
        published = dateVal.start_date
      } else if (typeof publishedRaw === 'string') {
        published = publishedRaw
      }
    }

    posts.push({ id: blockId, title, slug, description, published, tags, featured })
  }

  posts.sort((a, b) => {
    if (!a.published) return 1
    if (!b.published) return -1
    return b.published.localeCompare(a.published)
  })

  return posts
}

export async function getProjects(): Promise<Project[]> {
  const recordMap = await getPage(siteConfig.projectsPageId)

  // Projects live in an embedded collection view on the projects page
  const collectionId = Object.keys(recordMap.collection ?? {})[0]
  if (!collectionId) return []

  const viewId = Object.keys(recordMap.collection_view ?? {})[0]
  const blockIds =
    recordMap.collection_query?.[collectionId]?.[viewId]?.collection_group_results?.blockIds ??
    (recordMap.collection_query?.[collectionId]?.[viewId] as any)?.blockIds ??
    []

  const projects: Project[] = []

  for (const blockId of blockIds) {
    const block = getBlockValue(recordMap, blockId)
    if (!block) continue

    const title = getTextContent(block.properties?.title) || ''
    if (!title) continue

    const description = getPageProperty<string>('Description', block, recordMap) || ''

    // Try common URL/link properties
    const url =
      getPageProperty<string>('URL', block, recordMap) ||
      getPageProperty<string>('Link', block, recordMap) ||
      getPageProperty<string>('Github', block, recordMap) ||
      null

    projects.push({ id: blockId, title, description, url })
  }

  return projects
}

export async function getArticlePage(slug: string) {
  const posts = await getBlogPosts()
  const post = posts.find((p) => p.slug === slug)
  if (!post) return null

  const recordMap = await getPage(post.id)
  const pageBlock = getBlockValue(recordMap, idToUuid(post.id))
  const contentBlockIds = pageBlock?.content || []

  return { post, recordMap, contentBlockIds }
}
