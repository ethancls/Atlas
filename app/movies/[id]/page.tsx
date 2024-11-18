"use client";
import { Favorite } from '@/app/entities/Favorite';
import { CalendarDays, Clapperboard, HourglassIcon, MoveLeftIcon, StarIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const ScoreEvaluation = ({ score }: { score: number }) => {
  const getColor = (score: number) => {
    let red, green;

    if (score <= 50) {
      // Transition from red to yellow (0 - 50)
      red = 255;
      green = Math.round((score / 50) * 255);
    } else {
      // Transition from yellow to green (51 - 100)
      green = 255;
      red = Math.round(255 - ((score - 50) / 50) * 255);
    }

    return `rgb(${red}, ${green}, 0)`;
  };

  return (
    <div className="outer_ring relative flex flex-col justify-center items-center w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16" >
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
  const [trailerLink, setTrailerLink] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  async function handleFavoriteClick(movie: Movie): Promise<void> {
    if (!isFavorite) {
      const favorite: Favorite = {
        id: movie.id,
        type: 'movie',
        title: movie.title,
        posterPath: movie.poster_path,
        releaseDate: movie.release_date,
        voteAverage: movie.vote_average,
      };

      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(favorite),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(errorData);
      } else {
        setIsFavorite(!isFavorite);
      }
    }
    else {
      const response = await fetch(`/api/favorites/${movie.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(errorData);
      } else {
        setIsFavorite(!isFavorite);
      }
    }
  }

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

        const response = await fetch(`/api/favorites/${movieData.id}`);
        if (response.ok) {
          const data = await response.json();
          setIsFavorite(data.isFavorite);
        }

        // Fetch credits
        const creditsResponse = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits`, { headers });
        const creditsData = await creditsResponse.json();
        setCredits(creditsData.cast);

        // Fetch images
        const imagesResponse = await fetch(`https://api.themoviedb.org/3/movie/${id}/images`, { headers });
        const imagesData = await imagesResponse.json();
        setImagesData(imagesData.backdrops); // Update to handle 'backdrops'

        // Fetch YouTube trailer link
        const youtubeResponse = await fetch(`/api/youtube?search=${encodeURIComponent(movieData.title + ' trailer official 4k')}`);
        const youtubeData = await youtubeResponse.json();

        // Extract the video ID
        if (youtubeData?.result?.[0]?.id) {
          setTrailerLink(`https://www.youtube.com/embed/${youtubeData.result[0].id}?autoplay=1`);
        }
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (!movie) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 md:h-24 md:w-24 border-t-4 border-b-4 border-white"></div>
      </div>
    );
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
          className="opacity-90"
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

        <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
          {/* Movie Poster */}
          <div className="flex-shrink-0 mx-auto md:mx-0 duration-300 ease-out hover:scale-105 cursor-pointer p-2" onClick={() => {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/80';
            modal.onclick = () => modal.remove();

            const img = document.createElement('img');
            img.src = `https://image.tmdb.org/t/p/original${movie.poster_path}`;
            img.className = 'max-h-[80vh] max-w-[80vw] object-contain rounded-lg shadow-lg';

            modal.appendChild(img);
            document.body.appendChild(modal);
          }}>
            <Image
              src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
              alt={movie.title}
              width={300}
              height={300}
              quality={100}
              className="rounded-lg shadow-lg w-[150px] md:w-[200px] lg:w-[300px] h-auto"
            />
          </div>

          {/* Movie Details and Trailer */}
          <div className="flex-1 flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 flex items-center gap-5">
                {movie.title}
                <div onClick={() => handleFavoriteClick(movie)}>
                  <StarIcon className={`h-5 w-5 lg:h-7 lg:w-7 hover:scale-105 cursor-pointer ${isFavorite ? 'text-yellow-300' : 'text-gray-300'}`} />
                </div>
              </h1>
              <div className="flex flex-col gap-2 md:gap-4 text-gray-300 text-sm md:text-base mb-4">
                <p className="flex items-center gap-1">
                  <Clapperboard className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                  {movie.genres.map((genre) => genre.name).join(', ')}
                </p>
                <p className="flex items-center gap-1">
                  <CalendarDays className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                  {new Date(movie.release_date).toLocaleDateString()}
                </p>
                {movie.runtime > 0 && (
                  <p className="flex items-center gap-1">
                    <HourglassIcon className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                    {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                  </p>
                )}
                {movie.vote_average > 0 && (<p className="flex items-center gap-1">
                  <ScoreEvaluation score={Math.round(movie.vote_average * 10)} />
                </p>
                )}
                <div className="flex items-center gap-1 p-4 border-l-2 border-r-2 border-gray-300 rounded-lg">
                  <p className="text-justify text-gray-300">
                    {movie.overview}
                  </p>
                </div>

              </div>
            </div>

            {/* Trailer */}
            {trailerLink && (
  <div className="flex flex-shrink-0 w-full lg:w-[60%] relative rounded-xl overflow-hidden shadow-md">
    <div
      className="relative w-full"
      style={{
        paddingBottom: '56.25%', // Maintain a 16:9 aspect ratio for all screen sizes
        position: 'relative',
      }}
    >
      <iframe
        src={trailerLink}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute top-0 left-0 w-full h-full object-cover"
        title="Movie Trailer"
      ></iframe>
    </div>
  </div>
)}
          </div>
        </div>

        {/* Credits */}
        <div>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Credits</h2>
          <div className="flex gap-6 p-2 overflow-x-auto scrollbar-hide">
            {credits.slice(0, 10).map((credit) => (
              credit.profile_path && (
              <div
                key={credit.id}
                className="min-w-[160px] w-[180px] transition-transform duration-300 ease-out hover:scale-105 cursor-pointer"
                onClick={() => router.push(`/persons/${credit.id}`)}
              >
                <Image
                src={`https://image.tmdb.org/t/p/original${credit.profile_path}`}
                alt={credit.name}
                width={200}
                height={275}
                className="rounded-lg shadow-md mb-3"
                />
                <p className="text-sm md:text-base font-semibold text-white">{credit.name}</p>
                <p className="text-xs md:text-sm text-gray-400 italic">{credit.character}</p>
              </div>
              )
            ))}
          </div>
        </div>

        {/* Images */}
        <div>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Images</h2>
          <div className="flex gap-4 p-2 overflow-x-auto scrollbar-hide">
            {imagesData.slice(0, 10).map((image) => (
              <div
                key={image.file_path}
                className="min-w-[350px] w-[350px] transition-transform duration-300 ease-out hover:scale-105 cursor-pointer"
                onClick={() => {
                  const modal = document.createElement('div');
                  modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/80';
                  modal.onclick = () => modal.remove();

                  const img = document.createElement('img');
                  img.src = `https://image.tmdb.org/t/p/original${image.file_path}`;
                  img.className = 'max-h-[70vh] max-w-[70vw] object-contain rounded-lg shadow-lg';

                  modal.appendChild(img);
                  document.body.appendChild(modal);
                }}
              >
                <Image
                  src={`https://image.tmdb.org/t/p/original${image.file_path}`}
                  alt="Movie backdrop"
                  width={500}
                  height={500}
                  quality={100}
                  className="rounded-lg shadow-md"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div >
  );
};

export default MovieDetailPage;