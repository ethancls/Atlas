import { useEffect, useState } from "react";
import { Movie } from "@/app/entities/Movie";
import { TVShow } from "@/app/entities/TVShow";
import { MovieDetail } from "@/app/entities/MovieDetail";
import { DiscoverRepository } from "@/repository/DiscoverRepository";

export const useDiscover = (apiKey: string) => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [shows, setShows] = useState<TVShow[]>([]);
    const [movieDetail, setMovieDetail] = useState<MovieDetail[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const repository = new DiscoverRepository(apiKey);

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const { movies, shows } = await repository.fetchDiscover();
                setMovies(movies);
                setShows(shows);

                const movieDetails = await repository.fetchMovieDetails(movies);
                setMovieDetail(movieDetails);
            } catch (err) {
                console.error("Error fetching discover data:", err);
                setError("An error occurred while fetching the data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [apiKey]);

    return { movies, shows, movieDetail, error, isLoading };
};