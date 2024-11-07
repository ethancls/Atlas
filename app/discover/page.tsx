"use client";

import { useEffect, useState } from 'react';
import { Movie } from "@/app/entities/Movie";
import { TVShow } from '../entities/TVShow';
import DisplayMovie from '@/components/DisplayMovie';
import DisplayShow from '@/components/DisplayShow';
import { MoonIcon } from '@radix-ui/react-icons';
import { PopcornIcon, Tv2Icon } from 'lucide-react';
import { DefaultLayout } from '@/components/DefaultLayout';
import { useRouter } from 'next/navigation';
import { getLogin } from '@/repository/auth';

const Discover = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [shows, setShows] = useState<TVShow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (getLogin() === false) {
      router.push('/login');
    } else {
      const fetchDiscover = async () => {
        try {
          const response = await fetch('/api/discover');
          if (!response.ok) {
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
          }

          const data = await response.json();
          setMovies(data.movies);
          setShows(data.shows);
        } catch (error) {
          console.error("Erreur lors de la récupération des films:", error);
          setError("Une erreur est survenue lors de la récupération des films.");
        }
      };

      fetchDiscover();
    }
  }, [router]);

  if (getLogin() === false) {
    return null;
  }

  return (
    <DefaultLayout>
      <div className="min-h-screen p-6 sm:p-8 space-y-12 w-full">
        {/* Discover Title with Icon */}
        <div className="flex items-center space-x-3 mb-8 justify-center w-full">
          <MoonIcon className="h-8 w-8 " />
          <h1 className="text-4xl font-bold text-center">Discover</h1>
        </div>

        <div className="flex items-center space-x-2 mb-2">
          <PopcornIcon className="h-6 w-6" />
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

        <div className="flex items-center space-x-2 mb-2">
          <Tv2Icon className="h-6 w-6" />
          <h2 className="text-2xl font-semibold">TV Shows</h2>
        </div>
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <div className="flex flex-wrap gap-4">
            {shows.map((show) => (
              <DisplayShow key={show.id} show={show} />
            ))}
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default Discover;