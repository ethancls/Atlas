import { Movie } from "@/app/entities/Movie";
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/popular`, {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Erreur ${response.status}: ${response.statusText}` }, { status: response.status });
    }

    const data = await response.json();
    const movies: Movie[] = data.results;

    return NextResponse.json(movies);
  } catch (error) {
    console.error("Erreur lors de la récupération des films:", error);
    return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
  }
}