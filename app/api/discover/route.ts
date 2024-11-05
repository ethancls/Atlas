import { Movie } from "@/app/entities/Movie";
import { TVShow } from "@/app/entities/TVShow";
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response_movies = await fetch(`https://api.themoviedb.org/3/discover/movie`, {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
        'Accept': 'application/json',
      },
    });

    if (!response_movies.ok) {
      return NextResponse.json({ error: `Erreur ${response_movies.status}: ${response_movies.statusText}` }, { status: response_movies.status });
    }

    const data_movies = await response_movies.json();
    const movies: Movie[] = formatMovies(data_movies.results);

    const response_shows = await fetch(`https://api.themoviedb.org/3/discover/tv`, {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
        'Accept': 'application/json',
      },
    });

    if (!response_shows.ok) {
      return NextResponse.json({ error: `Erreur ${response_shows.status}: ${response_shows.statusText}` }, { status: response_shows.status });
    }

    const data_shows = await response_shows.json();
    const shows: TVShow[] = formatTVShow(data_shows.results);

    return NextResponse.json({ movies, shows });
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