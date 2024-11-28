import { Movie } from "@/app/entities/Movie";
import { TVShow } from "@/app/entities/TVShow";
import { MovieDetail } from "@/app/entities/MovieDetail";
import { useQuery } from "react-query";

const API_BASE_URL = "https://api.themoviedb.org/3";

export class DiscoverRepository {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async fetchDiscover(): Promise<{ movies: Movie[]; shows: TVShow[] }> {
    const response = await fetch("/api/discover");
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return { movies: data.movies, shows: data.shows };
  }

  async fetchMovieDetails(movies: Movie[]): Promise<MovieDetail[]> {
    const headers = {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json;charset=utf-8",
    };

    movies.sort((a, b) => b.vote_average - a.vote_average);

    const movieDetailsPromises = movies.slice(0, 8).map(async (movie: Movie) => {
      const imagesResponse = await fetch(
        `${API_BASE_URL}/movie/${movie.id}/images`,
        { headers }
      );
      const imagesData = await imagesResponse.json();

      if (!imagesData.logos) {
        imagesData.logos = [];
      }

      const logos = imagesData.logos.filter((image: { iso_639_1: string }) =>
        image.iso_639_1 === "en" || image.iso_639_1 === null
      );

      movie.logo_path = logos.length > 0 ? logos[0].file_path : null;

      const movieResponse = await fetch(
        `${API_BASE_URL}/movie/${movie.id}`,
        { headers }
      );
      const movieData = await movieResponse.json();

      return { ...movie, ...movieData };
    });

    return Promise.all(movieDetailsPromises);
  }
}