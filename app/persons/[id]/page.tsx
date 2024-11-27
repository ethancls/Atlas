"use client";

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { MovieDetail } from "@/app/entities/MovieDetail";
import { Person } from "@/app/entities/Person";
import { ShowDetail } from "@/app/entities/ShowDetail";

interface PersonImage {
  file_path: string;
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

const openImageModal = (src: string) => {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md';
  modal.onclick = () => modal.remove();

  const img = document.createElement('img');
  img.src = src;
  img.className = 'max-h-[80vh] max-w-[80vw] object-contain rounded-lg shadow-lg shadow-black/50';

  modal.appendChild(img);
  document.body.appendChild(modal);

  addEscapeKeyListener(modal);
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
              'fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md';

            const closeModal = () => {
              modal.remove();
            };

            const modalContent = document.createElement('div');
            modalContent.className =
              'rounded-lg shadow-md shadow-black/50 bg-gradient-to-b from-gray-50 to-gray-400 dark:from-[rgb(24,24,27)] dark:to-[rgb(48,48,61)] max-w-[80vw] max-h-[80vh] overflow-auto flex flex-col';

            const header = document.createElement('h2');
            header.className = 'mt-4 text-2xl font-bold text-center';
            header.innerText = person.name;

            const divider = document.createElement('hr');
            divider.className = 'border-t border-gray-400 my-3';

            const bio = document.createElement('p');
            bio.className = 'text-lg mb-2 p-6 text-justify';
            bio.innerText = person.biography;

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
  const [movies, setMovies] = useState<MovieDetail[]>([]);
  const [tvShows, setTVShows] = useState<ShowDetail[]>([]);
  const [personImages, setPersonImages] = useState<PersonImage[]>([]);
  const moviesRef = useRef<HTMLDivElement>(null);

  const filterValidItems = <T extends { poster_path: string | null; id: number; popularity: number; title?: string; name?: string; release_date?: string }>(items: T[]) => {
    return items.filter((item, index, self) =>
      item.poster_path !== null && index === self.findIndex((i) => i.id === item.id)
    );
  };

  const sortItemsByPopularity = <T extends { popularity: number }>(items: T[]) => {
    return items.sort((a, b) => b.popularity - a.popularity);
  };

  const fetchData = async (url: string, headers: HeadersInit) => {
    const response = await fetch(url, { headers });
    if (!response.ok) throw new Error(`Failed to fetch data from ${url}`);
    return response.json();
  };

  useEffect(() => {
    const fetchPersonDetails = async () => {
      const headers = {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
        'Content-Type': 'application/json;charset=utf-8',
      };

      try {
        const personData = await fetchData(`https://api.themoviedb.org/3/person/${id}`, headers);
        setPerson(personData);

        const moviesCreditsData = await fetchData(`https://api.themoviedb.org/3/person/${id}/movie_credits`, headers);
        const validMovies = filterValidItems(moviesCreditsData.cast);
        const sortedMovies = sortItemsByPopularity(validMovies);
        setMovies(sortedMovies as MovieDetail[]);

        const tvShowsCreditsData = await fetchData(`https://api.themoviedb.org/3/person/${id}/tv_credits`, headers);
        const validTVShows = filterValidItems(tvShowsCreditsData.cast);
        const sortedTVShows = sortItemsByPopularity(validTVShows);
        setTVShows(sortedTVShows as ShowDetail[]);

        const personImagesData = await fetchData(`https://api.themoviedb.org/3/person/${id}/images`, headers);
        setPersonImages(personImagesData.profiles);

      } catch (error) {
        console.error('Error fetching person data:', error);
      }
    };
    fetchPersonDetails();
  }, [id]);

  function scrollMoviesLeft() {
    if (moviesRef.current) {
      moviesRef.current.scrollBy({
        left: -moviesRef.current.clientWidth,
        behavior: 'smooth',
      });
    }
  }

  function scrollMoviesRight() {
    if (moviesRef.current) {
      moviesRef.current.scrollBy({
        left: moviesRef.current.clientWidth,
        behavior: 'smooth',
      });
    }
  }

  if (!person) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 md:h-24 md:w-24 border-t-4 border-b-4 border-white"></div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen min-w-full bg-cover">
      <div className="flex-1 flex flex-col gap-4 backdrop-blur-2xl pt-2 px-4 sm:px-6 md:px-18 pb-18 lg:pt-6 lg:px-20 lg:pb-20 overflow-hidden">
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
          <div className="flex-shrink-0 mx-auto md:mx-0 w-[50%] flex relative justify-center md:justify-end md:pr-[5%]">
            <button
              className="cursor-pointer relative"
              onClick={() => openImageModal(`https://image.tmdb.org/t/p/original${person.profile_path}`)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  openImageModal(`https://image.tmdb.org/t/p/original${person.profile_path}`);
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
                style={{ width: 'auto', height: 'auto' }}
              />
            </button>
          </div>

          <div className="flex-1 text-center md:text-left pr-2 md:pr-4 lg:pr-6 person-details h-full flex flex-col justify-center max-w-[70%] md:max-w-[30%]">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 pb-8">{person.name}</h1>
            <Biography person={person} />
          </div>
        </div>

        {/* Movies */}
        <h2 className="text-xl font-semibold mb-4 pt-8">Movies</h2>
        <div className="relative group">
          <div className="flex items-center gap-4">
            <button
              onClick={scrollMoviesLeft}
              className="bg-gray-100 dark:bg-[rgb(24,24,27)] p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-label="Scroll left"
              style={{ scrollSnapAlign: 'start' }}
            >
              <ChevronLeftIcon className="h-7 w-7 text-gray-400" />
            </button>
            <div
              ref={moviesRef}
              className="flex gap-16 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {movies.map(
                (movie) =>
                  movie.poster_path && (
                    <button
                      key={movie.id}
                      onClick={() => router.push(`/movies/${movie.id}`)}
                      className="flex-shrink-0 w-[150px] sm:w-[200px] md:w-[250px] lg:w-[300px] cursor-pointer hover:opacity-80 snap-center"
                      aria-label={`View details for ${movie.title ?? 'Unknown title'}`}
                      style={{ flex: '0 0 auto', scrollSnapAlign: 'start' }}
                    >
                      <Image
                        src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                        alt={movie.title ?? 'Unknown title'}
                        width={300}
                        height={400}
                        className="rounded-md shadow-md"
                        style={{ width: 'auto', height: 'auto' }}
                        sizes="(min-width:300px) and (max-width:739px) 150px, (min-width:740px) and (max-width:999px) 200px, (min-width:1000px) and (max-width:1319px) 250px, 300px"
                      />
                    </button>
                  )
              )}
            </div>
            <button
              onClick={scrollMoviesRight}
              className="bg-gray-100 dark:bg-[rgb(24,24,27)] p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-label="Scroll right"
              style={{ scrollSnapAlign: 'start' }}
            >
              <ChevronRightIcon className="h-7 w-7 text-gray-400" />
            </button>
          </div>
        </div>

