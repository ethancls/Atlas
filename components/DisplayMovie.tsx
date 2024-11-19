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