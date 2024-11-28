import { Movie } from "@/app/entities/Movie";
import DisplayMovie from "@/components/movies/MovieCard";
import ScrollContainer from "@/components/ui/scroll-container";

const MovieList = ({ movies }: { movies: Movie[] }) => {
  return (
    <div className="p-6 lg:p-12">
      <h2 className="text-2xl font-semibold mb-4">Movies</h2>
      <ScrollContainer>
        {movies.map((movie) => (
          <DisplayMovie key={movie.id} movie={movie} />
        ))}
      </ScrollContainer>
    </div>
  );
};

export default MovieList;