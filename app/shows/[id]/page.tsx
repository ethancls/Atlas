"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeftIcon, Pause, Play, Volume2, VolumeX } from "lucide-react";

import rotten from "@/assets/rotten.png"
import splash from "@/assets/splash.png"

import { ShowDetail } from "@/app/entities/ShowDetail";

interface CastMember {
  id: number;
  name: string;
  profile_path: string;
  character: string;
}

interface RelatedShow {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
}

interface ImageData {
  type: string;
  file_path: string;
}

interface SeasonDetail {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
  episodes: {
    air_date: string;
    id: number;
    name: string;
    overview: string;
    still_path: string;
    runtime: number;
    episode_number: number;
    vote_average: number;
  }[];
}

const ShowDetailPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const router = useRouter();

  const [show, setShow] = useState<ShowDetail | null>(null);
  const [credits, setCredits] = useState<CastMember[]>([]);
  const [relatedShows, setRelatedShows] = useState<RelatedShow[]>([]);
  const [imagesData, setImagesData] = useState<ImageData[]>([]);
  const [trailerLink, setTrailerLink] = useState<string | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState<SeasonDetail | null>(null);

  useEffect(() => {
    const fetchShowDetails = async () => {
      const headers = {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
        "Content-Type": "application/json;charset=utf-8",
      };

      try {
        const showResponse = await fetch(
          `https://api.themoviedb.org/3/tv/${id}`,
          { headers }
        );
        const showData: ShowDetail = await showResponse.json();
        setShow(showData);

        const imagesResponse = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/images`,
          { headers }
        );
        const imagesData = await imagesResponse.json();
        setImagesData([
          ...imagesData.backdrops.filter((image: {
            iso_639_1: string;
          }) => image.iso_639_1 === "en" || image.iso_639_1 === null).map((image: {
            file_path: string;
          }) => ({
            type: "backdrop",
            file_path: image.file_path
          })),
          ...imagesData.logos.filter((image: {
            iso_639_1: string;
          }) => image.iso_639_1 === "en" || image.iso_639_1 === null).map((image: {
            file_path: string;
          }) => ({
            type: "logo",
            file_path: image.file_path
          })),
          ...imagesData.posters.filter((image: {
            iso_639_1: string;
          }) => image.iso_639_1 === "en" || image.iso_639_1 === null).map((image: {
            file_path: string;
          }) => ({
            type: "poster",
            file_path: image.file_path
          }))
        ]);

        const creditsResponse = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/credits`,
          { headers }
        );
        const creditsData = await creditsResponse.json();
        setCredits(creditsData.cast);

        const relatedResponse = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/recommendations`,
          { headers }
        );
        const relatedData = await relatedResponse.json();
        setRelatedShows(relatedData.results);

        const youtubeResponse = await fetch(
          `/api/youtube?search=${encodeURIComponent(
            showData.name + new Date(showData.first_air_date).getFullYear() + " series hd trailer"
          )}`,
          { cache: "no-store" }
        );
        const youtubeData = await youtubeResponse.json();
        if (youtubeData?.result?.[0]?.id) {
          setTrailerLink(
            `https://www.youtube.com/embed/${youtubeData.result[0].id}?autoplay=1&vq=hd2160&mute=1&enablejsapi=1&modestbranding=1&rel=0&controls=0&showinfo=1@iv_load_policy=3&autohide=1&playsinline=1&loop=1`
          );
        }

      } catch (error) {
        console.error("Error fetching show data:", error);
      }
    };

    fetchShowDetails();
  }, [id]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowTrailer(true);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [trailerLink]);

  if (!show) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
      </div>
    );
  }

  const toggleMute = () => {
    const iframe = document.getElementById("trailer-iframe") as HTMLIFrameElement;
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func: isMuted ? "unMute" : "mute",
        }),
        "*"
      );
      setIsMuted(!isMuted);
    }
  };

  const togglePlayPause = () => {
    const iframe = document.getElementById("trailer-iframe") as HTMLIFrameElement;
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func: showTrailer ? "pauseVideo" : "playVideo",
        }),
        "*"
      );
      setShowTrailer(!showTrailer);
    }
  }

  return (
    <div className="relative">
      {/* Backdrop or Trailer */}
      <div className="relative w-full h-[100vh]">
        {showTrailer && trailerLink ? (
          <div className="relative w-full h-full overflow-hidden">
            {/* Conteneur pour couper le haut de la vidéo */}
            <iframe
              src={trailerLink}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-[-60px] left-0 w-full h-full"
              id="trailer-iframe"
            />
            <button
              onClick={() => { toggleMute(); }}
              className="absolute top-4 right-8 z-30 text-white p-2 hover:bg-black/50 rounded"
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
            <button
              onClick={() => { togglePlayPause(); }}
              className="absolute top-4 right-20 z-30 p-2 text-white hover:bg-black/50 rounded"
            >
              {showTrailer ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>
          </div>
        ) : (
          <>
            <Image
              src={`https://image.tmdb.org/t/p/original${show.backdrop_path}`}
              alt={show.name}
              fill
              className="object-cover hidden md:block"
            />
            <Image
              src={`https://image.tmdb.org/t/p/original${show.poster_path}`}
              alt={show.name}
              fill
              className="object-cover block md:hidden"
            />
            <button
              onClick={() => { setShowTrailer(true); togglePlayPause(); }}
              className="absolute top-4 right-20 z-30 p-2 text-white hover:bg-black/50 rounded"
            >
              {showTrailer ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>
          </>
        )}

        {/* Conteneur transparent pour désactiver l'interaction */}
        {showTrailer && (
          <div className="absolute top-0 left-0 w-full h-full bg-transparent z-20"></div>
        )}

        {/* Bouton de retour */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 z-30 flex items-center gap-2 p-1 hover:bg-black/50 rounded"
        >
          <ChevronLeftIcon className="h-7 w-7 text-white" />
        </button>

        {/* Title and Info */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black to-transparent p-6 lg:p-12">
          {imagesData.filter(image => image.type === "logo")[0]?.file_path && (
            <Image
              src={`https://image.tmdb.org/t/p/original${imagesData.filter(image => image.type === "logo")[0].file_path}`}
              alt={show.name}
              width={1000}
              height={1000}
              quality={100}
              className={`object-cover w-[200px] md:w-[300px] lg:w-[400px]`}
            />
          )}
          <p className={`mt-4 text-gray-300 max-w-2xl text-justify transition-opacity duration-1000 ${showTrailer ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 h-auto'}`}>
            {show.overview}
          </p>
          <div className="flex flex-wrap items-center gap-x-1 text-sm text-gray-400">
            <div className="flex items-center">
              {show.genres.map((genre) => genre.name).join(", ")}
            </div>
            <div className="text-2xl">
              ·
            </div>
            <div className="flex items-center">
              {new Date(show.first_air_date).getFullYear()}
            </div>
            <div className="text-2xl">
              ·
            </div>
            {show.number_of_seasons > 0 && (
              <div className="flex items-center">
                {show.number_of_seasons} seasons
              </div>
            )}
            <div className="flex items-center px-1 gap-1">
              <Image
                src={show.vote_average > 5 ? rotten : splash}
                alt={show.vote_average > 5 ? "Rotten Tomatoes" : "Splash"}
                width={15}
                height={15}
                style={{ filter: "invert(1)" }}
              />
              <span>{Math.round(show.vote_average * 10)}%</span>
            </div>
            <div className="flex items-center border text-xs font-black border-gray-400 rounded px-1">HD</div>
            <div className="flex items-center border text-xs border-gray-400 rounded px-1">SDH</div>
            <div className="flex items-center border text-xs border-gray-400 rounded px-1">AD</div>
          </div>
        </div>
      </div>

      <div className="p-6 lg:p-12">
        {/* About */}
        <h2 className="text-xl font-bold mb-6">About</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Section */}
          <div className="p-4 rounded-lg shadow-lg col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold">{show.name}</h3>
            <p className="text-xs text-gray-400 font-black uppercase">{show.genres.map((genre) => genre.name).join(", ")}</p>
            <p className="text-sm text-gray-500 mt-2">{show.overview}</p>
          </div>

          {/* Tomatometer */}
          <div className="p-4 rounded-lg shadow-lg w-full md:w-64">
            <h3 className="text-lg font-semibold flex items-center gap-1">
              <Image
                src={show.vote_average > 5 ? rotten : splash}
                alt={show.vote_average > 5 ? "Rotten Tomatoes" : "Splash"}
                width={15}
                height={15}
              />
              {Math.round(show.vote_average * 10)}%
            </h3>
            <p className="text-xs font-black uppercase text-gray-400">Tomatometer</p>
            <ul className="text-sm text-gray-500 mt-2">
              <li>Total Votes: {show.vote_count}</li>
              <li>Average Rating: {show.vote_average.toFixed(1)}</li>
              <li>Popularity: {show.popularity.toFixed(0)}</li>
            </ul>
          </div>
        </div>
      </div>

      <hr className="border-gray-500 my-1 w-[95%] mx-auto" />

      {/* Seasons */}
      <div className="p-6 lg:p-12">
        <h2 className="text-xl font-semibold mb-4">Seasons</h2>
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
          {show.seasons.map((season) => (
            <div
              key={season.id}
              className="flex-shrink-0 w-[200px] cursor-pointer hover:opacity-80"
              onClick={async () => {
                try {
                  const headers = {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
                    "Content-Type": "application/json;charset=utf-8",
                  };
                  const seasonResponse = await fetch(
                    `https://api.themoviedb.org/3/tv/${id}/season/${season.season_number}`,
                    { headers }
                  );
                  const seasonData = await seasonResponse.json();
                  setSelectedSeason({
                    ...seasonData,
                    episodes: seasonData.episodes || [],
                  });
                } catch (error) {
                  console.error("Error fetching season data:", error);
                }
              }}
            >
              <Image
                src={`https://image.tmdb.org/t/p/original${season.poster_path}`}
                alt={season.name}
                width={500}
                height={500}
                className="rounded-md shadow-md"
                style={{ height: 300, width: 200 }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Selected Season Details */}
      {selectedSeason && (
        <div className="p-6 lg:p-12">
          <h2 className="text-xl font-semibold mb-4">{selectedSeason.name}</h2>
          <div className="space-y-6">
            {selectedSeason.episodes.map((episode) => (
              <div key={episode.id} className="flex items-start gap-4">
                {episode.still_path && (
                  <Image
                    src={`https://image.tmdb.org/t/p/original${episode.still_path}`}
                    alt={episode.name}
                    width={230}
                    height={230}
                    className="rounded-md shadow-md"
                  />
                )}
                <div>
                  <h3 className="text-lg font-semibold">{episode.name}</h3>
                  <p className="text-md text-gray-500 py-1">{episode.overview}</p>
                  <div className="flex items-center gap-2 mt-auto">
                    <p className="text-sm text-gray-400">Episode {episode.episode_number} · {episode.runtime} min · {new Date(episode.air_date).getFullYear()}</p>
                    <div className="flex items-center gap-2">
                      <Image
                        src={show.vote_average > 5 ? rotten : splash}
                        alt={show.vote_average > 5 ? "Rotten Tomatoes" : "Splash"}
                        width={15}
                        height={15}
                        style={{ filter: "invert(1)" }}
                      />
                      <span className="text-sm font-bold">{Math.round(episode.vote_average * 10)}%</span>
                    </div>
                    <div className="flex items-center border text-xs font-black border-gray-400 rounded px-1">HD</div>
                    <div className="flex items-center border text-xs border-gray-400 rounded px-1">SDH</div>
                    <div className="flex items-center border text-xs border-gray-400 rounded px-1">AD</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */
      }
      <div className="p-6 lg:p-12">
        <h2 className="text-xl font-semibold mb-4">Recommended</h2>
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
          {relatedShows.map((related) => (
            related.poster_path && (
              <div
                key={related.id}
                onClick={() => router.push(`/shows/${related.id}`)}
                className="flex-shrink-0 w-[200px] cursor-pointer hover:opacity-80"
              >
                <Image
                  src={`https://image.tmdb.org/t/p/original${related.poster_path}`}
                  alt={related.name}
                  width={500}
                  height={500}
                  className="rounded-md shadow-md"
                  style={{ height: 300, width: 200 }}
                />
              </div>)
          ))}
        </div>
      </div>

      {/* Cast */
      }
      <div className="p-6 lg:p-12">
        <h2 className="text-xl font-semibold mb-4">Cast</h2>
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
          {credits.map((credit) => (
            credit.profile_path && (<div
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
            </div>)
          ))}
        </div>
      </div>

      {/* Images */}
      <div className="p-6 lg:p-12">
        <h2 className="text-xl font-semibold mb-4">Images</h2>
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
          {imagesData.filter(image => image.type === "backdrop").map((image) => (
            <div
              key={image.file_path}
              className="flex-shrink-0 w-[300px] cursor-pointer"
              onClick={() => {
                const modal = document.createElement("div");
                modal.className =
                  "fixed inset-0 z-50 flex items-center justify-center bg-black/80";
                modal.onclick = () => modal.remove();

                const img = document.createElement("img");
                img.src = `https://image.tmdb.org/t/p/original${image.file_path}`;
                img.className =
                  "max-h-[80vh] max-w-[80vw] object-contain rounded-lg shadow-lg";

                modal.appendChild(img);
                document.body.appendChild(modal);
              }}
            >
              <Image
                src={`https://image.tmdb.org/t/p/original${image.file_path}`}
                alt="Show backdrop"
                width={300}
                height={200}
                quality={100}
                className="rounded-lg shadow-md hover:opacity-80"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Images */}
      <div className="p-6 lg:p-12">
        <h2 className="text-xl font-semibold mb-4">Posters</h2>
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
          {imagesData.filter(image => image.type === "poster").map((image) => (
            <div
              key={image.file_path}
              className="flex-shrink-0 w-[150px] cursor-pointer hover:opacity-80"
              onClick={() => {
                const modal = document.createElement("div");
                modal.className =
                  "fixed inset-0 z-50 flex items-center justify-center bg-black/80";
                modal.onclick = () => modal.remove();

                const img = document.createElement("img");
                img.src = `https://image.tmdb.org/t/p/original${image.file_path}`;
                img.className =
                  "max-h-[80vh] max-w-[80vw] object-contain rounded-lg shadow-lg";

                modal.appendChild(img);
                document.body.appendChild(modal);
              }}
            >
              <Image
                src={`https://image.tmdb.org/t/p/original${image.file_path}`}
                alt="Show poster"
                width={150}
                height={200}
                quality={100}
                className="rounded-lg shadow-md"
              />
            </div>
          ))}
        </div>
      </div>

      <hr className="border-gray-500 my-1 w-[95%] mx-auto" />

      {/* Columns Section */}
      <div className="p-6 lg:p-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Information Column */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Information</h2>
          <div className="space-y-4 ">
            <div>
              <h3 className="text-lg font-semibold">Studio</h3>
              <div className="flex flex-col">
                {show.production_companies.map((company) => (
                  <div key={company.id} className="flex items-center gap-2 p-3">
                    {company.logo_path && (
                      <Image
                        src={`https://image.tmdb.org/t/p/original${company.logo_path}`}
                        alt={company.name}
                        width={50}
                        height={50}
                        className="object-contain"
                      />
                    )}
                    <p className="text-sm text-gray-500">{company.name}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Release Date</h3>
              <p className="text-sm text-gray-500">{show.first_air_date}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Seasons</h3>
              <p className="text-sm text-gray-500">{show.number_of_seasons} Seasons</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Episodes</h3>
              <p className="text-sm text-gray-500">{show.number_of_episodes} Episodes</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Origin Country</h3>
              <p className="text-sm text-gray-500">{show.production_countries.map((country) => country.name).join(", ") || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Languages Column */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Languages</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Original Audio</h3>
              <p className="text-sm text-gray-500">{show.original_language.toUpperCase()}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Available Audio</h3>
              <p className="text-sm text-gray-500">{show.spoken_languages.map((lang) => lang.english_name).join(", ") || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Accessibility Column */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Accessibility</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">
                <strong>SDH:</strong> Subnames for the deaf and hard of hearing are available for select languages.
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">
                <strong>AD:</strong> Audio description is available for viewers with visual impairments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default ShowDetailPage;