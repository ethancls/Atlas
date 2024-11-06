"use client";

import { useEffect, useState } from 'react';
import { TVShow } from "@/app/entities/TVShow";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Image from "next/image";

const NowPlayingShows = () => {
  const [shows, setShows] = useState<TVShow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await fetch('/api/shows/on-the-air');
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const data: TVShow[] = await response.json();
        setShows(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des séries:", error);
        setError("Une erreur est survenue lors de la récupération des séries.");
      }
    };

    fetchShows();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-8">On The Air Shows</h1>

      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {shows.map((show) => (
            <Card key={show.id} className="w-40 min-w-[160px] bg-gray-800 flex-shrink-0 shadow-lg rounded-lg">
              <CardHeader className="p-0">
                <Image
                  src={`https://image.tmdb.org/t/p/original${show.poster_path}`}
                  alt={show.name}
                  className="rounded-t-lg"
                  width={160}
                  height={240}
                  quality={80}
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

export default NowPlayingShows;