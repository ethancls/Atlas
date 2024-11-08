import { Movie } from "@/app/entities/Movie";
import DisplayMovie from "@/components/DisplayMovie";
import { useEffect, useState } from "react";
import { SearchIcon, ListChecksIcon } from "lucide-react";

export const MovieDetailPage = ({ query }: { query: string }) => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const headers = {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
        'Content-Type': 'application/json;charset=utf-8',
      };

      const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${query}`, { headers });
      const data = await response.json();
      if (!response.ok) {
        console.error("Failed to fetch movies", data);
        return;
      }
      setMovies(data.results);
    };

    fetchMovies();
  }, [query]);

  return (
    <div className="min-h-screen p-6 sm:p-8 space-y-12 w-full">
      {/* Discover Title with Icon */}
      <div className="flex justify-center space-x-2 w-full">
        <SearchIcon className="h-8 w-8 xl:h-12 xl-w-12" />
        <h1 className="text-3xl lg:text-4xl font-bold text-center">Search</h1>
      </div>

      <div className="flex items-center space-x-2 mb-2">
        <ListChecksIcon className="h-6 w-6 xl:h-10 xl-w-10" />
        <h2 className="text-2xl font-semibold xl:text-3xl">Results</h2>
      </div>
      {(
        <div className="flex flex-wrap justify-center gap-4">
          {movies.map((movie) => (
            <DisplayMovie key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};