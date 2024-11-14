"use client";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Person {
  adult: boolean;
  also_known_as: string[];
  biography: string;
  birthday: string;
  deathday: string | null;
  gender: number;
  homepage: string | null;
  id: number;
  imdb_id: string;
  known_for_department: string;
  name: string;
  place_of_birth: string;
  popularity: number;
  profile_path: string;
}

const PersonDetailPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const router = useRouter();
  const [person, setPerson] = useState<Person | null>(null);

  useEffect(() => {
    const fetchPersonDetails = async () => {
      const headers = {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
        'Content-Type': 'application/json;charset=utf-8',
      };

      const response = await fetch(`https://api.themoviedb.org/3/person/${id}`, { headers });
      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to fetch person details", data);
        return;
      }
      setPerson(data);
    };

    fetchPersonDetails();
  }, [id]);

  if (!person) {
    return <p>Person not found.</p>;
  }

  return (
    <div className="relative min-h-screen">

      <div className="container mx-auto px-4 py-8 text-white">
        <button onClick={() => router.back()} className="text-white mb-4">
          ← Back
        </button>
        
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Affiche du film */}
          <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
            <Image
              src={`https://image.tmdb.org/t/p/original${person.profile_path}`}
              alt={person.name}
              width={500}
              height={500}
              quality={100}
              className="rounded-lg shadow-lg"
            />
          </div>

          {/* Détails du film */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{person.popularity}</h1>
            <p className="text-gray-300 mb-4">{person.biography}</p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonDetailPage;