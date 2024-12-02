import React from 'react';
import Image from 'next/image';
import { ShowDetail } from '@/app/entities/ShowDetail';

import rotten from '@/public/rotten.png';
import splash from '@/public/splash.png';

const AboutSection = ({ show }: { show: ShowDetail }) => {
    return (
        <div className="p-6 lg:p-12">
            <h2 className="text-xl font-bold mb-6">About</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 rounded-lg shadow-lg col-span-1 md:col-span-2">
                    <h3 className="text-lg font-semibold">{show.name}</h3>
                    <p className="text-xs text-gray-400 font-black uppercase">
                        {show.genres.map((genre: { name: string }) => genre.name).join(", ")}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">{show.overview}</p>
                </div>

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
    );
};

export default AboutSection;