import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        message: 'Available movies API endpoints',
        endpoints: [
            { method: 'GET', url: '/api/movies/now-playing' },
            { method: 'GET', url: '/api/movies/popular' },
            { method: 'GET', url: '/api/movies/top-rated' },
        ],
    });
}