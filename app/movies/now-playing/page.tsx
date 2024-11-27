"use client";

import { useEffect, useState } from 'react';
import { Movie } from "@/app/entities/Movie";
import { PlayIcon } from 'lucide-react';
import { DefaultLayout } from '@/components/app/DefaultLayout';
import MovieList from '@/components/movies/MovieList';

const NowPlaying = () => {
  
    const [movies, setMovies] = useState<Movie[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Function to fetch movies
        const fetchMovies = async () => {
            try {
                const response = await fetch('/api/movies/now-playing');
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                const data: Movie[] = await response.json();
                setMovies(data); // Store movies in state
            } catch (error) {
                console.error("Error fetching movies:", error);
                setError("An error occurred while fetching movies.");
            }
        };
        fetchMovies();
    }, []);

  return (
    <DefaultLayout>
      <div className="min-h-screen p-6 sm:p-8 space-y-12 w-full">
        {/* Discover Title with Icon */}
        <div className="flex justify-center space-x-2 w-full">
          <PlayIcon className="h-8 w-8 xl:h-12 xl-w-12" />
          <h1 className="text-3xl lg:text-4xl font-bold text-center">Now Playing</h1>
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

export default NowPlaying;