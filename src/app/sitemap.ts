import { MetadataRoute } from 'next';
import { db } from '../lib/db';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://youthprism.com';

  // Static routes
  const routes = ['', '/articles', '/categories', '/about', '/team', '/contact', '/search'];
  const staticSitemaps = routes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  try {
    // Dynamic Article routes
    const articles = await db.getArticles();
    const publishedArticles = articles.filter(a => a.status === 'published');
    const articleSitemaps = publishedArticles.map(article => ({
      url: `${baseUrl}/articles/${article.slug}`,
      lastModified: new Date(article.published_at || article.created_at).toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    // Dynamic Category routes
    const categories = await db.getCategories();
    const categorySitemaps = categories.map(cat => ({
      url: `${baseUrl}/categories/${cat.slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }));

    return [...staticSitemaps, ...articleSitemaps, ...categorySitemaps];
  } catch (err) {
    console.error('Failed to generate sitemap:', err);
    return staticSitemaps;
  }
}
