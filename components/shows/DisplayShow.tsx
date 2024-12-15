import Image from "next/image";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { TVShow } from "@/app/entities/TVShow";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { StarIcon } from "lucide-react";

const handleAddToFavorites = async (show: TVShow) => {
    try {
        const response = await fetch('/api/favorites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: show.id,
                type: 'show',
                title: show.name,
                posterPath: show.poster_path,
                releaseDate: show.first_air_date,
                voteAverage: show.vote_average
            }),
        });
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error:', error);
    }
};

const handleRemoveFromFavorites = async (show: TVShow) => {
    try {
        const response = await fetch(`/api/favorites/${show.id}`, {
            method: 'DELETE',
        });
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

const DisplayShow = ({ show }: { show: TVShow }) => {
    const router = useRouter();
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const checkFavorite = async (): Promise<void> => {
            try {
                const response = await fetch(`/api/favorites/${show.id}`);
                const data = await response.json();
                setIsFavorite(data.isFavorite);
            } catch (error) {
                console.error('Error:', error);
            }
        };
        checkFavorite();
    }, [show.id]);

    const handleClick = () => {
        router.push(`/shows/${show.id}`);
    }

    return (
        show.poster_path &&
        <Card className="w-full p-1 hover:opacity-90 group">
            <CardHeader className="p-1 relative">
                <div onClick={handleClick} className="cursor-pointer relative">
                    <Image
                        src={`https://image.tmdb.org/t/p/original${show.poster_path}`}
                        alt={show.name}
                        width={500}
                        height={500}
                        quality={100}
                        className="w-full h-full top-0 left-0 object-cover rounded-lg"
                    />
                    <div className="absolute top-2 right-2 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                        {isFavorite ? (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveFromFavorites(show);
                                    setIsFavorite(false);
                                }}
                                className="p-1 rounded-full bg-black/50 hover:bg-black/70"
                            >
                                <StarIcon className="h-5 w-5 text-yellow-400" />
                            </button>
                        ) : (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddToFavorites(show);
                                    setIsFavorite(true);
                                }}
                                className="p-1 rounded-full bg-black/50 hover:bg-black/70"
                            >
                                <StarIcon className="h-5 w-5 text-white" />
                            </button>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-2">
                <h2 className="text-base font-bold text-left truncate">{show.name}</h2>
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        {new Date(show.first_air_date).getFullYear()}
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