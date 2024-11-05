"use client";

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const Discover = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [shows, setShows] = useState<TV[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/trending/movie/week?language=fr-FR`, {
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
            'Accept': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setMovies(data.results);
        setError(null);
      } catch (error: any) {
        setError(error.message || "Une erreur est survenue lors de l'appel à l'API.");
      }
    };

    const fetchShows = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/trending/tv/week?language=fr-FR`, {
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
            'Accept': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setShows(data.results);
        setError(null);
      } catch (error: any) {
        setError(error.message || "Une erreur est survenue lors de l'appel à l'API.");
      }
    };
    
    fetchMovies();
    fetchShows();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-6">
      {/* Header */}
      <div className="fixed top-0 w-full bg-opacity-70 bg-black text-center py-4 z-10 shadow-lg">
        <h1 className="text-3xl font-bold">Discover</h1>
      </div>

      {/* Movies Section */}
      <section className="mt-20 mb-10">
        <h2 className="text-2xl font-semibold mb-4 pl-2">Films</h2>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {movies.map((movie) => (
              <Card key={movie.id} className="w-40 min-w-[160px] bg-gray-800 flex-shrink-0 shadow-lg rounded-lg">
                <CardHeader className="p-0">
                  <img
                    src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                    alt={movie.title}
                    className="rounded-t-lg"
                  />
                </CardHeader>
                <CardContent className="p-2">
                  <h2 className="text-md font-semibold text-center truncate">{movie.title}</h2>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* TV Shows Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 pl-2">Séries</h2>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {shows.map((show) => (
              <Card key={show.id} className="w-40 min-w-[160px] bg-gray-800 flex-shrink-0 shadow-lg rounded-lg">
                <CardHeader className="p-0">
                  <img
                  src={`https://image.tmdb.org/t/p/original${show.poster_path}`}
                  alt={show.name}
                  className="rounded-t-lg"
                  />
                </CardHeader>
                <CardContent className="p-2">
                  <h2 className="text-md font-semibold text-center truncate">{show.name}</h2>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Discover;