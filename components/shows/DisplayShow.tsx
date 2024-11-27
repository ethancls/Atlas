import Image from "next/image";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { TVShow } from "@/app/entities/TVShow";
import { useRouter } from "next/navigation";

interface DisplayShowProps {
    show: TVShow;
}

const DisplayShow: React.FC<DisplayShowProps> = ({ show }) => {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/shows/${show.id}`);
    }

    return (
        show.poster_path &&
        <Card className="w-full p-1 hover:opacity-90">
            <CardHeader className="p-1 relative">
                <div onClick={handleClick} className="cursor-pointer">
                    <Image
                        src={`https://image.tmdb.org/t/p/original${show.poster_path}`}
                        alt={show.name}
                        width={500}
                        height={500}
                        quality={100}
                        className="w-full h-full top-0 left-0 object-cover rounded-lg"
                    />
                </div>

            </CardHeader>
            <div onClick={handleClick} className="cursor-pointer">
                <CardContent className="p-2">
                    <h2 className="text-base font-bold text-left truncate">{show.name}</h2>
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            {new Date(show.first_air_date).getFullYear()}
                        </p>
                        <p className="text- text-violet-500">
                            ★ {show.vote_average.toFixed(1)}
                        </p>
                    </div>
                </CardContent>
            </div>
        </Card >
    );
};

export default DisplayShow;