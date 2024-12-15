/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from 'react';
import { Movie } from "@/app/entities/Movie";
import { TVShow } from '../entities/TVShow';
import { StarIcon } from 'lucide-react';
import { DefaultLayout } from '@/components/app/DefaultLayout';
import MovieList from '@/components/movies/MovieList';
import TVShowList from '@/components/shows/TVShowList';

const Discover = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [shows, setShows] = useState<TVShow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const fetchDiscover = async () => {
      try {
        const response = await fetch('/api/favorites');
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        setMovies(data.filter((item: any) => item.type === 'movie').map((item: any) => ({
          id: item.id,
          title: item.title,
          vote_average: item.voteAverage,
          release_date: item.releaseDate,
          poster_path: item.posterPath,
        })));
        setShows(data.filter((item: any) => item.type === 'show').map((item: any) => ({
          id: item.id,
          name: item.name,
          vote_average: item.voteAverage,
          first_air_date: item.releaseDate,
          poster_path: item.posterPath,
        })));

      } catch (error) {
        console.error("Erreur lors de la récupération des films:", error);
        setError("Une erreur est survenue lors de la récupération des favoris.");
      }
    };

    fetchDiscover();

  }, []);

  return (
    <DefaultLayout>
      <div className="min-h-screen p-6 sm:p-8 space-y-12 w-full">
        <div className="flex justify-center space-x-2 w-full">
          <StarIcon className="h-8 w-8 xl:h-12 xl-w-12" />
          <h1 className="text-3xl lg:text-4xl font-bold text-center">Favorites</h1>
        </div>

        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <MovieList movies={movies} />
        )}

        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <TVShowList shows={shows} />
        )}
      </div>
    </DefaultLayout>
  );
};

export default Discover;