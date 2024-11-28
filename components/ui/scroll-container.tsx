import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { ReactNode, useEffect, useRef, useState } from 'react';

interface ScrollContainerProps {
  children: ReactNode;
}

const ScrollContainer = ({ children }: ScrollContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showRightButton, setShowRightButton] = useState(true);
  const [showLeftButton, setShowLeftButton] = useState(false);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: -containerRef.current.clientWidth,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: containerRef.current.clientWidth,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const container = containerRef.current;

    const handleScroll = () => {
      if (container) {
        const { scrollLeft, scrollWidth, clientWidth } = container;
        setShowRightButton(scrollLeft + clientWidth < scrollWidth);
        setShowLeftButton(scrollLeft > 0);
      }
    };

    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div className="relative group">
      <div className="flex items-center gap-4">
        <button
          onClick={scrollLeft}
          className={`hidden md:block bg-gray-100 dark:bg-[rgb(24,24,27)] p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${showLeftButton ? 'visible' : 'invisible'}`}
          aria-label="Scroll left"
          type="button"
        >
          <ChevronLeftIcon className="h-7 w-7 text-gray-400" />
        </button>
        <div
          ref={containerRef}
          className="flex gap-16 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {children}
        </div>
        <button
          onClick={scrollRight}
          className={`hidden md:block bg-gray-100 dark:bg-[rgb(24,24,27)] p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${showRightButton ? 'visible' : 'invisible'}`}
          aria-label="Scroll right"
          type="button"
        >
          <ChevronRightIcon className="h-7 w-7 text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export default ScrollContainer;