"use client";

import { useEffect, useState } from 'react';
import { Movie } from "@/app/entities/Movie";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Image from "next/image";

const NowPlaying = () => {
<<<<<<< HEAD:app/page.tsx
    const [movies, setMovies] = useState<Movie[]>([]);
    const [tvShows, setTvShows] = useState<TVShow[]>([]);
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
=======
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fonction pour récupérer les films
    const fetchMovies = async () => {
      try {
        const response = await fetch('/api/movies/now-playing');
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
>>>>>>> main:app/movies/now-playing/page.tsx

        // Function to fetch TV shows
        const fetchTvShows = async () => {
            try {
                const response = await fetch('/api/shows/popular');
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                const data: TVShow[] = await response.json();
                setTvShows(data); // Store TV shows in state
            } catch (error) {
                console.error("Error fetching TV shows:", error);
                setError("An error occurred while fetching TV shows.");
            }
        };

<<<<<<< HEAD:app/page.tsx
        // Call functions to fetch movies and TV shows on page load
        fetchMovies();
        fetchTvShows();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-6">
            {/* Title */}
            <h1 className="text-3xl font-bold mb-8">Now Playing</h1>

            {error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <>
                    <h2 className="text-2xl font-bold mb-4">Movies</h2>
                    <div className="flex flex-wrap gap-4 mb-8">
                        {movies.map((movie) => (
                            <Card key={movie.id} className="w-40 min-w-[160px] bg-gray-800 flex-shrink-0 shadow-lg rounded-lg">
                                <CardHeader className="p-0">
                                    <Image
                                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                        alt={movie.title}
                                        className="rounded-t-lg"
                                        width={160}
                                        height={240}
                                        quality={100}
                                    />
                                </CardHeader>
                                <CardContent className="p-2">
                                    <h2 className="text-md font-semibold text-center truncate">{movie.title}</h2>
                                    <p className="text-sm text-gray-400 text-center">{movie.release_date}</p>
                                    <p className="text-sm text-yellow-400 text-center">⭐ {movie.vote_average} ({movie.vote_count})</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <h2 className="text-2xl font-bold mb-4">TV Shows</h2>
                    <div className="flex flex-wrap gap-4">
                        {tvShows.map((show) => (
                            <Card key={show.id} className="w-40 min-w-[160px] bg-gray-800 flex-shrink-0 shadow-lg rounded-lg">
                                <CardHeader className="p-0">
                                    <Image
                                        src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                                        alt={show.name}
                                        className="rounded-t-lg"
                                        width={160}
                                        height={240}
                                        quality={100}
                                    />
                                </CardHeader>
                                <CardContent className="p-2">
                                    <h2 className="text-md font-semibold text-center truncate">{show.name}</h2>
                                    <p className="text-sm text-gray-400 text-center">{show.first_air_date}</p>
                                    <p className="text-sm text-yellow-400 text-center">⭐ {show.vote_average} ({show.vote_count})</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </>
            )}
=======
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {movies.map((movie) => (
            <Card key={movie.id} className="w-40 min-w-[160px] bg-gray-800 flex-shrink-0 shadow-lg rounded-lg">
              <CardHeader className="p-0">
                <Image
                  src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                  alt={movie.title}
                  className="rounded-t-lg"
                  width={160}
                  height={240}
                  quality={80}
                />
              </CardHeader>
              <CardContent className="p-2">
                <h2 className="text-md font-semibold text-center truncate">{movie.title}</h2>
                <p className="text-sm text-gray-400 text-center">{movie.release_date}</p>
                <p className="text-sm text-yellow-400 text-center">⭐ {movie.vote_average} ({movie.vote_count})</p>
              </CardContent>
            </Card>
          ))}
>>>>>>> main:app/movies/now-playing/page.tsx
        </div>
    );
};

export default NowPlaying;