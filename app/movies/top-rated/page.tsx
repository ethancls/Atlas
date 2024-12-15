"use client";

import { DefaultLayout } from '@/components/app/DefaultLayout';
import { TrophyIcon } from 'lucide-react';
import MovieList from '@/components/movies/MovieList';
import { useMovie } from '@/app/movies/rules/useMovie';
import Loading from '@/components/app/Loading';

const TopRated = () => {
  const { movies, error, isLoading } = useMovie('top-rated');

  return (
    <DefaultLayout>
    <div className="min-h-screen p-6 sm:p-8 space-y-12 w-full">
      <div className="flex justify-center space-x-2 w-full">
        <TrophyIcon className="h-8 w-8 xl:h-12 xl-w-12" />
        <h1 className="text-3xl lg:text-4xl font-bold text-center">Top Rated</h1>
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

export default TopRated;