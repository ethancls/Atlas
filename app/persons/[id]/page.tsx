"use client";

import { ChevronLeftIcon } from 'lucide-react';
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

const addEscapeKeyListener = (modal: HTMLDivElement) => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      modal.remove();
      document.removeEventListener('keydown', handleKeyDown);
    }
  };

  document.addEventListener('keydown', handleKeyDown);
};

const Biography = ({ person }: { person: Person }) => {
  const getMaxLength = () => {
    if (window.innerWidth < 768) return 100;
    if (window.innerWidth < 1440) return 300;
    return 600;
  };

  const [maxLength, setMaxLength] = useState(getMaxLength());

  useEffect(() => {
    const handleResize = () => {
      setMaxLength(getMaxLength());
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <p className="mb-6 text-justify">
      {person.biography.length > maxLength
        ? `${person.biography.substring(0, maxLength)}...`
        : person.biography}
      {person.biography.length > maxLength && (
        <button
          onClick={() => {
            const modal = document.createElement('div');
            modal.className =
              'fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4';

            // Close modal function
            const closeModal = () => {
              modal.remove();
            };

            const modalContent = document.createElement('div');
            modalContent.className =
              'rounded-lg shadow-md shadow-black/50 bg-gradient-to-b from-gray-50 to-gray-400 dark:from-[rgb(24,24,27)] dark:to-[rgb(48,48,61)] max-w-[80vw] max-h-[80vh] overflow-auto flex flex-col';

            // Header with name
            const header = document.createElement('h2');
            header.className = 'mt-4 text-2xl font-bold text-center';
            header.innerText = person.name;

            // Divider line
            const divider = document.createElement('hr');
            divider.className = 'border-t border-gray-400 my-3';

            // Biography text
            const bio = document.createElement('p');
            bio.className = 'text-lg mb-2 p-6 text-justify';
            bio.innerText = person.biography;

            // "Done" button
            const doneButton = document.createElement('button');
            doneButton.className =
              'px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 self-end mb-6 mr-8';
            doneButton.innerText = 'Done';
            doneButton.onclick = closeModal;

            modalContent.appendChild(header);
            modalContent.appendChild(divider);
            modalContent.appendChild(bio);
            modalContent.appendChild(doneButton);
            modal.appendChild(modalContent);
            document.body.appendChild(modal);

            // Close modal with Escape key
            const handleKeyDown = (e: KeyboardEvent) => {
              if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleKeyDown);
              }
            };

            document.addEventListener('keydown', handleKeyDown);
          }}
          className="text-blue-500 ml-2"
        >
          read more
        </button>
      )}
    </p>
  );
};

const PersonDetailPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const router = useRouter();
  const [person, setPerson] = useState<Person | null>(null);
  const [Movies, setMovies] = useState<Movies[]>([]);
  const [TVShows, setTVShows] = useState<TVShows[]>([]);

  const filterValidMovies = (movies: Movies[]) => {
    return movies.filter((movie, index, self) =>
      movie.poster_path !== null && index === self.findIndex((m) => m.id === movie.id)
    );
  };

  const sortMoviesByPopularity = (movies: Movies[]) => {
    return movies.sort((a, b) => b.popularity - a.popularity);
  };

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

        // Fetch Movies
        const moviesCreditsResponse = await fetch(`https://api.themoviedb.org/3/person/${id}/movie_credits`, { headers });
        const moviesCreditsData = await moviesCreditsResponse.json();
        const validMovies = filterValidMovies(moviesCreditsData.cast);
        const sortedMovies = sortMoviesByPopularity(validMovies);
        setMovies(sortedMovies);

        // Fetch TV Shows
        const tvShowsCreditsResponse = await fetch(`https://api.themoviedb.org/3/person/${id}/tv_credits`, { headers });
        const tvShowsCreditsData = await tvShowsCreditsResponse.json();
        const validTVShows = filterValidMovies(tvShowsCreditsData.cast);
        const sortedTVShows = sortMoviesByPopularity(validTVShows);
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
      <div className="flex-1 flex flex-col gap-4 backdrop-blur-2xl pt-2 px-18 pb-18 lg:pt-6 lg:px-20 lg:pb-20 overflow-hidden">
        {/* Back Button */}
        <div className="absolute top-4 left-6 z-30 p-0 rounded-lg shadow-md flex items-center justify-center bg-gray-100 dark:bg-[rgb(24,24,27)]">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-full h-full"
            title="Go back"
          >
            <ChevronLeftIcon className="h-7 w-7 text-gray-400" />
            <span className="text-gray-400 font-medium"></span>
          </button>
        </div>

        <div className="flex flex-col items-center md:flex-row gap-6 lg:gap-8 p-4 rounded-lg shadow-md shadow-black/30 bg-gradient-to-b from-gray-50 to-gray-300 dark:from-[rgb(24,24,27)] dark:to-[rgb(48,48,51)]">
          {/* Profile Picture */}
          <div className="flex-shrink-0 mx-auto md:mx-0 w-[50%] flex relative justify-center md:justify-end md:pr-[5%]">
            <button
              className="cursor-pointer relative"
              onClick={() => {
                const modal = document.createElement('div');
                modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/80';
                modal.onclick = () => modal.remove();

                const img = document.createElement('img');
                img.src = `https://image.tmdb.org/t/p/original${person.profile_path}`;
                img.className = 'max-h-[80vh] max-w-[80vw] object-contain rounded-lg shadow-lg shadow-black/50';

                modal.appendChild(img);
                document.body.appendChild(modal);

                addEscapeKeyListener(modal);
              }}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  const modal = document.createElement('div');
                  modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/80';
                  modal.onclick = () => modal.remove();

                  const img = document.createElement('img');
                  img.src = `https://image.tmdb.org/t/p/original${person.profile_path}`;
                  img.className = 'max-h-[80vh] max-w-[80vw] object-contain rounded-lg shadow-lg shadow-black/50';

                  modal.appendChild(img);
                  document.body.appendChild(modal);

                  addEscapeKeyListener(modal);
                }
              }}
              aria-label="View profile picture"
            >
              <Image
                src={`https://image.tmdb.org/t/p/original${person.profile_path}`}
                alt={person.name}
                width={250}
                height={375}
                quality={100}
                className="rounded-lg shadow-lg shadow-black/50 w-[125px] md:w-[175px] lg:w-[250px] h-auto duration-300 ease-out hover:scale-105"
              />
            </button>
          </div>

          {/* Person Details */}
          <div className="flex-1 text-center md:text-left pr-2 md:pr-4 lg:pr-6 person-details h-full flex flex-col justify-center max-w-[70%] md:max-w-[30%]">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 pb-8">{person.name}</h1>
            <Biography person={person} />
          </div>
        </div>

        {/* Movies */}
        <h2 className="text-xl font-semibold mb-4 pt-8">Movies</h2>
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
          {Movies.map((movie) => (
            movie.poster_path && (
              <div
                key={movie.id}
                onClick={() => router.push(`/movies/${movie.id}`)}
                className="flex-shrink-0 w-[200px] cursor-pointer hover:opacity-80"
              >
                <Image
                  src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                  alt={movie.title ?? movie.name ?? 'Unknown title'}
                  width={200}
                  height={225}
                  className="rounded-md shadow-md"
                />
              </div>
            )
          ))}
        </div>

        {/* Additional Details */}
        <hr className="border-gray-500 my-8 w-[100%] mx-auto" />

        {/* TV Shows */}
        <h2 className="text-xl font-semibold mb-4 pt-8">TV Shows</h2>
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
          {TVShows.map((show) => (
            show.poster_path && (
              <div
                key={show.id}
                onClick={() => router.push(`/shows/${show.id}`)}
                className="flex-shrink-0 w-[200px] cursor-pointer hover:opacity-80"
              >
                <Image
                  src={`https://image.tmdb.org/t/p/original${show.poster_path}`}
                  alt={show.title ?? show.name ?? 'Unknown title'}
                  width={200}
                  height={225}
                  className="rounded-md shadow-md"
                />
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonDetailPage;