"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";
import { useShowDetail } from "@/app/shows/rules/useShowDetail";
import TrailerPlayer from "@/components/shows/TrailerPlayer";
import AboutSection from "@/components/shows/AboutSection";
import Recommendations from "@/components/shows/Recommendations";
import ShowCast from "@/components/shows/ShowCast";
import ShowImages from "@/components/shows/ShowImages";
import { SeasonsList } from "@/components/shows/SeasonsList";
import { SeasonDetails } from "@/components/shows/SeasonDetails";
import Loading from "@/components/app/Loading";
import { SeasonDetail } from "@/app/entities/SeasonDetail";
import { ShowDetailRepository } from "@/repository/ShowDetailRepository";
import ShowFooter from "@/components/shows/ShowFooter";
import { useSession } from "next-auth/react";
import { DefaultLayout } from "@/components/app/DefaultLayout";
import ShowPosters from "@/components/shows/ShowPosters";

const ShowDetailPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const router = useRouter();
  const session = useSession() as unknown as { data: { imdbKey: string } };
  const imdbKey = session.data?.imdbKey;

  const {
    show,
    credits,
    images,
    relatedShows,
    seasons,
    isLoading,
    error,
    trailerLink
  } = useShowDetail(id, imdbKey);

  const [selectedSeason, setSelectedSeason] = useState<SeasonDetail | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowTrailer(true);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [trailerLink]);


  if (isLoading) {
    return <Loading isLoading={isLoading} />;
  }

  if (error || !show) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error as string}</p>
      </div>
    );
  }

  return (
    <DefaultLayout>
      <div className="relative">

        <TrailerPlayer
          show={show}
          images={images}
          showTrailer={showTrailer}
          certification="13+"
          trailerLink={trailerLink}
          setShowTrailer={setShowTrailer}
        />

        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 z-30 flex items-center gap-2 p-1 hover:bg-black/50 rounded"
        >
          <ChevronLeftIcon className="h-7 w-7 text-white" />
        </button>

        <AboutSection show={show} />

        <hr className="border-gray-500 my-1 w-[95%] mx-auto" />

        <SeasonsList
          show={show}
          seasons={seasons}
          onSelectSeason={async (seasonNumber) => {
            const repository = new ShowDetailRepository(imdbKey);
            const seasonDetails = await repository.fetchSeasonDetails(id, seasonNumber);
            setSelectedSeason(seasonDetails);
          }}
        />

        <SeasonDetails season={selectedSeason} show={show} />

        <Recommendations relatedShows={relatedShows} />

        <ShowCast credits={credits} />

        <ShowImages images={images} />

        <ShowPosters images={images} />

        <hr className="border-gray-500 my-1 w-[95%] mx-auto" />

        <ShowFooter show={show} />

      </div>
    </DefaultLayout>
  );
};

export default ShowDetailPage;