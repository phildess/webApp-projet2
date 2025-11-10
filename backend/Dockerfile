# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY tsconfig.json ./

# Installer les dépendances
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

# Installer seulement les dépendances de production
COPY package*.json ./
RUN npm ci --only=production

# Copier le build depuis le stage précédent
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Créer le dossier uploads
RUN mkdir -p uploads

# Exposer le port
EXPOSE 3000

# Variables d'environnement par défaut
ENV NODE_ENV=production

# Commande de démarrage
CMD ["node", "dist/index.js"]
