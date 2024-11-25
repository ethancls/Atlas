import { useEffect, useState } from "react";
import { MovieDetailRepository } from "@/repository/MovieDetailRepository";
import { Movie } from "@/app/entities/Movie";
import { CastMember } from "@/app/entities/CastMember";
import { MovieDetail } from "@/app/entities/MovieDetail";
import { ImageData } from "@/app/entities/ImageData";

export const useMovieDetail = (id: string, imdbKey: string) => {
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [credits, setCredits] = useState<CastMember[]>([]);
  const [images, setImages] = useState<ImageData[]>([]);
  const [relatedMovies, setRelatedMovies] = useState<Movie[]>([]);
  const [certification, setCertification] = useState<string | null>(null);
  const [trailerLink, setTrailerLink] = useState<string | null>(null);
  const [isloading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieData = async () => {
      setLoading(true);
      const repository = new MovieDetailRepository(imdbKey);
      try {
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

        setMovie(movie);
        setImages(imagesData);
        setCredits(creditsData);
        setCertification(releaseDatesData);
        setRelatedMovies(relatedMoviesData);
        setTrailerLink(trailerData);

      } catch (err) {
        console.error("Error fetching movie data:", err);
        setError("An error occurred while fetching the data.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id, imdbKey]);

  return { movie, credits, images, relatedMovies, certification, isloading, error, trailerLink };
};