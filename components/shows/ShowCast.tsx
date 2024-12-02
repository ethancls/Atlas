import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CastMember } from '@/app/entities/CastMember';

interface ShowCastProps {
    credits: CastMember[];
}

const ShowCast: React.FC<ShowCastProps> = ({ credits }) => {
    const router = useRouter();

    return (
        <div className="p-6 lg:p-12">
            <h2 className="text-xl font-semibold mb-4">Cast</h2>
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                {credits.map((credit) => (
                    credit.profile_path && (
                        <div
                            key={credit.id}
                            className="flex-shrink-0 w-[120px] text-center cursor-pointer hover:opacity-80"
                            onClick={() => router.push(`/persons/${credit.id}`)}
                        >
                            <Image
                                src={`https://image.tmdb.org/t/p/original${credit.profile_path}`}
                                alt={credit.name}
                                width={200}
                                height={200}
                                quality={100}
                                className="rounded-lg shadow-md object-cover"
                            />
                            <p className="text-sm mt-2">{credit.name}</p>
                            <p className="text-xs text-gray-400">{credit.character}</p>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
};

export default ShowCast;