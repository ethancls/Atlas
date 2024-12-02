"use client";

import { PlayIcon } from 'lucide-react';
import { DefaultLayout } from '@/components/app/DefaultLayout';
import MovieList from '@/components/movies/MovieList';
import { useMovie } from '@/app/movies/rules/useMovie';
import Loading from '@/components/app/Loading';

const NowPlaying = () => {
  const { movies, error, isLoading } = useMovie('now-playing');

  return (
    <DefaultLayout>
      <div className="min-h-screen p-6 sm:p-8 space-y-12 w-full">
        <div className="flex justify-center space-x-2 w-full">
          <PlayIcon className="h-8 w-8 xl:h-12 xl-w-12" />
          <h1 className="text-3xl lg:text-4xl font-bold text-center">Now Playing</h1>
        </div>

        {isLoading ? (
          <Loading isLoading={true} />
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <MovieList movies={movies} />
        )}
      </div>
    </DefaultLayout>
  );
};

export default NowPlaying;
