import { TVShow } from "@/app/entities/TVShow";
import { authOptions } from "@/repository/auth";
import { Session } from "inspector";
import { getServerSession } from "next-auth";
import { NextResponse } from 'next/server';

export async function GET() {
  try {

    const session = await getServerSession(authOptions) as Session & { imdbKey: string };

    const imdbKey = session.imdbKey;

    const response = await fetch(`https://api.themoviedb.org/3/tv/on_the_air`, {
      headers: {
        'Authorization': `Bearer ${imdbKey}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Error ${response.status}: ${response.statusText}` }, { status: response.status });
    }

    const data = await response.json();
    const shows: TVShow[] = data.results;

    return NextResponse.json(shows);
  } catch (error) {
    console.error("Error fetching shows:", error);
    return NextResponse.json({ error: "An error occured." }, { status: 500 });
  }
}