import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { Favorite } from '@/app/entities/Favorite';

const dbPath = path.resolve(process.cwd(), 'atlas.json');

// Initialisez la base de données JSON si elle n'existe pas
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({ users: [], favorites: [] }, null, 2));
}

// Fonction pour lire la base de données
function readDB() {
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

// Fonction pour écrire dans la base de données
interface User {
  id: number;
  username: string;
  password: string;
  createdAt: string;
}

function writeDB(data: { users: User[]; favorites: Favorite[] }) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

export async function POST(req: NextRequest) {
  const { action, payload } = await req.json();

  const db = readDB();

  switch (action) {
    case 'getUsers':
      return NextResponse.json(db.users);

    case 'addUser':
      const { username, password } = payload;

      if (db.users.some((user: User) => user.username === username)) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        id: db.users.length + 1,
        username,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
      };

      db.users.push(newUser);
      writeDB(db);
      return NextResponse.json({ message: 'User added successfully' });

    case 'getUserByUsername':
      const user = db.users.find((u: User) => u.username === payload.username);
      return NextResponse.json(user || null);

    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }
}