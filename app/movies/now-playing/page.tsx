"use client";

import { useEffect, useState } from 'react';
import { Movie } from "@/app/entities/Movie";
import DisplayMovie from '@/components/DisplayMovie';
import { PlayIcon, PopcornIcon } from 'lucide-react';
import { DefaultLayout } from '@/components/DefaultLayout';

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
        <div className="flex items-center space-x-3 mb-8 justify-center w-full">
          <PlayIcon className="h-8 w-8" />
          <h1 className="text-3xl lg:text-4xl font-bold text-center">Now Playing</h1>
        </div>

        <div className="flex items-center space-x-2 mb-2">
          <PopcornIcon className="h-6 w-6" />
          <h2 className="text-2xl font-semibold">Movies</h2>
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

export default NowPlaying;