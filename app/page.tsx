"use client";

import { useEffect, useState } from 'react';
import { Movie } from "@/app/entities/Movie";
import { TVShow } from './entities/TVShow';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Image from "next/image";

const NowPlaying = () => {
  const [movies, setMovies] = useState<TVShow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fonction pour récupérer les films
    const fetchMovies = async () => {
      try {
        const response = await fetch('/api/shows/popular');
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const data: TVShow[] = await response.json();
        setMovies(data); // Stocke les films dans le state
      } catch (error) {
        console.error("Erreur lors de la récupération des films:", error);
        setError("Une erreur est survenue lors de la récupération des films.");
      }
    };

    // Appel de la fonction pour récupérer les films au chargement de la page
    fetchMovies();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-6">
      {/* Titre */}
      <h1 className="text-3xl font-bold mb-8">Films en Salle</h1>

      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {movies.map((movie) => (
            <Card key={movie.id} className="w-40 min-w-[160px] bg-gray-800 flex-shrink-0 shadow-lg rounded-lg">
              <CardHeader className="p-0">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.name}
                  className="rounded-t-lg"
                  width={160}
                  height={240}
                  quality={100}
                />
              </CardHeader>
              <CardContent className="p-2">
                <h2 className="text-md font-semibold text-center truncate">{movie.name}</h2>
                <p className="text-sm text-gray-400 text-center">{movie.first_air_date}</p>
                <p className="text-sm text-yellow-400 text-center">⭐ {movie.vote_average} ({movie.vote_count})</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NowPlaying;