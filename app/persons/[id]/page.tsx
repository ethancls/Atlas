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

interface KnownForMovie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
}

const PersonDetailPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const router = useRouter();
  const [person, setPerson] = useState<Person | null>(null);
  const [knownFor, setKnownFor] = useState<KnownForMovie[]>([]);

  useEffect(() => {
    const fetchPersonDetails = async () => {
      const headers = {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
        'Content-Type': 'application/json;charset=utf-8',
      };

      try {
        const response = await fetch(`https://api.themoviedb.org/3/person/${id}`, { headers });
        const data = await response.json();
        if (!response.ok) throw new Error('Failed to fetch person details');

        setPerson(data);

        // Fetch "Known For" data (movie credits)
        const creditsResponse = await fetch(`https://api.themoviedb.org/3/person/${id}/movie_credits`, { headers });
        const creditsData = await creditsResponse.json();

        setKnownFor(creditsData.cast.slice(0, 6)); // Top 6 known movies
      } catch (error) {
        console.error('Error fetching person data:', error);
      }
    };

    fetchPersonDetails();
  }, [id]);

  if (!person) {
    return <p>Person not found.</p>;
  }

  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <button onClick={() => router.back()} className="text-white mb-4">
          ← Back
        </button>

        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Profile Picture */}
          <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
            <Image
              src={`https://image.tmdb.org/t/p/original${person.profile_path}`}
              alt={person.name}
              width={500}
              height={750}
              quality={100}
              className="rounded-lg shadow-lg"
            />
          </div>

          {/* Details Section */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{person.name}</h1>
            <h2 className="text-xl font-semibold mb-4">Biography</h2>
            <p className="text-gray-300 mb-6">{person.biography || 'No biography available.'}</p>

            <h2 className="text-xl font-semibold mb-4">Known For</h2>
            <div className="flex gap-4 overflow-x-auto">
              {knownFor.map((movie) => (
                <div key={movie.id} className="flex-shrink-0 w-36">
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title ?? movie.name ?? 'Unknown title'}
                    width={144}
                    height={216}
                    className="rounded-lg shadow-md"
                  />
                  <p className="text-sm text-center mt-2">{movie.title || movie.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonDetailPage;