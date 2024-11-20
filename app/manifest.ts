import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Atlas',
    short_name: 'Atlas',
    description: 'A movie and tv show client for TMDB',
    start_url: '/',
    display: 'standalone',
    icons: [
      {
        src: '/public/movie.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/public/movie.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}