import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { TVShow } from "@/app/entities/TVShow";
import { Genre } from "@/app/entities/Genre";

interface DisplayShowProps {
    show: TVShow;
}

const DisplayShow: React.FC<DisplayShowProps> = ({ show }) => {
    const [genres, setGenres] = useState<Genre[]>([]);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await fetch("/api/genres");
                const data = await response.json();

                if (Array.isArray(data.genres)) {
                    setGenres(data.genres);
                } else {
                    console.error("API response does not contain a 'genres' array:", data);
                }
            } catch (error) {
                console.error("Failed to fetch genres", error);
            }
        };

        fetchGenres();
    }, []);

    return (
        <Card className="w-20 min-w-[140px] md:w-30 md:min-w-[160px] lg:w-40 lg:min-w-[180px] xl:w-50 xl:min-w-[200px] 2xl:w-60  2xl:min-w-[220px]  flex-shrink-0 shadow-lg rounded-lg bg-gradient-to-bl from-pink-200 to-blue-200 hover:shadow-xl hover:scale-105 transition-transform duration-300 hover">
            <CardHeader className="p-1">
                <Image
                    src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                    alt={show.name}
                    width={180}
                    height={260}
                    quality={100}
                    className="w-full h-full top-0 left-0 object-cover rounded-lg"
                />
            </CardHeader>
            <CardContent className="p-2">
                <h2 className="text-sm font-bold text-left truncate">{show.name}</h2>
                <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                        {genres.find(genre => genre.id === show.genre_ids[0])?.name} ({new Date(show.first_air_date).getFullYear()})
                    </p>
                    <p className="text-sm text-violet-500">
                        ★ {show.vote_average.toFixed(1)}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default DisplayShow;