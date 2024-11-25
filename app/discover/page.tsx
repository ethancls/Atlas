"use client";

import { DefaultLayout } from "@/components/app/DefaultLayout";
import MovieCarousel from "@/components/discover/MovieCarousel";
import MovieList from "@/components/movies/MovieList";
import TVShowList from "@/components/shows/TVShowList";
import { useDiscover } from "@/hooks/useDiscover";
import { useSession } from "next-auth/react";

const Discover = () => {
  const session = useSession() as unknown as { data: { imdbKey: string } };
  const imdbKey = session.data?.imdbKey;
  const { movies, shows, movieDetail, error, isLoading } = useDiscover(imdbKey);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 dark:border-white border-black"></div>
      </div>
    );
  }
  else {

    if (error) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-red-500">{error}</p>
        </div>
      );
    }

    return (
      <DefaultLayout>
        {movieDetail && <MovieCarousel movieDetails={movieDetail} />}
        <MovieList movies={movies} />
        <TVShowList shows={shows} />
      </DefaultLayout>
    );
  };
}

export default Discover;