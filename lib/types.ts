export interface BlogPost {
  id: string
  title: string
  slug: string
  description: string
  published: string | null
  tags: string[]
  featured: boolean
}

export interface Project {
  id: string
  title: string
  description: string
  url: string | null
}

export interface Photo {
  src: string
  alt: string
  href?: string
  width?: number
  height?: number
}
