"use client";

import { useEffect, useState } from "react";
import { Movie } from "@/app/entities/Movie";
import { TVShow } from "@/app/entities/TVShow";
import DisplayMovie from "@/components/movies/DisplayMovie";
import DisplayShow from "@/components/shows/DisplayShow";
import { DefaultLayout } from "@/components/app/DefaultLayout";
import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { MovieDetail } from "../entities/MovieDetail";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import rotten from "@/public/rotten.png"
import splash from "@/public/splash.png"

const Discover = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [shows, setShows] = useState<TVShow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [movieDetail, setMovieDetail] = useState<MovieDetail[] | null>(null);
  const router = useRouter();
  const session = useSession()
  console.debug(session);

  useEffect(() => {
    const fetchDiscover = async () => {
      const headers = {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
        "Content-Type": "application/json;charset=utf-8",
      };

      try {
        const response = await fetch("/api/discover");
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setMovies(data.movies);
        setShows(data.shows);

        const movieDetailsPromises = data.movies.slice(0, 10).map(async (movie: MovieDetail) => {
          const imagesResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}/images`,
            { headers }
          );
          const imagesData = await imagesResponse.json();

          const logos = imagesData.logos.filter((image: { iso_639_1: string }) =>
            image.iso_639_1 === "en" || image.iso_639_1 === null
          );

          movie.logo_path = logos.length > 0 ? logos[0].file_path : null;

          const movieResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}`,
            { headers }
          );
          const movieData = await movieResponse.json();

          movie = { ...movie, ...movieData };
          return movie;
        });

        const movieDetails = await Promise.all(movieDetailsPromises);
        setMovieDetail(movieDetails);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setError("An error occurred while fetching the data.");
      }
    };

    fetchDiscover();
  }, []);

  if (error) {
    return (
      <DefaultLayout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
        {/* Carousel Section */}
        <div className="relative">
          {movieDetail && movieDetail.length > 0 && (
            <Carousel
              autoPlay={true}
              infiniteLoop={true}
              showThumbs={false}
              showStatus={false}
              interval={3000}
            >
              {movieDetail?.map((detail) => (
                <div key={detail.id} className="relative h-[80vh]" onClick={() => router.push(`/movies/${detail.id}`)}>
                  {/* Backdrop Image */}
                  <Image
                    src={`https://image.tmdb.org/t/p/original${detail.backdrop_path}`}
                    alt={detail.title}
                    fill
                    className="object-cover"
                  />

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-6">
                    {detail.logo_path && (
                      <Image
                        src={`https://image.tmdb.org/t/p/original${detail.logo_path}`}
                        alt={detail.title}
                        width={1500}
                        height={1500}
                        className="object-cover w-[150px]"
                      />
                    )}
                    <p className="text-sm lg:text-md text-gray-300 mt-20">{detail.overview}</p>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                      <div className="flex items-center">
                        {detail.genres.map((genre) => genre.name).join(", ")}
                      </div>
                      <div className="text-2xl">·</div>
                      <div className="flex items-center">
                        {new Date(detail.release_date).getFullYear()}
                      </div>
                      <div className="text-2xl">·</div>
                      {detail.runtime > 0 && (
                        <div className="flex items-center">
                          {Math.floor(detail.runtime / 60)}h {detail.runtime % 60}m
                        </div>
                      )}
                      <div className="flex items-center px-1 gap-1">
                        <Image
                          src={detail.vote_average > 5 ? rotten : splash}
                          alt={detail.vote_average > 5 ? "Rotten Tomatoes" : "Splash"}
                          width={15}
                          height={15}
                        />
                        <span>{Math.round(detail.vote_average * 10)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
          )}
        </div>

        {/* Movies Section */}
        <div className="p-6 lg:p-12">
          <h2 className="text-2xl font-semibold mb-4">Movies</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {movies.map((movie) => (
              <DisplayMovie key={movie.id} movie={movie} />
            ))}
          </div>
        </div>

        {/* TV Shows Section */}
        <div className="p-6 lg:p-12">
          <h2 className="text-2xl font-semibold mb-4">TV Shows</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {shows.map((show) => (
              <DisplayShow key={show.id} show={show} />
            ))}
          </div>
        </div>
    </DefaultLayout>
  );
};

export default Discover;