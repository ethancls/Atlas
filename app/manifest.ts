import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Atlas',
    short_name: 'Atlas',
    description: 'A movie and tv show client for TMDB',
    start_url: '/',
    display: 'standalone',
    icons: [],
  }
}