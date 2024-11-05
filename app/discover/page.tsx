"use client";

import { useEffect, useState } from 'react';
import { Movie } from "@/app/entities/Movie";
import { TVShow } from '../entities/TVShow';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Image from "next/image";

const Discover = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [shows, setShows] = useState<TVShow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fonction pour récupérer les films
    const fetchDiscover = async () => {
      try {
        const response = await fetch('/api/discover');
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const movies: Movie[] = data.movies;
        const shows: TVShow[] = data.shows;
        setMovies(movies);
        setShows(shows);
      } catch (error) {
        console.error("Erreur lors de la récupération des films:", error);
        setError("Une erreur est survenue lors de la récupération des films.");
      }
    };

    // Appel de la fonction pour récupérer les films au chargement de la page
    fetchDiscover();
  }, []);

  return (
    <div>
      {/* Titre */}
      <h1 className="text-3xl font-bold mb-8">Discover</h1>
      <h2 className="text-3xl font-bold mb-8">Movies</h2>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {movies.map((movie) => (
            <Card key={movie.id} className="w-40 min-w-[160px] flex-shrink-0 shadow-lg rounded-lg">
              <CardHeader className="p-0">
                <Image
                  src={`https://image.tmdb.org/t/p/w400${movie.poster_path}`}
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
      )}
      <h2 className="text-3xl font-bold mb-8">TV Shows</h2>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {shows.map((show) => (
            <Card key={show.id} className="w-40 min-w-[160px] flex-shrink-0 shadow-lg rounded-lg">
              <CardHeader className="p-0">
                <Image
                  src={`https://image.tmdb.org/t/p/w400${show.poster_path}`}
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
      )}
    </div>
  );
};

export default Discover;