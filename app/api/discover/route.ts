import { Movie } from "@/app/entities/Movie";
import { TVShow } from "@/app/entities/TVShow";
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";

export async function GET() {
  try {

    const session = await getServerSession() as Session & { imdbKey: string };

    const imdbKey = session.imdbKey;

    const response_movies = await fetch(`https://api.themoviedb.org/3/discover/movie`, {
      headers: {
        'Authorization': `Bearer ${imdbKey}`,
        'Accept': 'application/json',
      },
    });

    if (!response_movies.ok) {
      return NextResponse.json({ error: `Erreur ${response_movies.status}: ${response_movies.statusText}` }, { status: response_movies.status });
    }

    const data_movies = await response_movies.json();
    const movies: Movie[] = data_movies.results;

    const response_shows = await fetch(`https://api.themoviedb.org/3/discover/tv`, {
      headers: {
        'Authorization': `Bearer ${imdbKey}`,
        'Accept': 'application/json',
      },
    });

    if (!response_shows.ok) {
      return NextResponse.json({ error: `Erreur ${response_shows.status}: ${response_shows.statusText}` }, { status: response_shows.status });
    }

    const data_shows = await response_shows.json();
    const shows: TVShow[] = data_shows.results;

    return NextResponse.json({ movies, shows });
  } catch (error) {
    console.error("Erreur lors de la récupération des films:", error);
    return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
  }
}