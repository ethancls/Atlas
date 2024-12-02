import Image from "next/image";
import { SeasonDetail } from "@/app/entities/SeasonDetail";
import { ShowDetail } from "@/app/entities/ShowDetail";

interface SeasonsListProps {
    show: ShowDetail;
    seasons: SeasonDetail[];
    onSelectSeason: (seasonNumber: number) => void;
}

export function SeasonsList({ show, seasons, onSelectSeason }: SeasonsListProps) {

    return (
        <div className="p-6 lg:p-12">
            <h2 className="text-xl font-semibold mb-4">Seasons</h2>
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                {seasons.map((season, i) => (
                    <div
                        key={season.id}
                        className="flex-shrink-0 w-[200px] cursor-pointer hover:opacity-80"
                        onClick={() => onSelectSeason(season.season_number)}
                    >
                        {season.poster_path && (
                            <Image
                                src={`https://image.tmdb.org/t/p/original${season.poster_path}`}
                                alt={season.name}
                                width={200}
                                height={300}
                                className="rounded-md shadow-md"
                            />
                        )}
                        <p className="text-center mt-2">{season.name}</p>
                        <p className="text-center text-sm text-gray-500">{show.seasons[i]?.episode_count} episodes</p>
                    </div>
                ))}
            </div>
        </div>
    );
}