import { TVShow } from "@/app/entities/TVShow";
import DisplayShow from "@/components/shows/DisplayShow";

const TVShowList = ({ shows }: { shows: TVShow[] }) => {
  return (
    <div className="p-6 lg:p-12">
      <h2 className="text-2xl font-semibold mb-4">TV Shows</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {shows.map((show) => (
          <DisplayShow key={show.id} show={show} />
        ))}
      </div>
    </div>
  );
};

export default TVShowList;