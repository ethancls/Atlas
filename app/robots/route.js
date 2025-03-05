import { NextResponse } from 'next/server';

export async function GET() {
  const robots = `
User-agent: *
Allow: /

Sitemap: https://atlas.ethancls.com/sitemap.xml
`;

  return new NextResponse(robots, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}