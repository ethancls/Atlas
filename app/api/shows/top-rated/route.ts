import { TVShow } from "@/app/entities/TVShow";
import { authOptions } from "@/repository/auth";
import { Session } from "inspector";
import { getServerSession } from "next-auth";
import { NextResponse } from 'next/server';

export async function GET() {
  try {

    const session = await getServerSession(authOptions) as Session & { imdbKey: string };

    const imdbKey = session.imdbKey;

    const response = await fetch(`https://api.themoviedb.org/3/tv/top_rated`, {
      headers: {
        'Authorization': `Bearer ${imdbKey}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Erreur ${response.status}: ${response.statusText}` }, { status: response.status });
    }

    const data = await response.json();
    const shows: TVShow[] = data.results;

    return NextResponse.json(shows);
  } catch (error) {
    console.error("Erreur lors de la récupération des films:", error);
    return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
  }
}