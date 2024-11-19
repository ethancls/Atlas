"use client";

import { MoveLeftIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Person {
  adult: boolean;
  also_known_as: string[];
  biography: string;
  birthday: string;
  deathday: string | null;
  gender: number;
  homepage: string | null;
  id: number;
  imdb_id: string;
  known_for_department: string;
  name: string;
  place_of_birth: string;
  popularity: number;
  profile_path: string;
}

interface Movies {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  release_date?: string;
  popularity: number;
}

interface TVShows {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  popularity: number;
}

const PersonDetailPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const router = useRouter();
  const [person, setPerson] = useState<Person | null>(null);
  const [Movies, setMovies] = useState<Movies[]>([]);
  const [TVShows, setTVShows] = useState<TVShows[]>([]);

  useEffect(() => {
    const fetchPersonDetails = async () => {
      const headers = {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
        'Content-Type': 'application/json;charset=utf-8',
      };

      try {
        const response = await fetch(`https://api.themoviedb.org/3/person/${id}`, { headers });
        const data = await response.json();
        if (!response.ok) throw new Error('Failed to fetch person details');

        setPerson(data);

        // Fetch to Movies
        const moviesCreditsResponse = await fetch(`https://api.themoviedb.org/3/person/${id}/movie_credits`, { headers });
        const moviesCreditsData = await moviesCreditsResponse.json();
        // Fileter out movies without poster and duplicates
        const validMovies = moviesCreditsData.cast.filter((movie: Movies, index: number, self: Movies[]) =>
          movie.poster_path !== null && index === self.findIndex((m) => m.id === movie.id)
        );
        // Sort by popularity
        const sortedMovies = validMovies.sort((a: Movies, b: Movies) => b.popularity - a.popularity);
        setMovies(sortedMovies);

        // Fetch TV Shows
        const tvShowsCreditsResponse = await fetch(`https://api.themoviedb.org/3/person/${id}/tv_credits`, { headers });
        const tvShowsCreditsData = await tvShowsCreditsResponse.json();
        // Filter out TV shows without poster and duplicates
        const validTVShows = tvShowsCreditsData.cast.filter((show: TVShows, index: number, self: TVShows[]) =>
          show.poster_path !== null && index === self.findIndex((s) => s.id === show.id)
        );
        // Sort by popularity
        const sortedTVShows = validTVShows.sort((a: TVShows, b: TVShows) => b.popularity - a.popularity);
        setTVShows(sortedTVShows);
      } catch (error) {
        console.error('Error fetching person data:', error);
      }
    };
    fetchPersonDetails();
  }, [id]);

  if (!person) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 md:h-24 md:w-24 border-t-4 border-b-4 border-white"></div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen min-w-full bg-cover">
      {/* Content */}
      <div className="flex-1 flex flex-col gap-4 backdrop-blur-2xl bg-slate-800/40 p-6 lg:p-12 overflow-hidden">
        <button
          onClick={() => router.back()}
          className="self-start transition-transform duration-300 ease-out text-white flex gap-1 items-center hover:scale-110 hover:shadow-lg"
        >
          <MoveLeftIcon className="h-4 w-4 md:h-5 md:w-5" /> Back
        </button>

        <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
          {/* Profile Picture */}
          <button
            className="flex-shrink-0 mx-auto md:mx-0 duration-300 ease-out hover:scale-105 cursor-pointer p-2"
            onClick={() => {
              const modal = document.createElement('div');
              modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/80';
              modal.onclick = () => modal.remove();

              const img = document.createElement('img');
              img.src = `https://image.tmdb.org/t/p/original${person.profile_path}`;
              img.className = 'max-h-[80vh] max-w-[80vw] object-contain rounded-lg shadow-lg';

              modal.appendChild(img);
              document.body.appendChild(modal);
            }}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                const modal = document.createElement('div');
                modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/80';
                modal.onclick = () => modal.remove();

                const img = document.createElement('img');
                img.src = `https://image.tmdb.org/t/p/original${person.profile_path}`;
                img.className = 'max-h-[80vh] max-w-[80vw] object-contain rounded-lg shadow-lg';

                modal.appendChild(img);
                document.body.appendChild(modal);
              }
            }}
            aria-label="View profile picture"
          >
            <Image
              src={`https://image.tmdb.org/t/p/original${person.profile_path}`}
              alt={person.name}
              width={300}
              height={450}
              quality={100}
              className="rounded-lg shadow-lg w-[150px] md:w-[200px] lg:w-[300px] h-auto"
            />
          </button>

          {/* Details Section */}
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">{person.name}</h1>
            <h2 className="text-xl font-semibold mb-4">Biography</h2>
            <p className="text-gray-300 mb-6">{person.biography || 'No biography available.'}</p>
          </div>
        </div>

        {/* Movies */}
        <div>
          <div className="mb-6"></div>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Movies</h2>
          <div className="flex gap-6 p-2 overflow-x-auto scrollbar-hide">
            {Movies.map((movie) => (
              <div
                key={movie.id}
                className="min-w-[160px] w-[180px] transition-transform duration-300 ease-out hover:scale-105 cursor-pointer"
                onClick={() => router.push(`/movies/${movie.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    router.push(`/movies/${movie.id}`);
                  }
                }}
              >
                <Image
                  src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                  alt={movie.title ?? movie.name ?? 'Unknown title'}
                  width={200}
                  height={275}
                  className="rounded-lg shadow-md mb-3"
                />
                <p className="text-sm md:text-base font-semibold text-white">{movie.title || movie.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* TV Shows */}
        <div>
          <div className="mb-6"></div>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">TV Shows</h2>
          <div className="flex gap-6 p-2 overflow-x-auto scrollbar-hide">
            {TVShows.map((show) => (
              <div
                key={show.id}
                className="min-w-[160px] w-[180px] transition-transform duration-300 ease-out hover:scale-105 cursor-pointer"
                onClick={() => router.push(`/shows/${show.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    router.push(`/shows/${show.id}`);
                  }
                }}
              >
                <Image
                  src={`https://image.tmdb.org/t/p/original${show.poster_path}`}
                  alt={show.title ?? show.name ?? 'Unknown title'}
                  width={200}
                  height={275}
                  className="rounded-lg shadow-md mb-3"
                />
                <p className="text-sm md:text-base font-semibold text-white">{show.title || show.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonDetailPage;