# Utiliser l'image Node.js officielle
FROM node:20

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers du projet
COPY package.json package-lock.json ./
RUN npm install

# Copier le reste des fichiers
COPY . .

# Construire l'application Next.js
RUN npm run build

# Exposer le port 3000 (celui utilisé dans le conteneur)
EXPOSE 3000

# Lancer l'application Next.js
CMD ["npm", "run", "start"]