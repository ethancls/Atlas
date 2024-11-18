"use client";
import { CalendarDays, Clapperboard, HourglassIcon, InfoIcon, MoveLeftIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const ScoreEvaluation = ({ score }: { score: number }) => {
  const getColor = (score: number) => {
    let red, green;

    if (score <= 50) {
      // Transition from red to yellow (0 - 50)
      red = 255;
      green = Math.round((score / 50) * 255);
    } else {
      // Transition from yellow to green (51 - 100)
      green = 255;
      red = Math.round(255 - ((score - 50) / 50) * 255);
    }

    return `rgb(${red}, ${green}, 0)`;
  };

  return (
    <div className="outer_ring relative flex flex-col justify-center items-center w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16" >
      <div className="user_score_chart absolute inset-0">
        <CircularProgressbar
          value={score}
          styles={buildStyles({
            textSize: '0px',
            pathColor: getColor(score),
            trailColor: '#204529',
          })}
        />
      </div>
      <div className="percent flex flex-col justify-center items-center">
        <span className="text-white text-xs md:text-sm font-bold">{`${score}%`}</span>
      </div>
    </div>
  );
};

interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  genres: { id: number; name: string }[];
  vote_average: number;
  episode_run_time: number[];
}

interface CastMember {
  id: number;
  name: string;
  profile_path: string;
  character: string;
}

interface ImageData {
  file_path: string;
}

const ShowDetailPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const router = useRouter();
  const [show, setShow] = useState<TVShow | null>(null);
  const [credits, setCredits] = useState<CastMember[]>([]);
  const [imagesData, setImagesData] = useState<ImageData[]>([]);
  const [trailerLink, setTrailerLink] = useState<string | null>(null);

  useEffect(() => {
    const fetchShowDetails = async () => {
      const headers = {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
        'Content-Type': 'application/json;charset=utf-8',
      };

      try {
        // Fetch show details
        const showResponse = await fetch(`https://api.themoviedb.org/3/tv/${id}`, { headers });
        const showData: TVShow = await showResponse.json();
        setShow(showData);

        // Fetch credits
        const creditsResponse = await fetch(`https://api.themoviedb.org/3/tv/${id}/credits`, { headers });
        const creditsData = await creditsResponse.json();
        setCredits(creditsData.cast);

        // Fetch images
        const imagesResponse = await fetch(`https://api.themoviedb.org/3/tv/${id}/images`, { headers });
        const imagesData = await imagesResponse.json();
        setImagesData(imagesData.backdrops); // Update to handle 'backdrops'

        // Fetch YouTube trailer link
        const youtubeResponse = await fetch(`/api/youtube?search=${encodeURIComponent(showData.name + ' tv trailer season 1 ep 1 official')}`);
        const youtubeData = await youtubeResponse.json();

        // Extract the video ID
        if (youtubeData?.result?.[0]?.id) {
          setTrailerLink(`https://www.youtube.com/embed/${youtubeData.result[0].id}?autoplay=1`);
        }
      } catch (error) {
        console.error("Error fetching show data:", error);
      }
    };

    fetchShowDetails();
  }, [id]);

  if (!show) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 md:h-24 md:w-24 border-t-4 border-b-4 border-white"></div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen min-w-full bg-cover">
      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Image
          src={`https://image.tmdb.org/t/p/original${show.backdrop_path}`}
          alt={show.name}
          layout="fill"
          objectFit="cover"
          className="blur-lg opacity-70"
        />
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-4 backdrop-blur-2xl bg-slate-800/40 p-6 lg:p-12 overflow-hidden">
        <button
          onClick={() => router.back()}
          className="self-start transition-transform duration-300 ease-out text-white flex gap-1 items-center hover:scale-110 hover:shadow-lg"
        >
          <MoveLeftIcon className="h-4 w-4 md:h-5 md:w-5" /> Back
        </button>

        <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
          {/* Show Poster */}
          <div className="flex-shrink-0 mx-auto md:mx-0 duration-300 ease-out hover:scale-105 cursor-pointer p-2" onClick={() => {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/80';
            modal.onclick = () => modal.remove();

            const img = document.createElement('img');
            img.src = `https://image.tmdb.org/t/p/original${show.poster_path}`;
            img.className = 'max-h-[80vh] max-w-[80vw] object-contain rounded-lg shadow-lg';

            modal.appendChild(img);
            document.body.appendChild(modal);
          }}>
            <Image
              src={`https://image.tmdb.org/t/p/original${show.poster_path}`}
              alt={show.name}
              width={300}
              height={300}
              quality={100}
              className="rounded-lg shadow-lg w-[150px] md:w-[200px] lg:w-[300px] h-auto"
            />
          </div>

          {/* Show Details */}
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 flex items-center gap-5">
              {show.name}
              <ScoreEvaluation score={Math.round(show.vote_average * 10)} />
            </h1>
            <div className="flex flex-wrap items-center gap-2 md:gap-4 text-gray-300 text-sm md:text-base mb-4">
              <span className="block w-full"></span>
              <p className="flex items-center gap-1">
                <Clapperboard className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                {show.genres.map((genre) => genre.name).join(', ')}
              </p>
              <span className="block w-full"></span>
              <p className="flex items-center gap-1">
                <CalendarDays className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                {new Date(show.first_air_date).toLocaleDateString()}
              </p>
              <span className="block w-full"></span>
              <p className="flex items-center gap-1">
                <HourglassIcon className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                {show.episode_run_time.length > 0 ? `${show.episode_run_time[0]} min` : "N/A"}
              </p>
              <span className="block w-full"></span>
              <p className="flex items-center gap-1">
                <InfoIcon className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                {show.overview}
              </p>
            </div>
          </div>
          {trailerLink && (
            <div className="flex-shrink-0 lg:w-[60%] w-full relative rounded-xl overflow-hidden shadow-md">
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={trailerLink}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full object-cover"
                  title="TVShow Trailer"
                ></iframe>
              </div>
            </div>
          )}
        </div>

        {/* Credits */}
        <div>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Credits</h2>
          <div className="flex gap-6 p-2 overflow-x-auto scrollbar-hide">
            {credits.slice(0, 10).map((credit) => (
              <div
                key={credit.id}
                className="min-w-[160px] w-[180px] transition-transform duration-300 ease-out hover:scale-105 cursor-pointer"
                onClick={() => router.push(`/persons/${credit.id}`)}
              >
                <Image
                  src={`https://image.tmdb.org/t/p/original${credit.profile_path}`}
                  alt={credit.name}
                  width={200}
                  height={275}
                  className="rounded-lg shadow-md mb-3"
                />
                <p className="text-sm md:text-base font-semibold text-white">{credit.name}</p>
                <p className="text-xs md:text-sm text-gray-400 italic">{credit.character}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Images */}
        <div>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Images</h2>
          <div className="flex gap-4 p-2 overflow-x-auto scrollbar-hide">
            {imagesData.slice(0, 10).map((image) => (
              <div
                key={image.file_path}
                className="min-w-[350px] w-[350px] transition-transform duration-300 ease-out hover:scale-105 cursor-pointer"
                onClick={() => {
                  const modal = document.createElement('div');
                  modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/80';
                  modal.onclick = () => modal.remove();

                  const img = document.createElement('img');
                  img.src = `https://image.tmdb.org/t/p/original${image.file_path}`;
                  img.className = 'max-h-[70vh] max-w-[70vw] object-contain rounded-lg shadow-lg';

                  modal.appendChild(img);
                  document.body.appendChild(modal);
                }}
              >
                <Image
                  src={`https://image.tmdb.org/t/p/original${image.file_path}`}
                  alt="Show backdrop"
                  width={500}
                  height={500}
                  quality={100}
                  className="rounded-lg shadow-md"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowDetailPage;