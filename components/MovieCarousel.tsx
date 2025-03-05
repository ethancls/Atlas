import Image from "next/image";
import { useRouter } from "next/navigation";
import { MovieDetail } from "@/app/entities/MovieDetail";
import { useEffect, useRef } from "react";

import rotten from "@/public/rotten.png"
import splash from "@/public/splash.png"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const MovieCarousel = ({ movieDetails }: { movieDetails: MovieDetail[] }) => {
    const router = useRouter();
    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const carousel = carouselRef.current;
        if (!carousel) return;

        const interval = setInterval(() => {
            const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
            const currentScroll = carousel.scrollLeft;
            const itemWidth = carousel.firstElementChild?.clientWidth || 0;

            const nextScroll = currentScroll + itemWidth;

            if (nextScroll >= maxScrollLeft) {
                carousel.scrollTo({ left: 0, behavior: "smooth" });
            } else {
                carousel.scrollTo({ left: nextScroll, behavior: "smooth" });
            }
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        const carousel = carouselRef.current;
        if (!carousel) return;

        const itemWidth = carousel.firstElementChild?.clientWidth || 0;
        const scrollAmount = direction === 'left' ? -itemWidth : itemWidth;

        carousel.scrollTo({
            left: carousel.scrollLeft + scrollAmount,
            behavior: "smooth"
        });
        
    };

    return (
        <div className="relative">
            <button
                className="absolute left-20 top-1/2 transform -translate-y-1/2 hover:bg-black/50 p-2 rounded-lg z-10"
                onClick={() => scroll('left')}
            >
                <ChevronLeftIcon className="h-7 w-7 text-white" />
            </button>

            <div
                ref={carouselRef}
                className="w-[95%] mx-auto overflow-x-auto flex gap-4 scrollbar-hide snap-x snap-mandatory"
                style={{
                    scrollSnapType: "x mandatory",
                    WebkitOverflowScrolling: "touch"
                }}
            >
                {movieDetails.map((movie) => (
                    <div
                        key={movie.id}
                        className="flex-none snap-center relative h-[60vh] lg:h-[80vh] w-full rounded-lg cursor-pointer"
                        onClick={() => router.push(`/movies/${movie.id}`)}
                    >
                        <Image
                            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                            alt={movie.title}
                            fill
                            className="object-cover rounded-lg"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-6 rounded-lg">
                            {movie.logo_path && (
                                <Image
                                    src={`https://image.tmdb.org/t/p/original${movie.logo_path}`}
                                    alt={movie.title}
                                    width={500}
                                    height={500}
                                    quality={100}
                                    className="object-contain w-[150px] md:w-[300px] lg:w-[400px] xl:w-[500px]"
                                />
                            )}
                            <div className="flex flex-wrap items-center gap-x-1 text-sm text-gray-400">
                                <div className="flex items-center">
                                    {movie.genres && movie.genres.map((genre) => genre.name).join(", ")}
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
                                <div className="flex items-center border text-xs font-black border-gray-400 rounded px-1">HD</div>
                                <div className="flex items-center border text-xs border-gray-400 rounded px-1">SDH</div>
                                <div className="flex items-center border text-xs border-gray-400 rounded px-1">AD</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button
                className="absolute right-20 top-1/2 transform -translate-y-1/2 hover:bg-black/50 p-2 rounded-lg z-10"
                onClick={() => scroll('right')}
            >
                <ChevronRightIcon className="h-7 w-7 text-white" />
            </button>
        </div>
    );
};

export default MovieCarousel;