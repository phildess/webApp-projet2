# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY tsconfig.json ./

# Installer toutes les dépendances (y compris dev pour le build)
RUN npm ci

# Copier le code source
COPY prisma ./prisma/
COPY src ./src/

# Générer le client Prisma
RUN npx prisma generate

# Compiler TypeScript
RUN npm run build

# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer seulement les dépendances de production avec la nouvelle syntaxe
RUN npm ci --omit=dev

# Copier le build depuis le stage précédent
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Générer à nouveau le client Prisma pour la production
RUN npx prisma generate

# Créer le dossier uploads
RUN mkdir -p uploads && chown -R node:node /app

# Utiliser l'utilisateur non-root
USER node

# Exposer le port
EXPOSE 3000

# Variables d'environnement par défaut
ENV NODE_ENV=production

# Commande de démarrage
CMD ["node", "dist/index.js"]
