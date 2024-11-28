import Image from "next/image";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Movie } from "@/app/entities/Movie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LucideTrash2, StarIcon } from "lucide-react";

const handleAddToFavorites = async (movie: Movie) => {
  try {
    const response = await fetch('/api/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: movie.id,
        type: 'movie',
        title: movie.title,
        posterPath: movie.poster_path,
        releaseDate: movie.release_date,
        voteAverage: movie.vote_average
      }),
    });

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
};

const handleRemoveFromFavorites = async (movie: Movie) => {
  try {
    const response = await fetch(`/api/favorites/${movie.id}`, {
      method: 'DELETE',
    });

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}

const DisplayMovie = ({ movie }: { movie: Movie }) => {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const checkFavorite = async (): Promise<void> => {
      try {
        const response = await fetch(`/api/favorites/${movie.id}`);
        const data = await response.json();
        setIsFavorite(data.isFavorite);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    checkFavorite();
  }, [movie.id]);

  const handleClick = () => {
    router.push(`/movies/${movie.id}`);
  }

  return (
    movie.poster_path &&
    <Card className="w-full p-1 hover:opacity-90 group">
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
      </CardHeader>
      <div className="cursor-pointer">
        <CardContent className="p-2">
          <h2 className="text-base font-bold text-left truncate">{movie.title}</h2>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {new Date(movie.release_date).getFullYear()}
            </p>
            <p className="text-sm text-violet-500">
              ★ {movie.vote_average.toFixed(1)}
            </p>
          </div>
          <div className="flex items-center justify-between transition-opacity duration-300 opacity-0 group-hover:opacity-100">
            {isFavorite ? (
              <button
                onClick={() => { handleRemoveFromFavorites(movie); setIsFavorite(false); }}
                className="flex items-center text-sm text-gray-500 cursor-pointer">
                <LucideTrash2 className="h-4 w-4 mr-1" /> Remove
              </button>
            ) : (
              <p
                onClick={() => { handleAddToFavorites(movie); setIsFavorite(true); }}
                className="flex items-center text-sm text-gray-500 cursor-pointer"
              >
                <StarIcon className="h-4 w-4 mr-1" /> Add to Favorites
              </p>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default DisplayMovie;