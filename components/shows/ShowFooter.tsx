import React from 'react';
import Image from 'next/image';
import { ShowDetail } from '@/app/entities/ShowDetail';

interface ShowFooterProps {
    show: ShowDetail;
}

const ShowFooter: React.FC<ShowFooterProps> = ({ show }) => {
    return (
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
    );
}

export default ShowFooter;