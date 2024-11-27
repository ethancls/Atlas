import Image from "next/image";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Movie } from "@/app/entities/Movie";
import { useRouter } from "next/navigation";

interface DisplayMovieProps {
  movie: Movie;
}

const DisplayMovie: React.FC<DisplayMovieProps> = ({ movie }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/movies/${movie.id}`);
  }

  return (
    movie.poster_path &&
    <Card className="w-full p-1 hover:opacity-90">
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
      <div onClick={handleClick} className="cursor-pointer">
        <CardContent className="p-2">
          <h2 className="text-base font-bold text-left truncate">{movie.title}</h2>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {new Date(movie.release_date).getFullYear()}
            </p>
            <p className="text- text-violet-500">
              ★ {movie.vote_average.toFixed(1)}
            </p>
          </div>
        </CardContent>
      </div>
    </Card >
  );
};

export default DisplayMovie;