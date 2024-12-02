import Image from "next/image";
import { ChevronLeftIcon, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import { ImageData } from "@/app/entities/ImageData";
import rotten from "@/public/rotten.png";
import splash from "@/public/splash.png";
import { ShowDetail } from "@/app/entities/ShowDetail";
import { useRouter } from "next/navigation";

interface TrailerPlayerProps {
    show: ShowDetail;
    images: ImageData[];
    showTrailer: boolean;
    certification: string | null;
    trailerLink: string | null;
    setShowTrailer: (show: boolean) => void;
}

const TrailerPlayer = ({
    show,
    images,
    showTrailer,
    trailerLink,
    setShowTrailer
}: TrailerPlayerProps) => {
    const [isMuted, setIsMuted] = useState(true);
    const router = useRouter();

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
                        className="absolute top-4 right-8 z-30 text-white p-2 hover:bg-black/50 rounded"
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
                        src={`https://image.tmdb.org/t/p/original${show.backdrop_path}`}
                        alt={show.name}
                        fill
                        className="object-cover hidden md:block"
                    />
                    <Image
                        src={`https://image.tmdb.org/t/p/original${show.poster_path}`}
                        alt={show.name}
                        fill
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

            {/* Bouton de retour */}
            <button
                onClick={() => router.back()}
                className="absolute top-4 left-4 z-30 flex items-center gap-2 p-1 hover:bg-black/50 rounded"
            >
                <ChevronLeftIcon className="h-7 w-7 text-white" />
            </button>

            {/* Title and Info */}
            <div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black to-transparent p-6 lg:p-12">
                {images.filter(image => image.type === "logo")[0]?.file_path && (
                    <Image
                        src={`https://image.tmdb.org/t/p/original${images.filter(image => image.type === "logo")[0].file_path}`}
                        alt={show.name}
                        width={1000}
                        height={1000}
                        quality={100}
                        className={`object-cover w-[200px] md:w-[300px] lg:w-[400px]`}
                    />
                )}
                <p className={`mt-4 text-gray-300 max-w-2xl text-justify transition-opacity duration-1000 ${showTrailer ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 h-auto'}`}>
                    {show.overview}
                </p>
                <div className="flex flex-wrap items-center gap-x-1 text-sm text-gray-400">
                    <div className="flex items-center">
                        {show.genres.map((genre) => genre.name).join(", ")}
                    </div>
                    <div className="text-2xl">
                        ·
                    </div>
                    <div className="flex items-center">
                        {new Date(show.first_air_date).getFullYear()}
                    </div>
                    <div className="text-2xl">
                        ·
                    </div>
                    {show.number_of_seasons > 0 && (
                        <div className="flex items-center">
                            {show.number_of_seasons} seasons
                        </div>
                    )}
                    <div className="flex items-center px-1 gap-1">
                        <Image
                            src={show.vote_average > 5 ? rotten : splash}
                            alt={show.vote_average > 5 ? "Rotten Tomatoes" : "Splash"}
                            width={15}
                            height={15}
                            style={{ filter: "invert(1)" }}
                        />
                        <span>{Math.round(show.vote_average * 10)}%</span>
                    </div>
                    <div className="flex items-center border text-xs font-black border-gray-400 rounded px-1">HD</div>
                    <div className="flex items-center border text-xs border-gray-400 rounded px-1">SDH</div>
                    <div className="flex items-center border text-xs border-gray-400 rounded px-1">AD</div>
                </div>
            </div>
        </div>
    );
};

export default TrailerPlayer;