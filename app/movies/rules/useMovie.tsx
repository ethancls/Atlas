import { MovieRepository } from "@/repository/MovieRepository";
import { useQuery } from "react-query";

export const useMovie = (type: string) => {
    const repository = new MovieRepository();

    const fetchMovies = async () => {
        switch (type) {
            case "popular":
                return await repository.fetchPopular();
            case "now-playing":
                return await repository.fetchNowPlaying();
            case "top-rated":
                return await repository.fetchTopRated();
            default:
                throw new Error("Invalid type");
        }
    };

    const { data, error, isLoading } = useQuery(["movies", type], fetchMovies);

    return {
        movies: data?.movies || [],
        error: error ? "An error occurred while fetching the data." : null,
        isLoading,
    };
};
