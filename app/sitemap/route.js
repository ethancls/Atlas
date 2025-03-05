import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = "https://atlas.ethancls.com"; // Remplace par ton domaine

  const pages = [
    "", // Homepage (redirigée vers /discover)
    "discover",
    "movies/now-playing",
    "movies/popular",
    "movies/top-rated",
    "shows/on-the-air",
    "shows/popular",
    "shows/top-rated"
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages
        .map((page) => `
          <url>
            <loc>${baseUrl}/${page}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
            <changefreq>daily</changefreq>
            <priority>${page === "" ? 1.0 : 0.8}</priority>
          </url>
        `)
        .join("")}
    </urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}