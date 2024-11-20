import { TVShow } from './TVShow';

export interface ShowDetail extends TVShow {
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    first_air_date: string;
    genres: { id: number; name: string }[];
    created_by: { id: number; name: string; profile_path: string | null }[];
    homepage: string;
    imdb_id: string;
    vote_average: number;
    languages: string[];
    vote_count: number;
    popularity: number;
    episode_run_time: number[];
    production_companies: { id: number; name: string; logo_path: string | null }[];
    production_countries: { iso_3166_1: string; name: string }[];
    original_language: string;
    spoken_languages: { english_name: string }[];
    tagline: string;
    original_name: string;
    trailerLink: string;
    logo_path: string;
    number_of_episodes: number;
    number_of_seasons: number;
    seasons: {
        air_date: string;
        episode_count: number;
        id: number;
        name: string;
        overview: string;
        poster_path: string;
        season_number: number;
    }[];
  }