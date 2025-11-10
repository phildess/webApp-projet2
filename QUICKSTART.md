# 🚀 Démarrage Rapide

Guide ultra-rapide pour lancer l'application en 2 minutes.

## Méthode 1 : Docker (Recommandé) 🐳

**Prérequis :** Docker installé ([Télécharger Docker](https://docs.docker.com/get-docker/))

### En 3 commandes :

```bash
# 1. Cloner
git clone <votre-repo-url>
cd webApp-projet2

# 2. Démarrer
docker compose up -d

# 3. Ouvrir
# Rendez-vous sur http://localhost
```

**Login :**
- Email : `admin@centre-formation.com`
- Mot de passe : `password123`

### Commandes utiles

```bash
# Voir les logs
docker compose logs -f

# Arrêter
docker compose down

# Redémarrer
docker compose restart
```

---

## Méthode 2 : Installation manuelle 💻

**Prérequis :** Node.js 18+, PostgreSQL 14+

```bash
# 1. Cloner
git clone <votre-repo-url>
cd webApp-projet2

# 2. Installer
npm install

# 3. Configurer PostgreSQL
psql -U postgres
CREATE DATABASE centre_formation;
\q

# 4. Backend - Initialiser la DB
cd backend
cp .env.example .env
# Éditer .env avec vos paramètres
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed

# 5. Frontend - Configurer
cd ../frontend
cp .env.example .env

# 6. Démarrer (2 terminaux)
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

**Accès :**
- Frontend : http://localhost:5173
- Backend : http://localhost:3000

---

## Scripts disponibles

### Avec Docker

```bash
# Production
./scripts/start.sh prod

# Développement
./scripts/start.sh dev

# Arrêt
./scripts/stop.sh
```

### Avec Make

```bash
make help       # Voir toutes les commandes
make up         # Démarrer
make down       # Arrêter
make logs       # Voir les logs
make dev        # Mode développement
```

---

## Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| **Admin** | admin@centre-formation.com | password123 |
| **Formateur** | jean.dupont@centre-formation.com | password123 |
| **Apprenant** | pierre.bernard@example.com | password123 |

---

## Problème ?

### Docker ne démarre pas

```bash
# Vérifier Docker
docker --version
docker compose version

# Nettoyer et redémarrer
docker compose down -v
docker compose up -d --build
```

### Port déjà utilisé

```bash
# Changer le port dans docker-compose.yml
ports:
  - "8080:80"  # Frontend sur port 8080
```

### Voir les erreurs

```bash
docker compose logs backend
docker compose logs frontend
docker compose logs postgres
```

---

## Documentation complète

- 📖 [README.md](./README.md) - Documentation complète
- 🐳 [DOCKER.md](./DOCKER.md) - Guide Docker détaillé
- 🛠️ [GUIDE_INSTALLATION.md](./GUIDE_INSTALLATION.md) - Installation manuelle

---

**Prêt à démarrer ? Choisissez votre méthode et lancez-vous ! 🎓**
