import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/repository/user';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: 'Missing username or password' }, { status: 400 });
  }

  try {
    const user = await createUser(username, password);

    if (user) {
      return NextResponse.json(user, { status: 201 });
    } else {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}