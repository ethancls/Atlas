import { useRouter } from "next/navigation";
import Image from "next/image";
import { Movie } from "@/app/entities/Movie";
import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Recommendations = ({ relatedMovies }: { relatedMovies: Movie[] }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeftNav, setShowLeftNav] = useState(false);
    const [showRightNav, setShowRightNav] = useState(true);
    const router = useRouter()

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = current.clientWidth / 2;
            current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeftNav(scrollLeft > 0);
            setShowRightNav(scrollLeft + clientWidth < scrollWidth);
        }
    };

    return (
        <div>
            {relatedMovies.length > 0 && <div className="p-6 lg:p-12 relative">
                <h2 className="text-2xl font-semibold mb-4">Recommended</h2>

                {/* Left Navigation */}
                {showLeftNav && (
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-20 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 rounded-lg p-2 hover:bg-black/70 transition-all duration-300 ease-in-out"
                    >
                        <ChevronLeft className="text-white" />
                    </button>
                )}

                {/* Right Navigation */}
                {showRightNav && (
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-20 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 rounded-lg p-2 hover:bg-black/70 transition-all duration-300 ease-in-out"
                    >
                        <ChevronRight className="text-white" />
                    </button>
                )}

                {/* Movie List */}
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 scroll-smooth"
                    style={{
                        scrollSnapType: "x mandatory",
                        WebkitOverflowScrolling: "touch",
                        scrollPaddingLeft: "1.5rem",
                        scrollPaddingRight: "1.5rem"
                    }}
                >
                    {relatedMovies.map((related) => (
                        related.poster_path && (
                            <div
                                key={related.id}
                                onClick={() => router.push(`/movies/${related.id}`)}
                                className="flex-shrink-0 w-[150px] lg:w-[200px] snap-center ursor-pointer hover:opacity-80"
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

export default Recommendations