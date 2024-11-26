import { MovieDetail } from "@/app/entities/MovieDetail";
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';

const PersonMovies = ({ movies }: { movies: MovieDetail[] }) => {
  const router = useRouter();
  const moviesRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="pt-0 px-4 sm:px-6 md:px-18 pb-8 lg:pt-6 lg:px-20 lg:pb-10">
      <h2 className="text-xl font-semibold pb-10">Movies</h2>
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
    </div>
  );
};

export default PersonMovies;