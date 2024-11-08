import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';

// Initialisez la base de données avec le fichier `atlas.db`
const db = new Database('atlas.db');

// Activez le mode WAL pour une meilleure gestion des transactions
db.pragma('journal_mode = WAL');

// Création de la table `users` si elle n'existe pas déjà
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// Création de la table `favorites` avec une clé étrangère `userId`
db.prepare(`
  CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY,
    userId INTEGER NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    posterPath TEXT,
    releaseDate TEXT,
    voteAverage REAL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  )
`).run();


// Fonction pour ajouter un utilisateur administrateur par défaut
async function createAdminUser() {
  // Vérifie si un utilisateur avec le nom d'utilisateur 'admin' existe déjà
  const stmt = db.prepare(`SELECT * FROM users WHERE username = ?`);
  const existingAdmin = stmt.get('admin');

  if (!existingAdmin) {
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash('admin', 10);

    // Insérer l'utilisateur administrateur
    db.prepare(`
      INSERT INTO users (username, password)
      VALUES (?, ?)
    `).run('admin', hashedPassword);

    console.log("Admin user created with username 'admin' and default password.");
  }
}

export function getUserByUsername(username){
  const stmt = db.prepare(`
      SELECT id, username, password 
      FROM users 
      WHERE username = ?
  `);
  return stmt.get(username);
}

// Exécute la fonction pour créer l'utilisateur administrateur par défaut
createAdminUser().catch(console.error);
console.log(getUserByUsername('admin'));

// Exportez l'instance de la base de données pour utilisation dans d'autres modules
export default db;