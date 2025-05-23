import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface M3UEntry {
    name: string;
    url: string;
    logo: string;
}

const parseM3U = (filePath: string): M3UEntry[] => {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.split('\n');
    const entries: M3UEntry[] = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('#EXTINF')) {
            const nameMatch = line.match(/tvg-name="([^"]*)"/);
            const name = nameMatch ? nameMatch[1] : 'Unknown';
            const logoMatch = line.match(/tvg-logo="([^"]*)"/);
            const logo = logoMatch ? logoMatch[1] : '';
            const url = lines[i + 1].trim();
            entries.push({ name, url, logo });
        }
    }

    return entries;
};

const filePath = path.join(process.cwd(), 'app/api/download/playlist.m3u');
const entries = parseM3U(filePath);

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const searchQuery = searchParams.get('search')?.toLowerCase() || '';

    const filteredEntries = entries.filter(entry => {
        const name = entry.name.toLowerCase();
        const words = searchQuery.split(' ');
        return words.every(word => name.includes(word));
    });

    return NextResponse.json(filteredEntries);
}
