
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { ImageData } from '@/app/entities/ImageData';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ShowImages = ({ images }: { images: ImageData[] }) => {

    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeftNav, setShowLeftNav] = useState(false);
    const [showRightNav, setShowRightNav] = useState(true);

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
            {images.length > 0 && <div className="p-6 lg:p-12 relative">
                <h2 className="text-xl font-semibold mb-4">Images</h2>

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
                    {/* Images */}
                    {images.filter(image => image.type === "backdrop").map((image) => (
                        <div
                            key={image.file_path}
                            className="flex-shrink-0 w-[300px] snap-center cursor-pointer"
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
                                className="rounded-lg shadow-md hover:opacity-80"
                            />
                        </div>
                    ))}
                </div>
            </div>}
        </div>

    );
};

export default ShowImages;