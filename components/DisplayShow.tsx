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
        <div onClick={handleClick}>
            <Card className="w-20 min-w-[140px] md:w-30 md:min-w-[160px] lg:w-40 lg:min-w-[180px] xl:w-50 xl:min-w-[200px] 2xl:w-60  2xl:min-w-[220px]  flex-shrink-0 shadow-lg rounded-lg hover:shadow-xl hover:scale-105 transition-transform duration-300 hover">
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
                            {new Date(show.first_air_date).getFullYear()}
                        </p>
                        <p className="text-sm text-violet-500">
                            ★ {show.vote_average.toFixed(1)}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DisplayShow;