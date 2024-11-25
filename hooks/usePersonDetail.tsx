import { useEffect, useState } from "react";
import { Person } from "@/app/entities/Person";
import { MovieDetail } from "@/app/entities/MovieDetail";
import { ShowDetail } from "@/app/entities/ShowDetail";

export const usePersonDetail = (id: string) => {
  const [person, setPerson] = useState<Person | null>(null);
  const [movies, setMovies] = useState<MovieDetail[]>([]);
  const [tvShows, setTVShows] = useState<ShowDetail[]>([]);
  const [personImages, setPersonImages] = useState<{ file_path: string }[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const filterValidItems = <T extends { poster_path: string | null; id: number; popularity: number; title?: string; name?: string; release_date?: string }>(items: T[]) => {
    return items.filter((item, index, self) =>
      item.poster_path !== null && index === self.findIndex((i) => i.id === item.id)
    );
  };

  const sortItemsByPopularity = <T extends { popularity: number }>(items: T[]) => {
    return items.sort((a, b) => b.popularity - a.popularity);
  };

  const fetchData = async (url: string, headers: HeadersInit) => {
    const response = await fetch(url, { headers });
    if (!response.ok) throw new Error(`Failed to fetch data from ${url}`);
    return response.json();
  };

  useEffect(() => {
    const fetchPersonDetails = async () => {
      const headers = {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
        'Content-Type': 'application/json;charset=utf-8',
      };

      try {
        setLoading(true);
        const personData = await fetchData(`https://api.themoviedb.org/3/person/${id}`, headers);
        setPerson(personData);

        const moviesCreditsData = await fetchData(`https://api.themoviedb.org/3/person/${id}/movie_credits`, headers);
        const validMovies = filterValidItems(moviesCreditsData.cast);
        const sortedMovies = sortItemsByPopularity(validMovies);
        setMovies(sortedMovies as MovieDetail[]);

        const tvShowsCreditsData = await fetchData(`https://api.themoviedb.org/3/person/${id}/tv_credits`, headers);
        const validTVShows = filterValidItems(tvShowsCreditsData.cast);
        const sortedTVShows = sortItemsByPopularity(validTVShows);
        setTVShows(sortedTVShows as ShowDetail[]);

        const personImagesData = await fetchData(`https://api.themoviedb.org/3/person/${id}/images`, headers);
        setPersonImages(personImagesData.profiles);

      } catch (error) {
        console.error('Error fetching person data:', error);
        setError("An error occurred while fetching the data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPersonDetails();
  }, [id]);

  return { person, movies, tvShows, personImages, isLoading, error };
};