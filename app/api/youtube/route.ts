import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest): Promise<Response> {
    // Récupérer la query "search" de l'URL
    const { searchParams } = req.nextUrl;
    const searchQuery = searchParams.get('search');

    if (!searchQuery) {
        return NextResponse.json({ error: 'Missing search query' }, { status: 400 });
    }

    try {
        // Faire une requête GET à l'API FastAPI
        const response = await fetch(`https://fastapi-atlas.vercel.app/api/youtube?search=${encodeURIComponent(searchQuery)}`);
        
        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { error: 'Erreur lors de la requête à l’API FastAPI', details: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Erreur lors de la requête à l’API FastAPI :', error);
        return NextResponse.json(
            { error: 'Erreur lors de la requête à l’API FastAPI', details: (error as Error).message },
            { status: 500 }
        );
    }
}
