import { Person } from "@/app/entities/Person";
import { useEffect, useState } from 'react';

const Biography = ({ person }: { person: Person }) => {
  const getMaxLength = () => {
    if (window.innerWidth < 768) return 100;
    if (window.innerWidth < 1440) return 300;
    return 600;
  };

  const [maxLength, setMaxLength] = useState(getMaxLength());

  useEffect(() => {
    const handleResize = () => {
      setMaxLength(getMaxLength());
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <p className="mb-6 text-justify">
      {person.biography.length > maxLength
        ? `${person.biography.substring(0, maxLength)}...`
        : person.biography}
      {person.biography.length > maxLength && (
        <button
          onClick={() => {
            const modal = document.createElement('div');
            modal.className =
              'fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md';

            const closeModal = () => {
              modal.remove();
            };

            const modalContent = document.createElement('div');
            modalContent.className =
              'rounded-lg shadow-md shadow-black/50 bg-gradient-to-b from-gray-50 to-gray-400 dark:from-[rgb(24,24,27)] dark:to-[rgb(48,48,61)] max-w-[80vw] max-h-[80vh] overflow-auto flex flex-col';

            const header = document.createElement('h2');
            header.className = 'mt-4 text-2xl font-bold text-center';
            header.innerText = person.name;

            const divider = document.createElement('hr');
            divider.className = 'border-t border-gray-400 my-3';

            const bio = document.createElement('p');
            bio.className = 'text-lg mb-2 p-6 text-justify';
            bio.innerText = person.biography;

            const doneButton = document.createElement('button');
            doneButton.className =
              'px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 self-end mb-6 mr-8';
            doneButton.innerText = 'Done';
            doneButton.onclick = closeModal;

            modalContent.appendChild(header);
            modalContent.appendChild(divider);
            modalContent.appendChild(bio);
            modalContent.appendChild(doneButton);
            modal.appendChild(modalContent);
            document.body.appendChild(modal);

            const handleKeyDown = (e: KeyboardEvent) => {
              if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleKeyDown);
              }
            };

            document.addEventListener('keydown', handleKeyDown);
          }}
          className="text-blue-500 ml-2"
        >
          read more
        </button>
      )}
    </p>
  );
};

export default Biography;