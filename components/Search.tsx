import { Movie } from "@/app/entities/Movie";
import DisplayMovie from "@/components/DisplayMovie";
import { useEffect, useState } from "react";
import { SearchIcon, ListChecksIcon } from "lucide-react";
import { TVShow } from "@/app/entities/TVShow";
import { Person } from "@/app/entities/Person";
import DisplayShow from "./DisplayShow";
import DisplayPerson from "./DisplayPerson";

export const MovieDetailPage = ({ query }: { query: string }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [shows, setShows] = useState<TVShow[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const headers = {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
        'Content-Type': 'application/json;charset=utf-8',
      };

      const response = await fetch(`https://api.themoviedb.org/3/search/multi?query=${query}`, { headers });
      const data = await response.json();
      if (!response.ok) {
        console.error("Failed to fetch movies", data);
        return;
      }

      const uniqueMovies = new Set<Movie>();
      const uniqueShows = new Set<TVShow>();
      const uniquePersons = new Set<Person>();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.results.forEach((result: any) => {
        if (result.media_type === 'movie') {
          if (result.poster_path === null || movies.some(movie => movie.id === result.id)) {
            return;
          }
          uniqueMovies.add(result);
        } else if (result.media_type === 'tv') {
          if (result.poster_path === null || shows.some(show => show.id === result.id)) {
            return;
          }
          uniqueShows.add(result);
        } else if (result.media_type === 'person') {
          if (result.profile_path === null || persons.some(person => person.id === result.id)) {
            return;
          }
          uniquePersons.add(result);
        }
      });

      setMovies(Array.from(uniqueMovies));
      setShows(Array.from(uniqueShows));
      setPersons(Array.from(uniquePersons));

    };

    fetchMovies();
  }, [query, movies, persons, shows]);

  return (
    <div className="min-h-screen p-6 sm:p-8 space-y-12 w-full">
      {/* Discover Title with Icon */}
      <div className="flex justify-center space-x-2 w-full">
        <SearchIcon className="h-8 w-8 xl:h-12 xl-w-12" />
        <h1 className="text-3xl lg:text-4xl font-bold text-center">Search</h1>
      </div>

      <div className="flex items-center space-x-2 mb-2">
        <ListChecksIcon className="h-6 w-6 xl:h-10 xl-w-10" />
        <h2 className="text-2xl font-semibold xl:text-3xl">Movie Results</h2>
      </div>
      {(
        <div className="flex flex-wrap justify-center gap-4">
          {movies.map((movie) => (
            <DisplayMovie key={movie.id} movie={movie} />
          ))}
        </div>
      )}
      <div className="flex items-center space-x-2 mb-2">
        <ListChecksIcon className="h-6 w-6 xl:h-10 xl-w-10" />
        <h2 className="text-2xl font-semibold xl:text-3xl">TV Show Results</h2>
      </div>
      {(
        <div className="flex flex-wrap justify-center gap-4">
          {shows.map((show) => (
            <DisplayShow key={show.id} show={show} />
          ))}
        </div>
      )}
      <div className="flex items-center space-x-2 mb-2">
        <ListChecksIcon className="h-6 w-6 xl:h-10 xl-w-10" />
        <h2 className="text-2xl font-semibold xl:text-3xl">Persons Results</h2>
      </div>
      {(
        <div className="flex flex-wrap justify-center gap-4">
          {persons.map((person) => (
            <DisplayPerson key={person.id} person={person} />
          ))}
        </div>
      )}
    </div>
  );
};