import { TVShow } from "@/app/entities/TVShow";
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/tv/popular`, {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Erreur ${response.status}: ${response.statusText}` }, { status: response.status });
    }

    const data = await response.json();
    const shows: TVShow[] = formatTVShow(data.results);

    return NextResponse.json(shows);
  } catch (error) {
    console.error("Erreur lors de la récupération des films:", error);
    return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
  }
}

function formatTVShow(data: any[]): TVShow[] {
  return data.map(item => ({
    id: item.id,
    name: item.name,
    poster_path: item.poster_path,
    overview: item.overview,
    genre_ids: item.genre_ids,
    origin_country: item.origin_country,
    first_air_date: item.first_air_date,
    vote_average: item.vote_average,
    vote_count: item.vote_count,
    popularity: item.popularity,
  }));
}