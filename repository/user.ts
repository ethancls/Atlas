import db from '../db';

// Définition de l'interface `User
export interface User {
    id: number;
    username: string;
    password: string;
}

// Fonction pour récupérer l'utilisateur par `username`
export function getUserByUsername(username: string): User | undefined {
    const stmt = db.prepare(`
        SELECT id, username, password 
        FROM users 
        WHERE username = ?
    `);
    return stmt.get(username) as User | undefined;
}

export function createUser(username: unknown, password: unknown) {
    if (typeof username !== 'string' || typeof password !== 'string') {
      throw new Error('Username and password must be strings');
    }
  
    if (!username.trim() || !password.trim()) {
      throw new Error('Username and password cannot be empty');
    }
  
    if (getUserByUsername(username)) {
      throw new Error('Username already exists');
    }
  
    const stmt = db.prepare(`
        INSERT INTO users (username, password)
        VALUES (?, ?)
    `);
    return stmt.run(username, password);
  }