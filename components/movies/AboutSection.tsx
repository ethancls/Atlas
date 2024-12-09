import React from 'react';
import Image from 'next/image';
import { MovieDetail } from '@/app/entities/MovieDetail';

import rotten from '@/public/rotten.png';
import splash from '@/public/splash.png';

interface AboutProps {
    movie: MovieDetail;
}

const About: React.FC<AboutProps> = ({ movie}) => {
    return (
        <div className="p-6 lg:p-12">
            {/* About */}
            <h2 className="text-xl font-bold mb-6">About</h2>
            <div className="grid grid-cols-5 gap-6">
                {/* Main Section */}
                <div className="p-4 rounded-lg border border-slate-300 col-span-3 lg:col-span-4">
                    <h3 className="text-lg font-semibold">{movie.title}</h3>
                    <p className="text-xs text-gray-400 font-black uppercase">
                        {movie.genres.map((genre) => genre.name).join(", ")}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">{movie.overview}</p>
                </div>

                {/* Tomatometer */}
                <div className="p-4 rounded-lg border border-slate-300 col-span-2 lg:col-span-1">
                    <h3 className="text-lg font-semibold flex items-center gap-1">
                        <Image
                            src={movie.vote_average > 5 ? rotten : splash}
                            alt={movie.vote_average > 5 ? "Rotten Tomatoes" : "Splash"}
                            width={15}
                            height={15}
                        />
                        {Math.round(movie.vote_average * 10)}%
                    </h3>
                    <p className="text-xs font-black uppercase text-gray-400">Tomatometer</p>
                    <ul className="text-sm text-gray-500 mt-2">
                        <li>Total Votes: {movie.vote_count}</li>
                        <li>Average Rating: {movie.vote_average.toFixed(1)}</li>
                        <li>Popularity: {movie.popularity.toFixed(0)}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default About;