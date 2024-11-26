import { Person } from "@/app/entities/Person";
import { MovieDetail } from "@/app/entities/MovieDetail";
import { ShowDetail } from "@/app/entities/ShowDetail";

const API_BASE_URL = "https://api.themoviedb.org/3";

export class PersonDetailRepository {
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

  async fetchPersonDetails(id: string): Promise<Person> {
    const response = await fetch(`${API_BASE_URL}/person/${id}`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  async fetchPersonMovies(id: string): Promise<MovieDetail[]> {
    const response = await fetch(`${API_BASE_URL}/person/${id}/movie_credits`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    return data.cast.filter((item: MovieDetail) => item.poster_path !== null);
  }

  async fetchPersonTVShows(id: string): Promise<ShowDetail[]> {
    const response = await fetch(`${API_BASE_URL}/person/${id}/tv_credits`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    return data.cast.filter((item: ShowDetail) => item.poster_path !== null);
  }

  async fetchPersonImages(id: string): Promise<{ file_path: string }[]> {
    const response = await fetch(`${API_BASE_URL}/person/${id}/images`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    return data.profiles;
  }
}