import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  try {
    const user = getUserByUsername(username);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const hash = bcrypt.compareSync(password, user.password);

    if (!hash) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Connexion réussie
    return NextResponse.json({ message: 'Login successful', user: { id: user.id, username: user.username } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Function to get user by username
function getUserByUsername(username: string) {
  const filePath = path.join(process.cwd(), 'app/api/auth/atlas.json');
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
  const usersDatabase = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  return usersDatabase.find((user: { username: string }) => user.username === username);
}