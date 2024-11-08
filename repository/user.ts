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