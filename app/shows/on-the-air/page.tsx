"use client";

import { useEffect, useState } from 'react';
import { TVShow } from "@/app/entities/TVShow";
import { LoaderPinwheelIcon } from 'lucide-react';
import { DefaultLayout } from '@/components/app/DefaultLayout';
import TVShowList from '@/components/shows/TVShowList';

const OnTheAir = () => {
  const [shows, setShows] = useState<TVShow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const fetchShows = async () => {
      try {
        const response = await fetch('/api/shows/on-the-air');
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setShows(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des films:", error);
        setError("Une erreur est survenue lors de la récupération des films.");
      }
    };

    fetchShows();

  }, []);

  return (
    <DefaultLayout>
      <div className="min-h-screen p-6 sm:p-8 space-y-12 w-full">
        {/* Discover Title with Icon */}
        <div className="flex justify-center space-x-2 w-full">
          <LoaderPinwheelIcon className="h-8 w-8 xl:h-12 xl-w-12" />
          <h1 className="text-3xl lg:text-4xl font-bold text-center">On The Air</h1>
        </div>

        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <TVShowList shows={shows} />
        )}
      </div>
    </DefaultLayout>
  );
};

export default OnTheAir;