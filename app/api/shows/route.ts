import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    return NextResponse.json({
        message: 'Available shows API endpoints',
        endpoints: [
            { method: 'GET', url: '/api/shows/now-playing' },
            { method: 'GET', url: '/api/shows/popular' },
            { method: 'GET', url: '/api/shows/top-rated' },
        ],
    });
}