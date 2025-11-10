# 🐳 Déploiement avec Docker

Guide complet pour déployer l'application Centre de Formation avec Docker et Docker Compose.

## 📋 Table des matières

- [Prérequis](#prérequis)
- [Installation rapide](#installation-rapide)
- [Mode développement](#mode-développement)
- [Mode production](#mode-production)
- [Configuration](#configuration)
- [Commandes utiles](#commandes-utiles)
- [Résolution des problèmes](#résolution-des-problèmes)

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Docker** (version 20.10 ou supérieure)
- **Docker Compose** (version 2.0 ou supérieure)
- **Git**

### Installation de Docker

#### Windows & macOS
Téléchargez et installez [Docker Desktop](https://www.docker.com/products/docker-desktop)

#### Linux (Ubuntu/Debian)
```bash
# Installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Installer Docker Compose
sudo apt-get update
sudo apt-get install docker-compose-plugin

# Ajouter votre utilisateur au groupe docker
sudo usermod -aG docker $USER
newgrp docker
```

Vérifiez l'installation :
```bash
docker --version
docker compose version
```

## Installation rapide

### 1. Cloner le repository

```bash
git clone <votre-repo-url>
cd webApp-projet2
```

### 2. Démarrer en mode production

```bash
# Construire et démarrer tous les services
docker compose up -d

# Ou avec rebuild forcé
docker compose up -d --build
```

L'application sera accessible sur :
- **Frontend** : http://localhost
- **Backend API** : http://localhost:3000
- **PostgreSQL** : localhost:5432

### 3. Vérifier le statut

```bash
docker compose ps
```

Vous devriez voir 3 services en cours d'exécution :
- `centre-formation-db` (PostgreSQL)
- `centre-formation-backend` (API Node.js)
- `centre-formation-frontend` (Application React)

### 4. Se connecter

Ouvrez http://localhost dans votre navigateur et connectez-vous avec :

- **Email** : admin@centre-formation.com
- **Mot de passe** : password123

## Mode développement

Pour le développement avec hot-reload :

```bash
# Démarrer en mode développement
docker compose -f docker-compose.dev.yml up

# Ou en arrière-plan
docker compose -f docker-compose.dev.yml up -d
```

L'application sera accessible sur :
- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:3000

Les modifications du code seront automatiquement détectées et l'application se rechargera.

## Mode production

### Configuration pour la production

1. **Modifier les variables d'environnement** dans `docker-compose.yml` :

```yaml
services:
  postgres:
    environment:
      POSTGRES_PASSWORD: VotreMotDePasseSecurise123!

  backend:
    environment:
      DATABASE_URL: postgresql://centre_admin:VotreMotDePasseSecurise123!@postgres:5432/centre_formation?schema=public
      JWT_SECRET: VotreCleSecreteTresLongueEtAleatoire123456789
```

2. **Démarrer l'application** :

```bash
docker compose up -d --build
```

3. **Initialiser la base de données** (première fois uniquement) :

```bash
# Le backend exécute automatiquement les migrations et le seed au démarrage
# Vérifiez les logs :
docker compose logs backend
```

## Configuration

### Variables d'environnement

#### PostgreSQL
- `POSTGRES_USER` : Utilisateur de la base de données
- `POSTGRES_PASSWORD` : Mot de passe (⚠️ à changer en production !)
- `POSTGRES_DB` : Nom de la base de données

#### Backend
- `DATABASE_URL` : URL de connexion PostgreSQL
- `JWT_SECRET` : Clé secrète JWT (⚠️ à changer en production !)
- `JWT_EXPIRES_IN` : Durée de validité du token (ex: 7d)
- `PORT` : Port du serveur (3000)
- `NODE_ENV` : Environnement (development/production)

#### Frontend
- `VITE_API_URL` : URL de l'API backend

### Ports exposés

| Service | Port interne | Port externe | Description |
|---------|--------------|--------------|-------------|
| Frontend | 80 | 80 | Application React (Nginx) |
| Backend | 3000 | 3000 | API Node.js |
| PostgreSQL | 5432 | 5432 | Base de données |

### Volumes persistants

Les données suivantes sont persistées dans des volumes Docker :

- `postgres_data` : Données de la base de données
- `backend_uploads` : Fichiers uploadés par les utilisateurs

## Commandes utiles

### Gestion des services

```bash
# Démarrer tous les services
docker compose up -d

# Arrêter tous les services
docker compose down

# Redémarrer un service spécifique
docker compose restart backend

# Voir les logs en temps réel
docker compose logs -f

# Voir les logs d'un service spécifique
docker compose logs -f backend

# Reconstruire les images
docker compose build

# Forcer la reconstruction et redémarrer
docker compose up -d --build --force-recreate
```

### Accès aux conteneurs

```bash
# Accéder au shell du backend
docker compose exec backend sh

# Accéder au shell de la base de données
docker compose exec postgres psql -U centre_admin -d centre_formation

# Exécuter une commande dans le backend
docker compose exec backend npm run prisma:studio
```

### Base de données

```bash
# Exécuter les migrations
docker compose exec backend npx prisma migrate deploy

# Peupler la base de données
docker compose exec backend npx prisma db seed

# Ouvrir Prisma Studio
docker compose exec backend npx prisma studio
```

### Nettoyage

```bash
# Arrêter et supprimer les conteneurs
docker compose down

# Supprimer également les volumes (⚠️ supprime les données)
docker compose down -v

# Supprimer les images
docker compose down --rmi all

# Nettoyage complet du système Docker
docker system prune -a
```

## Architecture Docker

### Structure des conteneurs

```
┌─────────────────────────────────────────────────┐
│                   Internet                      │
└─────────────────┬───────────────────────────────┘
                  │
                  │ Port 80
                  ▼
┌─────────────────────────────────────────────────┐
│          Frontend (Nginx + React)               │
│       centre-formation-frontend                 │
└─────────────────┬───────────────────────────────┘
                  │
                  │ HTTP Requests
                  ▼
┌─────────────────────────────────────────────────┐
│       Backend (Node.js + Express)               │
│       centre-formation-backend                  │
│              Port 3000                          │
└─────────────────┬───────────────────────────────┘
                  │
                  │ SQL Queries
                  ▼
┌─────────────────────────────────────────────────┐
│         PostgreSQL Database                     │
│         centre-formation-db                     │
│              Port 5432                          │
└─────────────────────────────────────────────────┘
```

### Volumes

```
postgres_data        → /var/lib/postgresql/data (PostgreSQL)
backend_uploads      → /app/uploads (Backend)
```

## Résolution des problèmes

### Problème : Les services ne démarrent pas

**Vérifier les logs :**
```bash
docker compose logs
```

**Vérifier que les ports ne sont pas utilisés :**
```bash
# Windows
netstat -ano | findstr :80
netstat -ano | findstr :3000
netstat -ano | findstr :5432

# macOS/Linux
lsof -i :80
lsof -i :3000
lsof -i :5432
```

### Problème : Erreur de connexion à la base de données

**Vérifier que PostgreSQL est bien démarré :**
```bash
docker compose ps postgres
docker compose logs postgres
```

**Attendre que PostgreSQL soit prêt :**
```bash
# Le service backend attend automatiquement que PostgreSQL soit prêt
# grâce au healthcheck
```

### Problème : Les modifications ne sont pas prises en compte

**En mode développement :**
```bash
# Vérifier que les volumes sont bien montés
docker compose -f docker-compose.dev.yml ps
```

**En mode production :**
```bash
# Reconstruire les images
docker compose up -d --build
```

### Problème : Manque de mémoire ou d'espace disque

**Nettoyer Docker :**
```bash
# Supprimer les conteneurs arrêtés
docker container prune

# Supprimer les images non utilisées
docker image prune -a

# Supprimer les volumes non utilisés
docker volume prune

# Nettoyage complet
docker system prune -a --volumes
```

### Problème : Permissions sous Linux

```bash
# Ajouter votre utilisateur au groupe docker
sudo usermod -aG docker $USER
newgrp docker

# Ou exécuter les commandes avec sudo
sudo docker compose up -d
```

## Monitoring et logs

### Surveiller les ressources

```bash
# Afficher l'utilisation des ressources en temps réel
docker stats

# Afficher l'utilisation des ressources pour un conteneur
docker stats centre-formation-backend
```

### Exporter les logs

```bash
# Exporter les logs dans un fichier
docker compose logs > logs.txt

# Exporter les logs d'un service
docker compose logs backend > backend-logs.txt
```

## Sauvegarde et restauration

### Sauvegarder la base de données

```bash
# Créer un backup
docker compose exec postgres pg_dump -U centre_admin centre_formation > backup.sql

# Ou avec date
docker compose exec postgres pg_dump -U centre_admin centre_formation > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restaurer la base de données

```bash
# Restaurer depuis un backup
docker compose exec -T postgres psql -U centre_admin -d centre_formation < backup.sql
```

## Mise en production

### Checklist de sécurité

- [ ] Changer tous les mots de passe par défaut
- [ ] Utiliser des secrets forts pour `JWT_SECRET`
- [ ] Ne pas exposer PostgreSQL publiquement (retirer le mapping du port 5432)
- [ ] Configurer HTTPS avec un reverse proxy (nginx, Traefik, etc.)
- [ ] Limiter les ressources des conteneurs
- [ ] Activer les logs centralisés
- [ ] Mettre en place des sauvegardes automatiques
- [ ] Configurer un monitoring (Prometheus, Grafana, etc.)

### Configuration avec reverse proxy (nginx)

Exemple de configuration nginx pour HTTPS :

```nginx
server {
    listen 443 ssl http2;
    server_name votre-domaine.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Support

Pour plus d'informations :
- Documentation Docker : https://docs.docker.com
- Documentation Docker Compose : https://docs.docker.com/compose

---

**Déployé avec Docker 🐳**
