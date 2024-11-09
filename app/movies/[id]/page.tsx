"use client";
import { CalendarDays, Clapperboard, MoveLeftIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  genres: { id: number; name: string }[];
  vote_average: number;
}

interface CastMember {
  id: number;
  name: string;
  profile_path: string;
  character: string;
}

const MovieDetailPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [credits, setCredits] = useState<CastMember[]>([]);
  const [imagesData, setImagesData] = useState<{ backdrops: { file_path: string }[] }>({ backdrops: [] });

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const headers = {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
        'Content-Type': 'application/json;charset=utf-8',
      };

      // Fetch movie details
      const movieResponse = await fetch(`https://api.themoviedb.org/3/movie/${id}`, { headers });
      const movieData: Movie = await movieResponse.json();
      setMovie(movieData);

      // Fetch credits
      const creditsResponse = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits`, { headers });
      const creditsData = await creditsResponse.json();
      setCredits(creditsData.cast);

      // Fetch images
      const imagesResponse = await fetch(`https://api.themoviedb.org/3/movie/${id}/images`, { headers });
      const imagesData = await imagesResponse.json();
      setImagesData(imagesData);
      console.log(imagesData);
    };

    fetchMovieDetails();
  }, [id]);

  if (!movie) {
    return <p>Movie not found.</p>;
  }

  return (
    <div className="relative flex min-h-screen min-w-full bg-cover">
      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Image
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          layout="fill"
          objectFit="cover"
          className="blur-lg opacity-70"
        />
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-4 backdrop-blur-2xl bg-slate-800/40 p-6 lg:p-12 overflow-hidden">
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-2 text-base md:text-lg hover:-translate-x-5 transition-transform"
        >
          <MoveLeftIcon className="h-4 w-4 md:h-5 md:w-5" /> Back
        </button>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Movie Poster */}
          <div className="flex-shrink-0 mx-auto lg:mx-0">
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              width={200}
              height={300}
              quality={100}
              className="rounded-lg shadow-lg w-[150px] md:w-[200px] lg:w-[300px] h-auto"
            />
          </div>

          {/* Movie Details */}
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">{movie.title}</h1>
            <div className="flex flex-wrap items-center gap-2 md:gap-4 text-gray-300 text-sm md:text-base mb-4">
              <p className="flex items-center gap-1">
                <Clapperboard className="h-4 w-4 md:h-5 md:w-5" />
                {movie.genres.map((genre) => genre.name).join(', ')}
              </p>
              <p className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4 md:h-5 md:w-5" />
                {new Date(movie.release_date).toLocaleDateString()}
              </p>
            </div>
            <p className="text-gray-300 text-sm md:text-base mb-6">{movie.overview}</p>
          </div>
        </div>

        {/* Credits */}
        <div>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Credits</h2>
          <div className="flex gap-4 overflow-x-auto">
            {credits.slice(0, 10).map((credit) => (
              <div key={credit.id} className="min-w-[100px] text-center">
                <Image
                  src={`https://image.tmdb.org/t/p/w185${credit.profile_path}`}
                  alt={credit.name}
                  width={100}
                  height={150}
                  className="rounded-lg shadow-md"
                />
                <p className="text-xs md:text-sm mt-2">{credit.name}</p>
                <p className="text-xs text-gray-400">{credit.character}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Images */}
        <div>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Images</h2>
          <div className="flex gap-4 overflow-x-auto">
            {imagesData.backdrops.slice(0, 10).map((image: { file_path: string }) => (
              <div key={image.file_path} className="min-w-[200px] text-center">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${image.file_path}`}
                  alt="Movie backdrop"
                  width={200}
                  height={112}
                  className="rounded-lg shadow-md"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;