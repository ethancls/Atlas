import Image from "next/image";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Movie } from "@/app/entities/Movie";
import { useRouter } from "next/navigation";
import { StarIcon } from "lucide-react";
import { Favorite } from '@/app/entities/Favorite';
import { useEffect, useState } from "react";

interface DisplayMovieProps {
  movie: Movie;
}

const DisplayMovie: React.FC<DisplayMovieProps> = ({ movie }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    router.push(`/movies/${movie.id}`);
  }

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
    const checkFavoriteStatus = async () => {
      const response = await fetch(`/api/favorites/${movie.id}`);
      if (response.ok) {
        const data = await response.json();
        setIsFavorite(data.isFavorite);
      }
    };

    checkFavoriteStatus();
  }, [movie.id]);

  return (
    <Card className="w-20 min-w-[140px] md:w-30 md:min-w-[160px] lg:w-40 lg:min-w-[180px] xl:w-50 xl:min-w-[200px] 2xl:w-60  2xl:min-w-[220px] flex-shrink-0 shadow-lg rounded-lg hover:shadow-xl hover:scale-105 transition-transform duration-300 hover">
      <CardHeader className="p-1 relative">
        <div onClick={handleClick} className="cursor-pointer">
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
            alt={movie.title}
            width={500}
            height={500}
            quality={100}
            className="w-full h-full top-0 left-0 object-cover rounded-lg"
          />
        </div>
        <div
          onClick={() => handleFavoriteClick(movie)}
          className="absolute top-1 right-2 cursor-pointer bg-gradient-to-bl from-violet-400 to-blue-400 rounded-full p-1 shadow hover:scale-110 transition-transform duration-300"
        >
          <StarIcon className={`h-4 w-4 lg:h-6 lg:w-6  ${isFavorite ? 'text-yellow-300' : 'text-gray-300'}`} />
        </div>
      </CardHeader>
      <div onClick={handleClick} className="cursor-pointer">
        <CardContent className="p-2">
          <h2 className="text-sm font-bold text-left truncate">{movie.title}</h2>
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              {new Date(movie.release_date).getFullYear()}
            </p>
            <p className="text-sm text-violet-500">
              ★ {movie.vote_average.toFixed(1)}
            </p>
          </div>
        </CardContent>
      </div>
    </Card >
  );
};

export default DisplayMovie;