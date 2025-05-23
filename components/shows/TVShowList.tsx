import React, { useRef, useState } from 'react';
import { TVShow } from "@/app/entities/TVShow";
import DisplayShow from "@/components/shows/DisplayShow";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TVShowList = ({ shows }: { shows: TVShow[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftNav, setShowLeftNav] = useState(false);
  const [showRightNav, setShowRightNav] = useState(true);

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
    <div className="p-6 lg:p-12 relative">
      <h2 className="text-2xl font-semibold mb-4">TV Shows</h2>
      
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
      
      {/* Show List */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-6 scroll-smooth"
        style={{
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          scrollPaddingLeft: "1.5rem",
          scrollPaddingRight: "1.5rem"
        }}
      >
        {shows.map((show) => (
          <div
            key={show.id}
            className="flex-shrink-0 w-[150px] md:w-[200px] lg:w-[250px] snap-center"
          >
            <DisplayShow show={show} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TVShowList;