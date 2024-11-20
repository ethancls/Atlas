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
  const [maxLength, setMaxLength] = useState(window.innerWidth < 768 ? 100 : 600);

  useEffect(() => {
    const handleResize = () => {
      setMaxLength(window.innerWidth < 768 ? 100 : 600);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <p className="text-gray-300 mb-6 text-left">
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
              'bg-gray-200 rounded-lg max-w-[80vw] max-h-[80vh] overflow-auto flex flex-col shadow-lg shadow-black/50';

            // Header with name
            const header = document.createElement('h2');
            header.className = 'mt-4 text-black text-2xl font-bold text-center shadow-md';
            header.innerText = person.name;

            // Divider line
            const divider = document.createElement('hr');
            divider.className = 'border-t border-gray-400 my-3';

            // Biography text
            const bio = document.createElement('p');
            bio.className = 'text-black text-lg mb-2 p-6';
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
        // Filter out movies without poster and duplicates
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

        <div className="flex flex-col items-center md:flex-row gap-6 lg:gap-8 p-4 rounded-lg shadow-md shadow-black/30 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-[rgb(24,24,27)] dark:to-[rgb(48,48,51)]">
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

          {/* Details Section */}
          <div className="flex-1 text-center md:text-left pr-4 md:pr-6 lg:pr-8 person-details w-[60%] h-full flex flex-col justify-center">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">{person.name}</h1>
            <Biography person={person} />
          </div>
        </div>

        {/* Movies */}
        <div>
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