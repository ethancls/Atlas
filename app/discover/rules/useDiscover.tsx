import { useQuery } from "react-query";
import { DiscoverRepository } from "@/repository/DiscoverRepository";

export const useDiscover = (apiKey: string) => {
    const repository = new DiscoverRepository(apiKey);

    const { data, error, isLoading } = useQuery(
        ["discover", apiKey],
        async () => {
            const { movies, shows } = await repository.fetchDiscover();
            const movieDetails = await repository.fetchMovieDetails(movies);
            return { movies, shows, movieDetails };
        }
    );

    return {
        movies: data?.movies || [],
        shows: data?.shows || [],
        movieDetail: data?.movieDetails || null,
        error: error ? "An error occurred while fetching the data." : null,
        isLoading
    };
};
