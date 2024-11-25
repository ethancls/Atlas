"use client";

import { usePersonDetail } from "@/hooks/usePersonDetail";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import PersonHeader from "@/components/persons/PersonHeader";
import PersonMovies from "@/components/persons/PersonMovies";
import PersonTVShows from "@/components/persons/PersonTVShows";
import PersonImages from "@/components/persons/PersonImages";

const PersonDetailPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const router = useRouter();
  const {
    person,
    movies,
    tvShows,
    personImages,
    isLoading,
    error
  } = usePersonDetail(id);

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
      <div className="relative">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-full h-full"
            title="Go back"
          >
            <ChevronLeftIcon className="h-7 w-7 text-gray-400" />
            <span className="text-gray-400 font-medium"></span>
          </button>

        <PersonHeader person={person} />

        <hr className="border-gray-500 my-1 w-[95%] mx-auto" />

        <PersonMovies movies={movies} />

        <PersonTVShows tvShows={tvShows} />

        <PersonImages personImages={personImages} personName={person.name} />

        <hr className="border-gray-500 my-1 w-[95%] mx-auto" />
      </div>
    );
  }
};

export default PersonDetailPage;