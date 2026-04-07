export interface BlogPost {
  id: string
  title: string
  slug: string
  description: string
  published: string | null
  tags: string[]
  isPublic: boolean
}

export interface Project {
  id: string
  title: string
  description: string
  url: string | null
}
