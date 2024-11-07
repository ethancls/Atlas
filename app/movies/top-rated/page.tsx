"use client";

import { useEffect, useState } from 'react';
import { Movie } from "@/app/entities/Movie";
import { DefaultLayout } from '@/components/DefaultLayout';
import { useRouter } from 'next/navigation';
import { getLogin } from '@/repository/auth';
import { PopcornIcon, TrophyIcon } from 'lucide-react';
import DisplayMovie from '@/components/DisplayMovie';

const TopRated = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);

  if (getLogin() === false) {
    const router = useRouter();
    router.push('/login');
  }
  else {

    useEffect(() => {
      // Fonction pour récupérer les films
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

      // Appel de la fonction pour récupérer les films au chargement de la page
      fetchTopRated();
    }, []);

    return (
      <DefaultLayout>
    <div className="min-h-screen bg-gradient-to-tr from-gray-300 via-orange-300 to-gray-300 text-black p-6 sm:p-8 space-y-12 w-full">
      {/* Discover Title with Icon */}
      <div className="flex items-center space-x-3 mb-8 justify-center w-full">
        <TrophyIcon className="h-8 w-8 text-black" />
        <h1 className="text-4xl font-bold text-center">Top Rated</h1>
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
  }
};

export default TopRated;