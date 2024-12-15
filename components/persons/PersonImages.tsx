import { handleKeyDown } from '@/app/utils/handleKeyDown';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useRef, useState } from 'react';

interface PersonImage {
  file_path: string;
}

const openImageModal = (src: string) => {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md';
  modal.onclick = () => modal.remove();

  const img = document.createElement('img');
  img.src = src;
  img.className = 'max-h-[80vh] max-w-[80vw] object-contain rounded-lg shadow-lg shadow-black/50';

  modal.appendChild(img);
  document.body.appendChild(modal);

  document.addEventListener('keydown', handleKeyDown(modal));
};

const PersonImages = ({ personImages, personName }: { personImages: PersonImage[], personName: string }) => {
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
      {personImages.length > 0 && <div className="p-6 lg:p-12 relative">
        <h2 className="text-2xl font-semibold mb-4">Images of {personName}</h2>

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

        {/* Image List */}
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
          {personImages.map((image) => (
            <button
              key={image.file_path}
              className="flex-shrink-0 w-[150px] lg:w-[200px] snap-center cursor-pointer hover:opacity-80"
              onClick={() => openImageModal(`https://image.tmdb.org/t/p/original${image.file_path}`)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  openImageModal(`https://image.tmdb.org/t/p/original${image.file_path}`);
                }
              }}
              aria-label="View image"
            >
              <Image
                src={`https://image.tmdb.org/t/p/original${image.file_path}`}
                alt={personName}
                width={200}
                height={225}
                className="rounded-md shadow-md"
                style={{ width: 'auto', height: 'auto' }}
              />
            </button>
          ))}
        </div>
      </div>}
    </div>
  );
};

export default PersonImages;