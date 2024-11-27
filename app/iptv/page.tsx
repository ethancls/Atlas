"use client";
import React, { useEffect, useState } from 'react';

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
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

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
        <div>
            <input
            type="text"
            placeholder="Search channels..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            />
            {loading ? (
            <div>Loading...</div>
            ) : (
            Object.keys(groupedChannels).map(group => (
                <div key={group}>
                <h2 onClick={() => setSelectedGroup(selectedGroup === group ? null : group)}>
                    {group}
                </h2>
                {selectedGroup === group && (
                    <div>
                    {groupedChannels[group].map(channel => (
                        <div key={channel.url}>
                        <img src={channel.logo} alt={channel.name} height={120} width={120}/>
                        <p>{channel.name}</p>
                        </div>
                    ))}
                    </div>
                )}
                </div>
            ))
            )}
        </div>
    );
};

export default IPTVPage;