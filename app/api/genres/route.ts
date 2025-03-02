import { Genre } from "@/app/entities/Genre";
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {

        const imdbKey = process.env.TMDB_KEY;
        
        const response_movies = await fetch(`https://api.themoviedb.org/3/genre/movie/list`, {
            headers: {
                'Authorization': `Bearer ${imdbKey}`,
                'Accept': 'application/json',
            },
        });

        if (!response_movies.ok) {
            return NextResponse.json({ error: `Erreur ${response_movies.status}: ${response_movies.statusText}` }, { status: response_movies.status });
        }

        const data_movies = await response_movies.json();
        let genres: Genre[] = data_movies.genres;

        const response_shows = await fetch(`https://api.themoviedb.org/3/genre/tv/list`, {
            headers: {
                'Authorization': `Bearer ${imdbKey}`,
                'Accept': 'application/json',
            },
        });

        if (!response_shows.ok) {
            return NextResponse.json({ error: `Erreur ${response_shows.status}: ${response_shows.statusText}` }, { status: response_shows.status });
        }

        const data_shows = await response_shows.json();
        const showGenres = data_shows.genres;

        const unique: Genre[] = showGenres.filter((showGenre: Genre) => !genres.some((movieGenre: Genre) => movieGenre.id === showGenre.id));
        genres = genres.concat(unique);

        return NextResponse.json({ genres });
    } catch (error) {
        console.error("Erreur lors de la récupération des genres:", error);
        return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
    }
}