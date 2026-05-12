import type { MetadataRoute } from 'next'

export const revalidate = 3600 // 1 saatte bir yeniden oluştur

interface DjangoRecipeListItem {
  id: number
  created_at: string
}

interface DjangoPaginated<T> {
  count: number
  next: string | null
  results: T[]
}

async function fetchAllRecipeIds(apiUrl: string): Promise<DjangoRecipeListItem[]> {
  const items: DjangoRecipeListItem[] = []
  let next: string | null = `${apiUrl}/recipes/?page=1`
  let safety = 50
  while (next && safety-- > 0) {
    const res = await fetch(next, { next: { revalidate: 3600 } })
    if (!res.ok) break
    const data: DjangoPaginated<DjangoRecipeListItem> = await res.json()
    items.push(...data.results)
    next = data.next
  }
  return items
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: 'daily', priority: 1.0 },
    { url: `${siteUrl}/recipes`, changeFrequency: 'daily', priority: 0.9 },
  ]

  try {
    const recipes = await fetchAllRecipeIds(apiUrl)
    const recipeRoutes: MetadataRoute.Sitemap = recipes.map((r) => ({
      url: `${siteUrl}/recipes/${r.id}`,
      lastModified: new Date(r.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
    return [...staticRoutes, ...recipeRoutes]
  } catch {
    return staticRoutes
  }
}
