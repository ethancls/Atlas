import { ShowDetail } from "@/app/entities/ShowDetail";
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const PersonTVShows = ({ tvShows }: { tvShows: ShowDetail[] }) => {
  const router = useRouter();

  return (
    <div className="pt-0 px-4 sm:px-6 md:px-18 pb-8 lg:pt-6 lg:px-20 lg:pb-10">
      <h2 className="text-xl font-semibold pb-10">TV Shows</h2>
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
        {tvShows.map((show) => (
          show.poster_path && (
            <button
              key={show.id}
              onClick={() => router.push(`/shows/${show.id}`)}
              className="flex-shrink-0 w-[200px] cursor-pointer hover:opacity-80"
              aria-label={`View details for ${show.name ?? 'Unknown title'}`}
            >
              <Image
                src={`https://image.tmdb.org/t/p/original${show.poster_path}`}
                alt={show.name ?? 'Unknown title'}
                width={200}
                height={225}
                className="rounded-md shadow-md"
                style={{ width: 'auto', height: 'auto' }}
              />
            </button>
          )
        ))}
      </div>
    </div>
  );
};

export default PersonTVShows;