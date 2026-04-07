export interface BlogPost {
  id: string
  title: string
  slug: string
  description: string
  published: string | null
  tags: string[]
}

export interface Project {
  title: string
  description: string
  url: string | null
}
