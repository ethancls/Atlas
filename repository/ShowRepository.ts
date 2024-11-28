import { TVShow } from "@/app/entities/TVShow";

export class ShowRepository {

    async fetchPopular(): Promise<{ shows: TVShow[] }> {
        const response = await fetch("/api/shows/popular");
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return { shows: data };
    }

    async fetchOnTheAir(): Promise<{ shows: TVShow[] }> {
        const response = await fetch("/api/shows/on-the-air");
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return { shows: data };
    }

    async fetchTopRated(): Promise<{ shows: TVShow[] }> {
        const response = await fetch("/api/shows/top-rated");
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return { shows: data };
    }
}