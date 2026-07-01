import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'The Youth Prism',
    short_name: 'YouthPrism',
    description: 'Premium editorial exploring technology, policy, health, and global affairs through the lens of youth.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0F172A',
    theme_color: '#FFE9A1',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}