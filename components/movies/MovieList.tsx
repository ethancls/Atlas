import { Movie } from "@/app/entities/Movie";
import DisplayMovie from "@/components/movies/DisplayMovie";

const MovieList = ({ movies }: { movies: Movie[] }) => {
  return (
    <div className="p-6 lg:p-12">
      <h2 className="text-2xl font-semibold mb-4">Movies</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {movies.map((movie) => (
          <DisplayMovie key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default MovieList;