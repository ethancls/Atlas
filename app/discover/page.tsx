"use client";

import { useEffect, useState } from 'react';
import { Movie } from "@/app/entities/Movie";
import { TVShow } from '../entities/TVShow';
import DisplayMovie from '@/components/DisplayMovie';
import DisplayShow from '@/components/DisplayShow';
import { MoonIcon, VideoIcon, SpeakerLoudIcon } from '@radix-ui/react-icons';

const Discover = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [shows, setShows] = useState<TVShow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-orange-300 via-purple-400 to-blue-400 text-white p-6 sm:p-8 space-y-12 w-full">
      {/* Discover Title with Icon */}
      <div className="flex items-center space-x-3 mb-8 justify-center w-full">
        <MoonIcon className="h-8 w-8 text-white" />
        <h1 className="text-4xl font-bold text-center">Discover</h1>
      </div>

      {/* Movies Section */}
      <div className="flex items-center space-x-2 mb-2">
        <VideoIcon className="h-6 w-6 text-white" />
        <h2 className="text-2xl font-semibold">Movies</h2>
      </div>
      {error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="flex overflow-x-auto gap-5 scrollbar-hide p-4">
          {movies.map((movie) => (
            <DisplayMovie key={movie.id} movie={movie} />
          ))}
        </div>
      )}

      {/* TV Shows Section */}

      <div className="flex items-center space-x-2 mb-2">
        <SpeakerLoudIcon className="h-6 w-6 text-white" />
        <h2 className="text-2xl font-semibold">TV Shows</h2>
      </div>
      {error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="flex overflow-x-auto gap-5 scrollbar-hide p-4">
          {shows.map((show) => (
            <DisplayShow key={show.id} show={show} />
          ))}
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Discover;