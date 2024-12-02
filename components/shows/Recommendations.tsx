import { useRouter } from "next/navigation";
import Image from "next/image";
import { ShowDetail } from "@/app/entities/ShowDetail";


const Recommendations = ({ relatedShows }: { relatedShows: ShowDetail[] }) => {
    const router = useRouter();

    return (
        <div>
            <div className="p-6 lg:p-12">
                <h2 className="text-xl font-semibold mb-4">Recommended</h2>
                <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                    {relatedShows.map((related) => (
                        related.poster_path && (
                            <div
                                key={related.id}
                                onClick={() => router.push(`/shows/${related.id}`)}
                                className="flex-shrink-0 w-[200px] cursor-pointer hover:opacity-80"
                            >
                                <Image
                                    src={`https://image.tmdb.org/t/p/original${related.poster_path}`}
                                    alt={related.name}
                                    width={500}
                                    height={500}
                                    className="rounded-md shadow-md"
                                    style={{ height: 300, width: 200 }}
                                />
                            </div>)
                    ))}
                </div>
            </div>
        </div>
    );

};

export default Recommendations;