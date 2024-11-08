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
      <div className="min-h-screen  text-black p-6 sm:p-8 space-y-12 w-full">
        {/* Discover Title with Icon */}
        <div className="flex items-center space-x-3 mb-8 justify-center w-full">
          <MedalIcon className="h-8 w-8 text-black" />
          <h1 className="text-4xl font-bold text-center">Popular</h1>
        </div>

        <div className="flex items-center space-x-2 mb-2">
          <PopcornIcon className="h-6 w-6 text-black" />
          <h2 className="text-2xl font-semibold">Movies</h2>
        </div>
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <div className="flex flex-wrap gap-4">
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