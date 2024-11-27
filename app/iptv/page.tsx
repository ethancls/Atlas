"use client";
import React, { useEffect, useState } from 'react';
import { DefaultLayout } from '@/components/app/DefaultLayout';
import { LoaderPinwheelIcon } from 'lucide-react';

interface Channel {
    name: string;
    group: string;
    logo: string;
    url: string;
}

const IPTVPage: React.FC = () => {
    const [channels, setChannels] = useState<Channel[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/playlist')
            .then(response => response.json())
            .then(data => {
                setChannels(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching playlist:', error);
                setLoading(false);
            });
    }, []);

    const filteredChannels = channels.filter(channel =>
        channel.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groupedChannels = filteredChannels.reduce((groups, channel) => {
        const group = groups[channel.group] || [];
        group.push(channel);
        groups[channel.group] = group;
        return groups;
    }, {} as { [key: string]: Channel[] });

    return (
        <DefaultLayout>
            <div className="min-h-screen p-6 sm:p-8 space-y-12 w-full">
                <input
                    type="text"
                    placeholder="Rechercher une chaîne..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                />
                {loading ? (
                    <div className="flex justify-center items-center min-h-screen">
                        <LoaderPinwheelIcon className="animate-spin h-16 w-16 text-gray-500" />
                    </div>
                ) : (
                    <div>
                        {Object.keys(groupedChannels).map(group => (
                            <div key={group} className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">{group}</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {groupedChannels[group].map(channel => (
                                        <div key={channel.name} className="p-4 border border-gray-300 rounded-md shadow-md">
                                            <img src={channel.logo} alt={channel.name} className="w-full h-32 object-contain mb-4" />
                                            <h3 className="text-lg font-semibold">{channel.name}</h3>
                                            <a href={channel.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                Regarder
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DefaultLayout>
    );
};

export default IPTVPage;