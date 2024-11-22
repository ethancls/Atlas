"use client";

import { useEffect, useState } from 'react';
import { Movie } from "@/app/entities/Movie";
import { DefaultLayout } from '@/components/app/DefaultLayout';
import { PopcornIcon, TrophyIcon } from 'lucide-react';
import DisplayMovie from '@/components/movies/DisplayMovie';

const TopRated = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {

    const fetchTopRated = async () => {
      try {
        const response = await fetch('/api/movies/top-rated');
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const data: Movie[] = await response.json();
        setMovies(data); // Stocke les films dans le state
      } catch (error) {
        console.error("Erreur lors de la récupération des films:", error);
        setError("Une erreur est survenue lors de la récupération des films.");
      }
    };

    fetchTopRated();

  }, []);

  return (
    <DefaultLayout>
      <div className="min-h-screen p-6 sm:p-8 space-y-12 w-full">
        {/* Discover Title with Icon */}
        <div className="flex justify-center space-x-2 w-full">
          <TrophyIcon className="h-8 w-8 xl:h-12 xl-w-12" />
          <h1 className="text-3xl lg:text-4xl font-bold text-center">Top Rated</h1>
        </div>

        <div className="flex items-center space-x-2 mb-2">
          <PopcornIcon className="h-6 w-6 xl:h-10 xl-w-10" />
          <h2 className="text-2xl font-semibold xl:text-3xl">Movies</h2>
        </div>
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <div className="flex flex-wrap justify-center gap-4">
            {movies.map((movie) => (
              <DisplayMovie key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default TopRated;