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

const deleteFavorite = (id: number): void => {
    try {
        const favorites = getFavorites();
        const newFavorites = favorites.filter(fav => fav.id !== id);
        fs.writeFileSync(favoritesFilePath, JSON.stringify(newFavorites, null, 2));
    } catch (error) {
        console.error("Failed to delete favorite:", error);
    }
}

const isFavorite = (id: number): boolean => {
    const favorites = getFavorites();
    return favorites.some((favorite) => favorite.id === id);
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const id = parseInt(params.id);

    if (isNaN(id)) {
        return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const favoriteStatus = isFavorite(id);
    return NextResponse.json({ isFavorite: favoriteStatus }, { status: 200 });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const id = parseInt(params.id);

    if (isNaN(id)) {
        return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    deleteFavorite(id);
    return NextResponse.json({ message: 'Favorite deleted successfully' }, { status: 200 });
}