import { Movie } from "@/app/entities/Movie";

export class MovieRepository {

    async fetchPopular(): Promise<{ movies: Movie[] }> {
        const response = await fetch("/api/movies/popular");
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return { movies: data };
    }

    async fetchNowPlaying(): Promise<{ movies: Movie[] }> {
        const response = await fetch("/api/movies/now-playing");
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return { movies: data };
    }

    async fetchTopRated(): Promise<{ movies: Movie[] }> {
        const response = await fetch("/api/movies/top-rated");
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return { movies: data };
    }
}