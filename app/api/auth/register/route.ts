import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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
function saveUser(username: string, password: string) {
  const filePath = path.join(process.cwd(), '/public/atlas.json');
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
  const usersDatabase = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  usersDatabase.push({ username, password });
  fs.writeFileSync(filePath, JSON.stringify(usersDatabase, null, 2));
}

async function createUser(username: string, password: string) {
  const filePath = path.join(process.cwd(), '/public/atlas.json');
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
  const usersDatabase = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  const userExists = usersDatabase.some((user: { username: string }) => user.username === username);
  if (userExists) {
    throw new Error('User already exists');
  }
  saveUser(username, password);
  return { username };
}