import { ShowDetail } from "@/app/entities/ShowDetail";
import { CastMember } from "@/app/entities/CastMember";
import { ImageData } from "@/app/entities/ImageData";
import { SeasonDetail } from "@/app/entities/SeasonDetail";

const API_BASE_URL = "https://api.themoviedb.org/3";

export class ShowDetailRepository {
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    private getHeaders() {
        return {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json;charset=utf-8",
        };
    }

    async fetchShowDetails(id: string): Promise<ShowDetail> {
        const response = await fetch(`${API_BASE_URL}/tv/${id}`, {
            headers: this.getHeaders(),
        });
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
    }

    async fetchShowCredits(id: string): Promise<CastMember[]> {
        const response = await fetch(`${API_BASE_URL}/tv/${id}/credits`, {
            headers: this.getHeaders(),
        });
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        return data.cast;
    }

    async fetchShowImages(id: string): Promise<ImageData[]> {
        const response = await fetch(`${API_BASE_URL}/tv/${id}/images`, {
            headers: this.getHeaders(),
        });
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();

        return [
            ...data.backdrops.map((image: { file_path: string }) => ({
                type: "backdrop",
                file_path: image.file_path,
            })),
            ...data.logos.map((image: { file_path: string }) => ({
                type: "logo",
                file_path: image.file_path,
            })),
            ...data.posters.map((image: { file_path: string }) => ({
                type: "poster",
                file_path: image.file_path,
            })),
        ];
    }

    async fetchRelatedShows(id: string): Promise<ShowDetail[]> {
        const response = await fetch(`${API_BASE_URL}/tv/${id}/recommendations`, {
            headers: this.getHeaders(),
        });
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        return data.results;
    }

    async fetchSeasons(id: string): Promise<SeasonDetail[]> {
        const response = await fetch(`${API_BASE_URL}/tv/${id}`, {
            headers: this.getHeaders(),
        });
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        return data.seasons.map((season: any) => ({
            id: season.id,
            name: season.name,
            overview: season.overview,
            poster_path: season.poster_path,
            season_number: season.season_number,
            episodes: [],
        }));
    }

    async fetchSeasonDetails(showId: string, seasonNumber: number): Promise<SeasonDetail> {
        const response = await fetch(`${API_BASE_URL}/tv/${showId}/season/${seasonNumber}`, {
            headers: this.getHeaders(),
        });
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
    }

    async fetchYoutubeTrailer(show: ShowDetail): Promise<string | null> {
        const youtubeResponse = await fetch(
            `/api/youtube?search=${encodeURIComponent(
                show.name + new Date(show.first_air_date).getFullYear() + " trailer official season 1"
            )}`
        );

        const youtubeData = await youtubeResponse.json();
        if (youtubeData?.result?.[0]?.id) {
            return (
                `https://www.youtube.com/embed/${youtubeData.result[0].id}?autoplay=1&vq=hd2160&mute=1&enablejsapi=1&modestbranding=1&rel=0&controls=0&showinfo=1@iv_load_policy=3&autohide=1&playsinline=1&loop=1`
            );
        }
        return null;
    }
}