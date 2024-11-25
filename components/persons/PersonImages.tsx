import Image from 'next/image';

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

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      modal.remove();
      document.removeEventListener('keydown', handleKeyDown);
    }
  };

  document.addEventListener('keydown', handleKeyDown);
};

const PersonImages = ({ personImages, personName }: { personImages: PersonImage[], personName: string }) => {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4 pt-4">Images of {personName}</h2>
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
        {personImages.map((image) => (
          <button
            key={image.file_path}
            className="flex-shrink-0 w-[200px] cursor-pointer hover:opacity-80"
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
    </>
  );
};

export default PersonImages;