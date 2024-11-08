"use client";
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
}

const MovieDetailPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [credits, setCredits] = useState<CastMember[]>([]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const headers = {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
        'Content-Type': 'application/json;charset=utf-8',
      };

      // Récupérer les détails du film depuis l'API de TMDB
      const movieResponse = await fetch(`https://api.themoviedb.org/3/movie/${id}`, { headers });
      const movieData: Movie = await movieResponse.json();
      setMovie(movieData);

      // Récupérer les crédits du film
      const creditsResponse = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits`, { headers });
      const creditsData = await creditsResponse.json();
      setCredits(creditsData.cast);
    };

    fetchMovieDetails();
  }, [id]);

  if (!movie) {
    return <p>Movie not found.</p>;
  }

  return (
    <div className="relative min-h-screen">
      {/* Image de fond floue */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Image
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          layout="fill"
          objectFit="cover"
          className="blur-lg opacity-70"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      <div className="container mx-auto px-4 py-8 text-white">
        <button onClick={() => router.back()} className="text-white mb-4">
          ← Back
        </button>
        
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Affiche du film */}
          <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              width={300}
              height={450}
              quality={100}
              className="rounded-lg shadow-lg"
            />
          </div>

          {/* Détails du film */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
            <p className="text-gray-400 italic mb-4">
              {movie.genres.map((genre: { id: number; name: string }) => genre.name).join(', ')} • {new Date(movie.release_date).toLocaleDateString()}
            </p>
            <p className="text-gray-300 mb-4">{movie.overview}</p>

            {/* Section des crédits */}
            <h2 className="text-2xl font-semibold mb-2">Crédits</h2>
            <div className="flex overflow-x-scroll space-x-4">
              {credits.slice(0, 10).map((credit: CastMember) => (
                <div key={credit.id} className="flex-shrink-0 w-24 text-center">
                  <Image
                    src={`https://image.tmdb.org/t/p/w185${credit.profile_path}`}
                    alt={credit.name}
                    width={96}
                    height={144}
                    className="rounded-lg"
                  />
                  <p className="text-sm mt-2 text-gray-300">{credit.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;