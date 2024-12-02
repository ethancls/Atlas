import Image from "next/image";
import { SeasonDetail } from "@/app/entities/SeasonDetail";

import rotten from '@/public/rotten.png';
import splash from '@/public/splash.png';
import { ArrowDown } from "lucide-react";
import { ShowDetail } from "@/app/entities/ShowDetail";

interface SeasonDetailsProps {
    season: SeasonDetail | null;
    show: ShowDetail;
}

export function SeasonDetails({ season, show }: SeasonDetailsProps) {
    if (!season) return null;

    return (
        <div className="p-6 lg:p-12">
            <h2 className="text-xl font-semibold mb-4">{season.name}</h2>
            <div className="space-y-6">
                {season.episodes.map((episode) => (
                    <div key={episode.id} className="flex items-start gap-4">
                        {episode.still_path && (
                            <Image
                                src={`https://image.tmdb.org/t/p/original${episode.still_path}`}
                                alt={episode.name}
                                width={230}
                                height={230}
                                className="rounded-md shadow-md"
                            />
                        )}
                        <div>
                            <h3 className="text-lg font-semibold">{episode.name}</h3>
                            <p className="text-md text-gray-500 py-1">{episode.overview}</p>
                            <div className="flex items-center gap-2 mt-auto">
                                <p className="text-sm text-gray-400">Episode {episode.episode_number} · {episode.runtime} min · {new Date(episode.air_date).getFullYear()}</p>
                                <div className="flex items-center gap-2">
                                    <Image
                                        src={episode.vote_average > 5 ? rotten : splash}
                                        alt={episode.vote_average > 5 ? "Rotten Tomatoes" : "Splash"}
                                        width={15}
                                        height={15}
                                        style={{ filter: "invert(1)" }}
                                    />
                                    <span className="text-sm font-bold">{Math.round(episode.vote_average * 10)}%</span>
                                </div>
                                <div className="flex items-center border text-xs font-black border-gray-400 rounded px-1">HD</div>
                                <div className="flex items-center border text-xs border-gray-400 rounded px-1">SDH</div>
                                <div className="flex items-center border text-xs border-gray-400 rounded px-1">AD</div>
                            </div>
                        </div>
                        {/*Download Button*/}
                        <button
                            onClick={() => {
                                fetch(`http://localhost:3000/api/download?search=${show.name}%20s${season.season_number.toString().padStart(2, '0')}%20e${episode.episode_number.toString().padStart(2, '0')}`)
                                    .then(response => response.json())
                                    .then(data => data[0])
                                    .then(data => {
                                        const url = data.url;
                                        window.open(url, "_blank");
                                    })
                                    .catch(() => {
                                        alert("No download link found");
                                    });
                            }}
                            className="relative p-2 bg-white rounded transition hover:scale-105 mt-5">
                            <ArrowDown color="black" className="md:w-6 md:h-6 w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}