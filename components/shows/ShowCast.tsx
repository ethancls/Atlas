import Image from "next/image";
import { CastMember } from "@/app/entities/CastMember";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MovieCast = ({ credits }: { credits: CastMember[] }) => {

    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeftNav, setShowLeftNav] = useState(false);
    const [showRightNav, setShowRightNav] = useState(true);
    const router = useRouter();

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = current.clientWidth;
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
            {credits.length > 0 && <div className="p-6 lg:p-12 relative">
                <h2 className="text-xl font-semibold mb-4">Cast</h2>

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
                    {credits.map((credit) => (
                        credit.profile_path && (<div
                            key={credit.id}
                            className="flex-shrink-0 w-[120px] snap-center text-center cursor-pointer hover:opacity-80"
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
            </div>}
        </div>
    );
};

export default MovieCast;