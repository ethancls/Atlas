"use client";

import { DefaultLayout } from "@/components/app/DefaultLayout";
import Loading from "@/components/app/Loading";
import MovieCarousel from "@/components/discover/MovieCarousel";
import MovieList from "@/components/movies/MovieList";
import TVShowList from "@/components/shows/TVShowList";
import { useDiscover } from "@/app/discover/rules/useDiscover";
import { useSession } from "next-auth/react";

const Discover = () => {
  const session = useSession() as unknown as { data: { imdbKey: string } };
  const imdbKey = session.data?.imdbKey;
  const { movies, shows, movieDetail, error, isLoading } = useDiscover(imdbKey);

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <DefaultLayout>
      <Loading isLoading={isLoading} />
      {movieDetail && <MovieCarousel movieDetails={movieDetail} />}
      <MovieList movies={movies} />
      <TVShowList shows={shows} />
    </DefaultLayout>
  );
}

export default Discover;