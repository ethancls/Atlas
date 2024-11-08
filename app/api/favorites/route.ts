import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Favorite } from '@/app/entities/Favorite';

const favoritesFilePath = path.resolve(process.cwd(), 'app/api/favorites/favorites.json');

const getFavorites = (): Favorite[] => {
    if (fs.existsSync(favoritesFilePath)) {
        const favorites = fs.readFileSync(favoritesFilePath, 'utf-8');
        return favorites ? JSON.parse(favorites) : [];
    }
    return [];
};

const postFavorites = (favorite: Favorite): void => {
    try {
        const favorites = getFavorites();
        const exists = favorites.some(fav => fav.id === favorite.id);
        if (exists) {
            console.log("Favorite already exists:", favorite);
            return;
        }
        favorites.push(favorite);
        console.log("Favorite to be added:", favorite);
        console.log("Writing to favorites.json at path:", favoritesFilePath);
        fs.writeFileSync(favoritesFilePath, JSON.stringify(favorites, null, 2));
        console.log("Successfully wrote to favorites.json");
    } catch (error) {
        console.error("Failed to write to favorites.json:", error);
    }
};

export async function GET() {
    const favorites = getFavorites();
    return NextResponse.json(favorites, { status: 200 });
}

// Gérer la requête POST
export async function POST(req: NextRequest) {
    const body = await req.json();
    const { id, type, title, posterPath, releaseDate, voteAverage } = body;

    const favorite: Favorite = { id, type, title, posterPath, releaseDate, voteAverage };
    postFavorites(favorite);

    return NextResponse.json(favorite, { status: 201 });
}

// Handler pour gérer différentes méthodes HTTP si nécessaire
export async function handler(req: NextRequest) {
    if (req.method === 'GET') {
        return GET();
    } else if (req.method === 'POST') {
        return POST(req);
    } else {
        return NextResponse.json({ error: `Method ${req.method} Not Allowed` }, { status: 405 });
    }
}