        <hr className="border-gray-500 mt-8 mb-0 w-[100%] mx-auto" />

        {/* TV Shows */}
        <h2 className="text-xl font-semibold mb-4 pt-4">TV Shows</h2>
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
          {tvShows.map((show) => (
            show.poster_path && (
              <button
                key={show.id}
                onClick={() => router.push(`/shows/${show.id}`)}
                className="flex-shrink-0 w-[200px] cursor-pointer hover:opacity-80"
                aria-label={`View details for ${show.name ?? 'Unknown title'}`}
              >
                <Image
                  src={`https://image.tmdb.org/t/p/original${show.poster_path}`}
                  alt={show.name ?? 'Unknown title'}
                  width={200}
                  height={225}
                  className="rounded-md shadow-md"
                  style={{ width: 'auto', height: 'auto' }}
                />
              </button>
            )
          ))}
        </div>

        <hr className="border-gray-500 mt-8 mb-0 w-[100%] mx-auto" />

        {/* Images of person */}
        <h2 className="text-xl font-semibold mb-4 pt-4">Images of {person.name}</h2>
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
          {personImages.map((image) => (
            <button
              key={image.file_path}
              className="flex-shrink-0 w-[200px] cursor-pointer hover:opacity-80"
              onClick={() => openImageModal(`https://image.tmdb.org/t/p/original${image.file_path}`)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  openImageModal(`https://image.tmdb.org/t/p/original${image.file_path}`);
                }
              }}
              aria-label="View image"
            >
              <Image
                src={`https://image.tmdb.org/t/p/original${image.file_path}`}
                alt={person.name}
                width={200}
                height={225}
                className="rounded-md shadow-md"
                style={{ width: 'auto', height: 'auto' }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonDetailPage;