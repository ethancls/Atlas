import { useQuery } from "react-query";
import { MovieDetailRepository } from "@/repository/MovieDetailRepository";

export const useMovieDetail = (id: string, imdbKey: string) => {
  const repository = new MovieDetailRepository(imdbKey);

  const fetchMovieData = async () => {
    const [
      movie,
      imagesData,
      creditsData,
      releaseDatesData,
      relatedMoviesData,
    ] = await Promise.all([
      repository.fetchMovieDetails(id),
      repository.fetchMovieImages(id),
      repository.fetchMovieCredits(id),
      repository.fetchMovieCertification(id),
      repository.fetchRelatedMovies(id)
    ]);

    const trailerData = await repository.fetchYoutubeTrailer(movie);

    return {
      movie,
      imagesData,
      creditsData,
      releaseDatesData,
      relatedMoviesData,
      trailerData
    };
  };

  const { data, isLoading, error } = useQuery(['movieDetail', id], fetchMovieData);

  return {
    movie: data?.movie || null,
    credits: data?.creditsData || [],
    images: data?.imagesData || [],
    relatedMovies: data?.relatedMoviesData || [],
    certification: data?.releaseDatesData || null,
    trailerLink: data?.trailerData || null,
    isLoading,
    error
  };
};