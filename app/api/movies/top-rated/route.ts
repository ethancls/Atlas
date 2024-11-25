export const dynamic = 'force-dynamic';

import { Movie } from "@/app/entities/Movie";
import { authOptions } from "@/repository/auth";
import { Session } from "inspector";
import { getServerSession } from "next-auth";
import { NextResponse } from 'next/server';

export async function GET() {
  try {

    const session = await getServerSession(authOptions) as Session & { imdbKey: string };

    const imdbKey = session.imdbKey;

    const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated`, {
      headers: {
        'Authorization': `Bearer ${imdbKey}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Error ${response.status}: ${response.statusText}` }, { status: response.status });
    }

    const data = await response.json();
    const movies: Movie[] = data.results;

    return NextResponse.json(movies);
  } catch (error) {
    console.error("Error fetching movies:", error);
    return NextResponse.json({ error: "An error occured." }, { status: 500 });
  }
}