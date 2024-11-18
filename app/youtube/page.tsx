"use client";
import { useState } from 'react';

async function searchYouTube(searchQuery: string) {
    try {
        const res = await fetch(`/api/youtube?search=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();

        if (res.ok) {
            return data;
        } else {
            console.error('Erreur de l’API :', data.error);
            return null;
        }
    } catch (error) {
        console.error('Erreur réseau :', error);
        return null;
    }
}

export default function YouTubeSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);

    const handleSearch = async () => {
        const data = await searchYouTube(query);
        setResults(data);
    };

    return (
        <div>
            <h1>Recherche YouTube</h1>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Entrez votre recherche"
            />
            <button onClick={handleSearch}>Rechercher</button>

            {results && (
                <div>
                    <h3>Résultats :</h3>
                    <pre>{JSON.stringify(results, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}