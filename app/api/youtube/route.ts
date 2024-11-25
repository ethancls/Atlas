import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest): Promise<Response> {

    const { searchParams } = req.nextUrl;
    const searchQuery = searchParams.get('search');

    if (!searchQuery) {
        return NextResponse.json({ error: 'Missing search query' }, { status: 400 });
    }

    try {
        const response = await fetch(`https://fastapi-atlas.vercel.app/api/youtube?search=${encodeURIComponent(searchQuery)}`);
        
        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { error: 'Error : ', details: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Error : ', error);
        return NextResponse.json(
            { error: 'Error : ', details: (error as Error).message },
            { status: 500 }
        );
    }
}
