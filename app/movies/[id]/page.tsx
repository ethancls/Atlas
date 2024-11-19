"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Image from "next/image";
import {ChevronLeftIcon} from "lucide-react";

import rotten from "@/assets/rotten.png"

interface Movie {
    id: number;
    title: string;
    overview: string;
    backdrop_path: string;
    release_date: string;
    genres: { id: number; name: string }[];
    vote_average: number;
    runtime: number;
}

interface CastMember {
    id: number;
    name: string;
    profile_path: string;
    character: string;
}

interface RelatedMovie {
    id: number;
    title: string;
    poster_path: string;
    backdrop_path: string;
}

interface ImageData {
    type: string;
    file_path: string;
}

const MovieDetailPage = ({params}: { params: { id: string } }) => {
    const {id} = params;
    const router = useRouter();

    const [movie, setMovie] = useState<Movie | null>(null);
    const [credits, setCredits] = useState<CastMember[]>([]);
    const [relatedMovies, setRelatedMovies] = useState<RelatedMovie[]>([]);
    const [imagesData, setImagesData] = useState<ImageData[]>([]);
    const [trailerLink, setTrailerLink] = useState<string | null>(null);
    const [showTrailer, setShowTrailer] = useState(false);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            const headers = {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
                "Content-Type": "application/json;charset=utf-8",
            };

            try {
                const movieResponse = await fetch(
                    `https://api.themoviedb.org/3/movie/${id}`,
                    {headers}
                );
                const movieData: Movie = await movieResponse.json();
                setMovie(movieData);

                const imagesResponse = await fetch(
                    `https://api.themoviedb.org/3/movie/${id}/images`,
                    {headers}
                );
                const imagesData = await imagesResponse.json();
                setImagesData([
                    ...imagesData.backdrops.filter((image: {
                        iso_639_1: string;
                    }) => image.iso_639_1 === "en" || image.iso_639_1 === null).map((image: {
                        file_path: string;
                    }) => ({
                        type: "backdrop",
                        file_path: image.file_path
                    })),
                    ...imagesData.logos.filter((image: {
                        iso_639_1: string;
                    }) => image.iso_639_1 === "en" || image.iso_639_1 === null).map((image: {
                        file_path: string;
                    }) => ({
                        type: "logo",
                        file_path: image.file_path
                    })),
                    ...imagesData.posters.filter((image: {
                        iso_639_1: string;
                    }) => image.iso_639_1 === "en" || image.iso_639_1 === null).map((image: {
                        file_path: string;
                    }) => ({
                        type: "poster",
                        file_path: image.file_path
                    }))
                ]);

                const creditsResponse = await fetch(
                    `https://api.themoviedb.org/3/movie/${id}/credits`,
                    {headers}
                );
                const creditsData = await creditsResponse.json();
                setCredits(creditsData.cast);

                const relatedResponse = await fetch(
                    `https://api.themoviedb.org/3/movie/${id}/recommendations`,
                    {headers}
                );
                const relatedData = await relatedResponse.json();
                setRelatedMovies(relatedData.results);

                const youtubeResponse = await fetch(
                    `/api/youtube?search=${encodeURIComponent(
                        movieData.title + movieData.release_date + " trailer official"
                    )}`,
                    {cache: "no-store"}
                );
                const youtubeData = await youtubeResponse.json();
                if (youtubeData?.result?.[0]?.id) {
                    setTrailerLink(
                        `https://www.youtube.com/embed/${youtubeData.result[0].id}?autoplay=1&vq=hd1080&modestbranding=1&rel=0`
                    );
                }
            } catch (error) {
                console.error("Error fetching movie data:", error);
            }
        };

        fetchMovieDetails();
    }, [id]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setShowTrailer(true);
        }, 3000);
        return () => clearTimeout(timeout);
    }, [trailerLink]);

    const handleVideoEnd = () => {
        setShowTrailer(false); // Revenir au backdrop une fois la vidéo terminée
    };

    if (!movie) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Backdrop or Trailer */}
            <div className="relative w-full h-[100vh]">
                {showTrailer && trailerLink ? (
                    <div className="relative w-full h-full overflow-hidden">
                        {/* Conteneur pour couper le haut de la vidéo */}
                        <iframe
                            src={trailerLink}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute top-[-60px] left-0 w-full h-full"
                            onLoad={() => {
                                const iframe = document.querySelector("iframe");
                                if (iframe) {
                                    iframe.contentWindow?.postMessage(
                                        '{"event":"command","func":"playVideo","args":""}',
                                        "*"
                                    );
                                }
                            }}
                            onEnded={handleVideoEnd}
                        ></iframe>
                    </div>
                ) : (
                    <Image
                        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                        alt={movie.title}
                        fill
                        className="object-cover"
                    />
                )}

                {/* Conteneur transparent pour désactiver l'interaction */}
                {showTrailer && (
                    <div className="absolute top-0 left-0 w-full h-full bg-transparent z-20"></div>
                )}

                {/* Bouton de retour */}
                <button
                    onClick={() => router.back()}
                    className="absolute top-4 left-4 z-30 flex items-center gap-2 p-2"
                >
                    <ChevronLeftIcon className="h-7 w-7 text-white"/>
                    <span className="text-white font-medium"></span>
                </button>

                {/* Title and Info */}
                <div
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black to-transparent p-6 lg:p-12">
                    {imagesData.filter(image => image.type === "logo")[0]?.file_path && (
                        <Image
                            src={`https://image.tmdb.org/t/p/original${imagesData.filter(image => image.type === "logo")[0].file_path}`}
                            alt={movie.title}
                            width={300}
                            height={300}
                            quality={100}
                            className="object-contain w-[200px] md:w-[250px] lg:w-[300px]"
                        />
                    )}
                    <p className="mt-4 text-gray-300 max-w-2xl">{movie.overview}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mt-4">
                        <div className="flex items-center gap-2">
                            {movie.genres.map((genre) => genre.name).join(", ")}
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="text-2xl">
                                ·
                            </div>
                            {new Date(movie.release_date).getFullYear()}
                        </div>
                        {movie.runtime > 0 && (
                            <div className="flex items-center gap-2">
                                <div className="text-2xl">
                                    ·
                                </div>
                                {Math.floor(movie.runtime / 60)}h{movie.runtime % 60}
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <Image
                                src={rotten}
                                alt="Rotten Tomatoes"
                                width={20}
                                height={20}
                            />
                            <span>{Math.round(movie.vote_average * 10)}%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recommendations */
            }
            <div className="p-6 lg:p-12">
                <h2 className="text-xl font-semibold mb-4">Recommended</h2>
                <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                    {relatedMovies.map((related) => (
                        <div
                            key={related.id}
                            onClick={() => router.push(`/movie/${related.id}`)}
                            className="flex-shrink-0 w-[200px] cursor-pointer hover:opacity-80"
                        >
                            <Image
                                src={`https://image.tmdb.org/t/p/original${related.poster_path}`}
                                alt={related.title}
                                width={200}
                                height={225}
                                className="rounded-md shadow-md"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Cast */
            }
            <div className="p-6 lg:p-12">
                <h2 className="text-xl font-semibold mb-4">Cast</h2>
                <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                    {credits.slice(0, 12).map((credit) => (
                        credit.profile_path && (<div
                            key={credit.id}
                            className="flex-shrink-0 w-[120px] text-center cursor-pointer hover:opacity-80"
                            onClick={() => router.push(`/persons/${credit.id}`)}
                        >
                            <Image
                                src={`https://image.tmdb.org/t/p/original${credit.profile_path}`}
                                alt={credit.name}
                                width={120}
                                height={120}
                                quality={100}
                                className="rounded-lg shadow-md object-cover"
                            />
                            <p className="text-sm mt-2">{credit.name}</p>
                            <p className="text-xs text-gray-400">{credit.character}</p>
                        </div>)
                    ))}
                </div>
            </div>

            {/* Images */}
            <div className="p-6 lg:p-12">
                <h2 className="text-xl font-semibold mb-4">Images</h2>
                <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                    {imagesData.filter(image => image.type === "backdrop").map((image) => (
                        <div
                            key={image.file_path}
                            className="flex-shrink-0 w-[300px] cursor-pointer"
                            onClick={() => {
                                const modal = document.createElement("div");
                                modal.className =
                                    "fixed inset-0 z-50 flex items-center justify-center bg-black/80";
                                modal.onclick = () => modal.remove();

                                const img = document.createElement("img");
                                img.src = `https://image.tmdb.org/t/p/original${image.file_path}`;
                                img.className =
                                    "max-h-[80vh] max-w-[80vw] object-contain rounded-lg shadow-lg";

                                modal.appendChild(img);
                                document.body.appendChild(modal);
                            }}
                        >
                            <Image
                                src={`https://image.tmdb.org/t/p/original${image.file_path}`}
                                alt="Movie backdrop"
                                width={300}
                                height={200}
                                quality={100}
                                className="rounded-lg shadow-md"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Images */}
            <div className="p-6 lg:p-12">
                <h2 className="text-xl font-semibold mb-4">Posters</h2>
                <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                    {imagesData.filter(image => image.type === "poster").map((image) => (
                        <div
                            key={image.file_path}
                            className="flex-shrink-0 w-[150px] cursor-pointer"
                            onClick={() => {
                                const modal = document.createElement("div");
                                modal.className =
                                    "fixed inset-0 z-50 flex items-center justify-center bg-black/80";
                                modal.onclick = () => modal.remove();

                                const img = document.createElement("img");
                                img.src = `https://image.tmdb.org/t/p/original${image.file_path}`;
                                img.className =
                                    "max-h-[80vh] max-w-[80vw] object-contain rounded-lg shadow-lg";

                                modal.appendChild(img);
                                document.body.appendChild(modal);
                            }}
                        >
                            <Image
                                src={`https://image.tmdb.org/t/p/original${image.file_path}`}
                                alt="Movie poster"
                                width={150}
                                height={200}
                                quality={100}
                                className="rounded-lg shadow-md"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MovieDetailPage;