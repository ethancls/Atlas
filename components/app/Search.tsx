import { Movie } from "@/app/entities/Movie";
import { useEffect, useState } from "react";
import { TVShow } from "@/app/entities/TVShow";
import { Person } from "@/app/entities/Person";
import MovieList from "../movies/MovieList";
import TVShowList from "../shows/TVShowList";
import PersonList from "../persons/PersonList";

export const MultiSearch = ({ query }: { query: string }) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div>
    <MovieList movies={movies} />

    <TVShowList shows={shows} />
      
    <PersonList persons={persons} />
    </div>
  );
};

export const MovieSearch = ({ query }: { query: string }) => {
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

      const uniqueMovies = new Set<Movie>();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.results.forEach((result: any) => {

        if (result.poster_path === null || movies.some(movie => movie.id === result.id)) {
          return;
        }
        uniqueMovies.add(result);

      });

      setMovies(Array.from(uniqueMovies));

    };

    fetchMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div>
    <MovieList movies={movies} />
    </div>
  );
};

export const TVShowSearch = ({ query }: { query: string }) => {
  const [shows, setShows] = useState<TVShow[]>([]);

  useEffect(() => {
    const fetchShows = async () => {
      const headers = {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
        'Content-Type': 'application/json;charset=utf-8',
      };

      const response = await fetch(`https://api.themoviedb.org/3/search/tv?query=${query}`, { headers });
      const data = await response.json();
      if (!response.ok) {
        console.error("Failed to fetch shows", data);
        return;
      }

      const uniqueShows = new Set<TVShow>();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.results.forEach((result: any) => {
        if (result.poster_path === null || shows.some(show => show.id === result.id)) {
          return;
        }
        uniqueShows.add(result);
      });

      setShows(Array.from(uniqueShows));
    };

    fetchShows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div>
    <TVShowList shows={shows} />
    </div>
  );
};

export const PersonSearch = ({ query }: { query: string }) => {
  const [persons, setPersons] = useState<Person[]>([]);

  useEffect(() => {
    const fetchPersons = async () => {
      const headers = {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
        'Content-Type': 'application/json;charset=utf-8',
      };

      const response = await fetch(`https://api.themoviedb.org/3/search/person?query=${query}`, { headers });
      const data = await response.json();
      if (!response.ok) {
        console.error("Failed to fetch persons", data);
        return;
      }

      const uniquePersons = new Set<Person>();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.results.forEach((result: any) => {
        if (result.profile_path === null || persons.some(person => person.id === result.id)) {
          return;
        }
        uniquePersons.add(result);
      });

      setPersons(Array.from(uniquePersons));
    };

    fetchPersons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div>
    <PersonList persons={persons} />
    </div>
  );
};