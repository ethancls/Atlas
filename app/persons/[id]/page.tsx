"use client";

import PersonHeader from "@/components/persons/PersonHeader";
import PersonImages from "@/components/persons/PersonImages";
import PersonMovies from "@/components/persons/PersonMovies";
import PersonTVShows from "@/components/persons/PersonTVShows";
import { usePersonDetail } from "@/hooks/usePersonDetail";
import { useSession } from "next-auth/react";

const PersonDetailPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const session = useSession() as unknown as { data: { imdbKey: string } };
  const imdbKey = session.data?.imdbKey;
  const {
    person,
    movies,
    tvShows,
    personImages,
    isLoading,
    error
  } = usePersonDetail(id, imdbKey);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 dark:border-white border-black"></div>
      </div>
    );
  } else {

    if (error || !person) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-red-500">{error}</p>
        </div>
      );
    }

    return (
      <div>
        <PersonHeader person={person} />

        <hr className="border-gray-500 my-1 w-[92%] mx-auto" />

        <PersonMovies movies={movies} />

        <PersonTVShows tvShows={tvShows} />

        <hr className="border-gray-500 my-1 w-[92%] mx-auto" />

        <PersonImages personImages={personImages} personName={person.name} />
      </div>
    );
  }
};

export default PersonDetailPage;