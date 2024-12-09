"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";
import { useMovieDetail } from "@/app/movies/rules/useMovieDetail";
import { useSession } from "next-auth/react";

import TrailerPlayer from "@/components/movies/TrailerPlayer";
import About from "@/components/movies/AboutSection";
import Recommendations from "@/components/movies/Recommendations";
import MovieCast from "@/components/movies/MovieCast";
import MovieImages from "@/components/movies/MovieImages";
import MovieFooter from "@/components/movies/MovieFooter";
import Loading from "@/components/app/Loading";
import MoviePosters from "@/components/movies/MoviePosters";
import { DefaultLayout } from "@/components/app/DefaultLayout";

const MovieDetailPage = ({ params }: { params: { id: string } }) => {
    const { id } = params;
    const router = useRouter();
    const session = useSession() as unknown as { data: { imdbKey: string } };
    const imdbKey = session.data?.imdbKey;
    const {
        movie,
        credits,
        images,
        relatedMovies,
        certification,
        isLoading,
        error,
        trailerLink
    } = useMovieDetail(id, imdbKey);
    const [showTrailer, setShowTrailer] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setShowTrailer(true);
        }, 3000);
        return () => clearTimeout(timeout);
    }, [trailerLink]);

    <Loading isLoading={isLoading} />

    if (error || !movie) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-red-500">{error as string}</p>
            </div>
        );
    }

    return (
        <DefaultLayout>
        <div className="relative">

            <TrailerPlayer
                movie={movie}
                images={images}
                showTrailer={showTrailer}
                certification={certification}
                trailerLink={trailerLink}
                setShowTrailer={setShowTrailer}
            />

            <button
                onClick={() => router.back()}
                className="absolute top-4 left-4 z-30 flex items-center gap-2 p-1 hover:bg-black/50 rounded"
            >
                <ChevronLeftIcon className="h-7 w-7 text-white" />
            </button>

            <About movie={movie} />

            <hr className="border-gray-500 my-1 w-[95%] mx-auto" />

            <Recommendations relatedMovies={relatedMovies} />

            <MovieCast credits={credits} />

            <MovieImages images={images} />

            <MoviePosters images={images} />

            <hr className="border-gray-500 my-1 w-[95%] mx-auto" />

            <MovieFooter movie={movie} certification={certification || "Not Rated"} />

        </div>
        </DefaultLayout>
    );
};

export default MovieDetailPage;