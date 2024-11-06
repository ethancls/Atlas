import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Movie } from "@/app/entities/Movie";
import { Genres } from "@/app/entities/Genres";

interface DisplayMovieProps {
  movie: Movie;
}

const DisplayMovie: React.FC<DisplayMovieProps> = ({ movie }) => {
  const [genres, setGenres] = useState<Genres[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch("/api/genres");
        const data = await response.json();

        if (Array.isArray(data.genres)) {
          setGenres(data.genres);
        } else {
          console.error("API response does not contain a 'genres' array:", data);
        }
      } catch (error) {
        console.error("Failed to fetch genres", error);
      }
    };

    fetchGenres();
  }, []);

  return (
    <Card className="w-40 min-w-[180px] flex-shrink-0 shadow-lg rounded-lg bg-gradient-to-bl from-pink-200 to-blue-200 hover:shadow-xl hover:scale-105 transition-transform duration-300 hover">
      <CardHeader className="p-1">
        <Image
          src={`https://image.tmdb.org/t/p/w400${movie.poster_path}`}
          alt={movie.title}
          className="rounded-lg"
          width={180}
          height={260}
          quality={100}
        />
      </CardHeader>
      <CardContent className="p-2">
        <h2 className="text-sm font-bold text-left truncate">{movie.title}</h2>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            {genres.find(genre => genre.id === movie.genre_ids[0])?.name} ({new Date(movie.release_date).getFullYear()})
          </p>
          <p className="text-sm text-violet-500">
            ★ {movie.vote_average.toFixed(1)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DisplayMovie;