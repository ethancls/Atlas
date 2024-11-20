import { Movie } from "./Movie";

export interface MovieDetail extends Movie {
    id: number;
    title: string;
    overview: string;
    backdrop_path: string;
    release_date: string;
    poster_path: string;
    genres: { id: number; name: string }[];
    vote_average: number;
    runtime: number;
    homepage: string;
    imdb_id: string;
    vote_count: number;
    certification: string;
    production_companies: { id: number; name: string; logo_path: string }[];
    production_countries: { iso_3166_1: string; name: string }[];
    original_language: string;
    spoken_languages: { english_name: string }[];
    popularity: number;
    tagline: string;
    original_title: string;
    trailerLink: string;
    logo_path: string;
}