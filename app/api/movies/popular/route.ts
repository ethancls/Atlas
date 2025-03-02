export const dynamic = 'force-dynamic';

import { Movie } from "@/app/entities/Movie";
import { NextResponse } from 'next/server';

export async function GET() {
  try {

    const imdbKey = process.env.TMDB_KEY;

    const response = await fetch(`https://api.themoviedb.org/3/movie/popular`, {
      headers: {
        'Authorization': `Bearer ${imdbKey}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Error ${response.status}: ${response.statusText}` }, { status: response.status });
    }

    const data = await response.json();
    const movies: Movie[] = data.results;

    return NextResponse.json(movies);
  } catch (error) {
    console.error("Error fetching movies:", error);
    return NextResponse.json({ error: "An error occured." }, { status: 500 });
  }
}