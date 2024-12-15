import Image from "next/image";
import { ArrowDown, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useState } from "react";
import { MovieDetail } from "@/app/entities/MovieDetail";
import { ImageData } from "@/app/entities/ImageData";

import rotten from "@/public/rotten.png";
import splash from "@/public/splash.png";

interface TrailerPlayerProps {
    movie: MovieDetail;
    images: ImageData[];
    showTrailer: boolean;
    certification: string | null;
    trailerLink: string | null;
    setShowTrailer: (show: boolean) => void;
}

const TrailerPlayer = ({
    movie,
    images,
    showTrailer,
    certification,
    trailerLink,
    setShowTrailer
}: TrailerPlayerProps) => {
    const [isMuted, setIsMuted] = useState(true);

    const togglePlayPause = () => {
        const iframe = document.getElementById("trailer-iframe") as HTMLIFrameElement;
        if (iframe?.contentWindow) {
            iframe.contentWindow.postMessage(
                JSON.stringify({
                    event: "command",
                    func: showTrailer ? "pauseVideo" : "playVideo",
                }),
                "*"
            );
            setShowTrailer(!showTrailer);
        }
    };

    const toggleMute = () => {
        const iframe = document.getElementById("trailer-iframe") as HTMLIFrameElement;
        if (iframe?.contentWindow) {
            iframe.contentWindow.postMessage(
                JSON.stringify({ event: "command", func: isMuted ? "unMute" : "mute" }),
                "*"
            );
            setIsMuted(!isMuted);
        }
    };

    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

    useEffect(() => {
        fetch(`/api/download?search=${movie.title}%20${new Date(movie.release_date).getFullYear()}`)
            .then(response => response.json())
            .then(data => data[0])
            .then(data => {
                if (data?.url) {
                    setDownloadUrl(data.url);
                }
            })
            .catch(() => {
                setDownloadUrl(null);
            });
    }, [movie.title, movie.release_date]);

    return (
        <div className="relative w-full h-[100vh]">
            {showTrailer && trailerLink ? (
                <div className="relative w-full h-full overflow-hidden">
                    {/* Conteneur pour couper le haut de la vidéo */}
                    <iframe
                        src={trailerLink}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute top-[-60px] left-0 w-full h-full"
                        id="trailer-iframe"
                    />
                    <button
                        onClick={() => { toggleMute(); }}
                        className="absolute top-4 right-8 z-30 p-2 text-white hover:bg-black/50 rounded"
                    >
                        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </button>
                    <button
                        onClick={() => { togglePlayPause(); }}
                        className="absolute top-4 right-20 z-30 p-2 text-white hover:bg-black/50 rounded"
                    >
                        {showTrailer ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </button>
                </div>
            ) : (
                <>
                    <Image
                        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                        alt={movie.title}
                        fill
                        quality={100}
                        className="object-cover hidden md:block"
                    />
                    <Image
                        src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                        alt={movie.title}
                        fill
                        quality={100}
                        className="object-cover block md:hidden"
                    />
                    <button
                        onClick={() => { setShowTrailer(true); togglePlayPause(); }}
                        className="absolute top-4 right-20 z-30 p-2 text-white hover:bg-black/50 rounded"
                    >
                        {showTrailer ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </button>
                </>
            )}

            {/* Conteneur transparent pour désactiver l'interaction */}
            {showTrailer && (
                <div className="absolute top-0 left-0 w-full h-full bg-transparent z-20"></div>
            )}

            {/* Title and Info */}
            <div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black to-transparent p-6 lg:p-12">
                {images.filter(image => image.type === "logo")[0]?.file_path && (
                    <Image
                        src={`https://image.tmdb.org/t/p/original${images.filter(image => image.type === "logo")[0].file_path}`}
                        alt={movie.title}
                        width={1000}
                        height={1000}
                        quality={100}
                        className={`object-cover w-[200px] md:w-[300px] lg:w-[400px]`}
                    />
                )}
                <p className={`mt-4 text-gray-300 max-w-2xl text-justify transition-opacity duration-1000 ${showTrailer ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 h-auto'}`}>
                    {movie.overview}
                </p>
                <div className="flex flex-wrap items-center gap-x-1 text-sm text-gray-400">
                    <div className="flex items-center">
                        {movie.genres.map((genre) => genre.name).join(", ")}
                    </div>
                    <div className="text-2xl">
                        ·
                    </div>
                    <div className="flex items-center">
                        {new Date(movie.release_date).getFullYear()}
                    </div>
                    <div className="text-2xl">
                        ·
                    </div>
                    {movie.runtime > 0 && (
                        <div className="flex items-center">
                            {Math.floor(movie.runtime / 60)} h {movie.runtime % 60} min
                        </div>
                    )}
                    <div className="flex items-center px-1 gap-1">
                        <Image
                            src={movie.vote_average > 5 ? rotten : splash}
                            alt={movie.vote_average > 5 ? "Rotten Tomatoes" : "Splash"}
                            width={15}
                            height={15}
                        />
                        <span>{Math.round(movie.vote_average * 10)}%</span>
                    </div>
                    {certification && (

                        <div className="flex items-center border text-xs border-gray-400 rounded px-1">{certification}</div>
                    )}
                    <div className="flex items-center border text-xs font-black border-gray-400 rounded px-1">HD</div>
                    <div className="flex items-center border text-xs border-gray-400 rounded px-1">SDH</div>
                    <div className="flex items-center border text-xs border-gray-400 rounded px-1">AD</div>
                </div>
            </div>

            {downloadUrl && (
                <button
                    onClick={() => window.open(downloadUrl)}
                    className="absolute bottom-20 right-10 z-30 p-2 bg-white rounded md:bottom-6 md:right-6 transition hover:scale-105"
                >
                    <ArrowDown color="black" className="md:w-6 md:h-6 w-5 h-5 animate-pulse" />
                </button>
            )}
        </div>
    );
};

export default TrailerPlayer;