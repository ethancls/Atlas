import { useRouter } from "next/navigation";
import Image from "next/image";
import { Movie } from "@/app/entities/Movie";


const Recommendations = ({ relatedMovies }: {relatedMovies: Movie[]}) => {
    const router = useRouter();

    return (
        <div>
            {relatedMovies.length > 0 && <div className="p-6 lg:p-12">
                <h2 className="text-xl font-semibold mb-4">Recommended</h2>
                <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                    {relatedMovies.map((related) => (
                        related.poster_path && (
                            <div
                                key={related.id}
                                onClick={() => router.push(`/movies/${related.id}`)}
                                className="flex-shrink-0 w-[200px] cursor-pointer hover:opacity-80"
                            >
                                <Image
                                    src={`https://image.tmdb.org/t/p/original${related.poster_path}`}
                                    alt={related.title}
                                    width={200}
                                    height={225}
                                    className="rounded-md shadow-md"
                                />
                            </div>)
                    ))}
                </div>
            </div>}
        </div>
    );

};

export default Recommendations;