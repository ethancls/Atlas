"use client";

import { useEffect, useState } from 'react';
import { Movie } from "@/app/entities/Movie";
import DisplayMovie from '@/components/DisplayMovie';
import { MedalIcon, PopcornIcon } from 'lucide-react';
import { DefaultLayout } from '@/components/DefaultLayout';


const Popular = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const fetchPopular = async () => {
      try {
        const response = await fetch('/api/movies/popular');
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des films:", error);
        setError("Une erreur est survenue lors de la récupération des films.");
      }
    };

    fetchPopular();

  }, []);

  return (
    <DefaultLayout>
      <div className="min-h-screen p-6 sm:p-8 space-y-12 w-full">
        {/* Discover Title with Icon */}
        <div className="flex justify-center space-x-2 w-full">
          <MedalIcon className="h-8 w-8 xl:h-12 xl-w-12" />
          <h1 className="text-3xl lg:text-4xl font-bold text-center">Popular</h1>
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

export default Popular;