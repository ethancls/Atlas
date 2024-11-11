"use client";
import { CalendarDays, Clapperboard, HourglassIcon, InfoIcon, MoveLeftIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const ScoreEvaluation = ({ score }: { score: number }) => {
  const getColor = (score: number) => {
    if (score > 75) return '#21d07a'; // Light green
    if (score >= 25) return '#f1c40f'; // Light yellow
    return '#e74c3c'; // Red
  };

  return (
    <div className="outer_ring relative flex flex-col justify-center items-center w-16 h-16">
      <div className="user_score_chart absolute inset-0">
        <CircularProgressbar
          value={score}
          styles={buildStyles({
            textSize: '0px',
            pathColor: getColor(score),
            trailColor: '#204529',
          })}
        />
      </div>
      <div className="percent flex flex-col justify-center items-center">
        <span className="text-white text-xs md:text-sm font-bold">{`${score}%`}</span>
      </div>
    </div>
  );
};

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  genres: { id: number; name: string }[];
  vote_average: number;
  runtime: number;
}

interface CastMember {
  id: number;
  name: string;
  profile_path: string;
  character: string;
}

interface ImageData {
  file_path: string;
}

const MovieDetailPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [credits, setCredits] = useState<CastMember[]>([]);
  const [imagesData, setImagesData] = useState<ImageData[]>([]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const headers = {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
        'Content-Type': 'application/json;charset=utf-8',
      };

      try {
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
        setImagesData(imagesData.backdrops); // Update to handle 'backdrops'
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
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
          className="self-start transition-transform duration-300 ease-out text-white flex gap-1 items-center hover:scale-110 hover:shadow-lg"
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
              <span className="block w-full"></span>
              <p className="flex items-center gap-1">
                <Clapperboard className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                {movie.genres.map((genre) => genre.name).join(', ')}
              </p>
              <span className="block w-full"></span>
              <p className="flex items-center gap-1">
                <CalendarDays className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                {new Date(movie.release_date).toLocaleDateString()}
              </p>
              <span className="block w-full"></span>
              <p className="flex items-center gap-1">
                <HourglassIcon className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
              </p>
              <span className="block w-full h-0"></span>
              <p className="flex items-center gap-2">
                <ScoreEvaluation score={Math.round(movie.vote_average * 10)} />
                <span className="text-white text-xs md:text-sm font-bold">User Score</span>
              </p>
              <p className="flex items-center gap-1">
                <InfoIcon className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                {movie.overview}
              </p>
            </div>
          </div>
        </div>

        {/* Credits */}
        <div>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Credits</h2>
          <div className="flex gap-6 overflow-x-auto">
            {credits.slice(0, 10).map((credit) => (
              <div
                key={credit.id}
                className="min-w-[220px] w-[220px] transition-transform duration-300 ease-out hover:scale-105"
              >
                <Image
                  src={`https://image.tmdb.org/t/p/w300${credit.profile_path}`}
                  alt={credit.name}
                  width={200}
                  height={275}
                  className="rounded-lg shadow-md mb-3"
                />
                <p className="text-sm md:text-base font-semibold text-white">{credit.name}</p>
                <p className="text-xs md:text-sm text-gray-400 italic">{credit.character}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Images */}
        <div>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Images</h2>
          <div className="flex gap-4 overflow-x-auto">
            {imagesData.slice(0, 10).map((image) => (
              <div
                key={image.file_path}
                className="min-w-[350px] w-[350px] transition-transform duration-300 ease-out hover:scale-105"
              >
                <Image
                  src={`https://image.tmdb.org/t/p/w500${image.file_path}`}
                  alt="Movie backdrop"
                  width={350}
                  height={200}
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