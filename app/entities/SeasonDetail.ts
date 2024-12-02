export interface SeasonDetail {
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    season_number: number;
    episodes: {
        air_date: string;
        id: number;
        name: string;
        overview: string;
        still_path: string;
        runtime: number;
        episode_number: number;
        vote_average: number;
    }[];
}