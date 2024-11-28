import { Person } from "@/app/entities/Person";
import { handleKeyDown } from '@/app/utils/handleKeyDown';
import { ChevronLeftIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Biography from './PersonBiography';

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

const PersonHeader = ({ person }: { person: Person }) => {
  const router = useRouter();

  return (
    <div className="flex-col gap-4 backdrop-blur-2xl pt-2 px-4 sm:px-6 md:px-18 pb-4 lg:pt-6 lg:px-20 lg:pb-8 overflow-hidden">
      <div className="absolute top-4 left-4 z-30 flex items-center gap-2 p-1 hover:bg-black/50 dark:hover:bg-white/50 rounded">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-full h-full"
          title="Go back"
        >
          <ChevronLeftIcon className="h-7 w-7 text-black dark:text-white" />
        </button>
      </div>

      <div className="flex flex-col items-center md:flex-row gap-6 lg:gap-8 p-4 rounded-lg shadow-md shadow-black/30 bg-gradient-to-b from-gray-50 to-gray-300 dark:from-[rgb(24,24,27)] dark:to-[rgb(48,48,51)]">
        <div className="flex-shrink-0 mx-auto md:mx-0 w-[50%] flex relative justify-center md:justify-end md:pr-[5%]">
          <button
            className="cursor-pointer relative"
            onClick={() => openImageModal(`https://image.tmdb.org/t/p/original${person.profile_path}`)}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                openImageModal(`https://image.tmdb.org/t/p/original${person.profile_path}`);
              }
            }}
            aria-label="View profile picture"
          >
            <Image
              src={`https://image.tmdb.org/t/p/original${person.profile_path}`}
              alt={person.name}
              width={175}
              height={275}
              quality={100}
              className="rounded-lg shadow-lg shadow-black/50 w-[65px] md:w-[110px] lg:w-[180px] h-auto duration-300 ease-out hover:scale-105"
              style={{ width: 'auto', height: 'auto' }}
            />
          </button>
        </div>

        <div className="flex-1 text-center md:text-left pr-2 md:pr-4 lg:pr-6 person-details h-full flex flex-col justify-center max-w-[70%] md:max-w-[30%]">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 pb-8">{person.name}</h1>
          <Biography person={person} />
        </div>
      </div>
    </div>
  );
};

export default PersonHeader;