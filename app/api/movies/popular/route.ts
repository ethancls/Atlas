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
    const movies: Movie[] = formatMovies(data.results);

    return NextResponse.json(movies);
  } catch (error) {
    console.error("Erreur lors de la récupération des films:", error);
    return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
  }
}

function formatMovies(data: any[]): Movie[] {
  return data.map(item => ({
    id: item.id,
    title: item.title,
    poster_path: item.poster_path,
    overview: item.overview,
    genre_ids: item.genre_ids,
    release_date: item.release_date,
    vote_average: item.vote_average,
    vote_count: item.vote_count,
    popularity: item.popularity,
  }));
}