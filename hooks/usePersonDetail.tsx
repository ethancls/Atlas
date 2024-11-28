import { MovieDetail } from "@/app/entities/MovieDetail";
import { Person } from "@/app/entities/Person";
import { ShowDetail } from "@/app/entities/ShowDetail";
import { PersonDetailRepository } from "@/repository/PersonDetailRepository";
import { useEffect, useState } from "react";

export const usePersonDetail = (id: string, apiKey: string) => {
  const [person, setPerson] = useState<Person | null>(null);
  const [movies, setMovies] = useState<MovieDetail[]>([]);
  const [tvShows, setTVShows] = useState<ShowDetail[]>([]);
  const [personImages, setPersonImages] = useState<{ file_path: string }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPersonData = async () => {
      setIsLoading(true);
      const repository = new PersonDetailRepository(apiKey);
      try {
        const [personData, moviesData, tvShowsData, imagesData] = await Promise.all([
          repository.fetchPersonDetails(id),
          repository.fetchPersonMovies(id),
          repository.fetchPersonTVShows(id),
          repository.fetchPersonImages(id),
        ]);

        setPerson(personData);
        setMovies(moviesData);
        setTVShows(tvShowsData);
        setPersonImages(imagesData);
      } catch (err) {
        console.error("Error fetching person data:", err);
        setError("An error occurred while fetching the data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPersonData();
  }, [id, apiKey]);

  return { person, movies, tvShows, personImages, isLoading, error };
};