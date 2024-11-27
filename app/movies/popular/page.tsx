"use client";

import { useEffect, useState } from 'react';
import { Movie } from "@/app/entities/Movie";
import { MedalIcon } from 'lucide-react';
import { DefaultLayout } from '@/components/app/DefaultLayout';
import MovieList from '@/components/movies/MovieList';


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

        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <MovieList movies={movies} />
        )}
      </div>
    </DefaultLayout>
  );
};

export default Popular;