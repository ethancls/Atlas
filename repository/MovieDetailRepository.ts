import { MovieDetail } from "@/app/entities/MovieDetail";
import { CastMember } from "@/app/entities/CastMember";
import { ImageData } from "@/app/entities/ImageData";
import { Movie } from "@/app/entities/Movie";

const API_BASE_URL = "https://api.themoviedb.org/3";

export class MovieDetailRepository {
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

  async fetchMovieDetails(id: string): Promise<MovieDetail> {
    const response = await fetch(`${API_BASE_URL}/movie/${id}`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  async fetchMovieCredits(id: string): Promise<CastMember[]> {
    const response = await fetch(`${API_BASE_URL}/movie/${id}/credits`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    return data.cast;
  }

  async fetchMovieImages(id: string): Promise<ImageData[]> {
    const response = await fetch(`${API_BASE_URL}/movie/${id}/images?include_image_language=en%2Cnull`, {
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

  async fetchRelatedMovies(id: string): Promise<Movie[]> {
    const response = await fetch(`${API_BASE_URL}/movie/${id}/recommendations`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    return data.results;
  }

  async fetchMovieCertification(id: string): Promise<string | null> {
    const response = await fetch(`${API_BASE_URL}/movie/${id}/release_dates`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();

    // Map raw certification to user-friendly format
    const certificationMap: { [key: string]: string } = {
      "G": "0+",
      "PG": "10+",
      "PG-13": "13+",
      "R": "17+",
      "NC-17": "18+",
      "R+": "17+",
      "NR": "Not Rated",
      "UR": "Not Rated",
      "TV-Y": "0+",
      "TV-Y7": "7+",
      "TV-G": "0+",
      "TV-PG": "10+",
      "TV-14": "14+",
      "TV-MA": "17+",
    };

    const usRelease = data.results.find(
      (release: { iso_3166_1: string }) => release.iso_3166_1 === "US"
    );
    if (usRelease) {
      const usCertification = usRelease.release_dates.find(
        (release: { certification: string }) => release.certification
      );
      if (usCertification) {
        return certificationMap[usCertification.certification] || null;
      }
    }
    return null;
  }
  
  async fetchYoutubeTrailer(movie: Movie): Promise<string | null> {
    const youtubeResponse = await fetch(
      `/api/youtube?search=${encodeURIComponent(
        movie.title + new Date(movie.release_date).getFullYear() + " 4k movie trailer official"
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