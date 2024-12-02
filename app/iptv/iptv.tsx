/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import { DefaultLayout } from "@/components/app/DefaultLayout";
import { Card, CardHeader } from "@/components/ui/card";
import Loading from "@/components/app/Loading";

interface Channel {
    name: string;
    group: string;
    logo: string;
    url: string;
}

const IPTVPage: React.FC = () => {
    const [channels, setChannels] = useState<Channel[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

    useEffect(() => {
        // Dynamically import mpegts-video-element only on client
        import "mpegts-video-element";

        fetch("/api/playlist")
            .then((response) => response.json())
            .then((data) => {
                setChannels(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching playlist:", error);
                setLoading(false);
            });
    }, []);

    const filteredChannels = channels.filter((channel) =>
        channel.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groupedChannels = filteredChannels.reduce((groups, channel) => {
        const group = groups[channel.group] || [];
        group.push(channel);
        groups[channel.group] = group;
        return groups;
    }, {} as { [key: string]: Channel[] });

    const handleChannelClick = (channel: Channel) => {
        setSelectedChannel(channel);
    };

    return (
        <DefaultLayout>
            <div className="min-h-screen p-6 sm:p-8 space-y-12 w-full">
                <input
                    type="text"
                    placeholder="Rechercher une chaîne, un film, une série..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                />

                {selectedChannel && (
                    <div onClick={() => setSelectedChannel(null)} className="fixed inset-0 z-10 bg-transparent flex flex-col items-center justify-center p-4">
                        {selectedChannel.url.endsWith(".mp4") ? (
                            <video
                                autoPlay
                                controls
                                src={selectedChannel.url}
                                style={{
                                    width: "100%",
                                    maxWidth: "900px",
                                    height: "auto",
                                }}
                                onClick={(e) => e.stopPropagation()}
                            ></video>
                        ) : selectedChannel.url.endsWith(".mkv") ? (
                            <a
                                href={selectedChannel.url}
                                download
                                className="dark:text-black text-white bg-black dark:bg-white font-bold py-4 px-8 rounded text-xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                Télécharger {selectedChannel.name}
                            </a>
                        ) : (
                            <mpegts-video
                                autoplay
                                controls
                                src={selectedChannel.url}
                                style={{
                                    width: "100%",
                                    maxWidth: "900px",
                                    height: "auto",
                                }}
                                onClick={(e) => e.stopPropagation()}
                            ></mpegts-video>
                        )}
                    </div>
                )}

                {loading ? (
                    <Loading isLoading={true} />
                ) : (
                    <div>
                        {Object.keys(groupedChannels).map((group) => (
                            <div key={group} className="mb-8">
                                <h2
                                    className="text-2xl font-bold mb-4 cursor-pointer"
                                    onClick={() =>
                                        setSelectedGroup(
                                            selectedGroup === group ? null : group
                                        )
                                    }
                                >
                                    {group}
                                </h2>
                                {selectedGroup === group && (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols- gap-6">
                                        {groupedChannels[group].map((channel) => (
                                            channel.url && <Card
                                                onClick={() => handleChannelClick(channel)}
                                                key={channel.url}
                                                className="w-full p-1 hover:opacity-90  bg-black rounded-lg"
                                            >
                                                <CardHeader className="p-1 relative">
                                                    <div className="cursor-pointer">
                                                        <img
                                                            src={channel.logo}
                                                            alt={channel.name}
                                                            className="w-full h-full top-0 left-0 object-cover rounded-lg"
                                                        />
                                                        <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-80 text-white text-center text-xs p-1">
                                                            {channel.name}
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DefaultLayout>
    );
};

export default IPTVPage;