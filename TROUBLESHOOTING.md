# 🐛 Dépannage Docker

Guide de résolution des problèmes courants avec Docker.

## Erreurs de build

### Erreur : "npm ci --only=production failed"

**Solution :**
```bash
# Le flag --only=production est déprécié
# Les Dockerfiles ont été corrigés pour utiliser --omit=dev

# Nettoyer et reconstruire
docker compose down
docker compose build --no-cache
docker compose up -d
```

### Erreur : "Cannot find module '@prisma/client'"

**Solution :**
```bash
# Reconstruire le backend
docker compose build --no-cache backend
docker compose up -d
```

### Erreur : Build trop long ou bloqué

**Solution :**
```bash
# Augmenter la mémoire allouée à Docker
# Dans Docker Desktop: Settings > Resources > Memory (4GB minimum)

# Construire sans cache
docker compose build --no-cache

# Construire un service spécifique
docker compose build --no-cache backend
```

## Erreurs de connexion

### Erreur : "connection refused" ou "ECONNREFUSED"

**Solution :**
```bash
# Vérifier que tous les services sont démarrés
docker compose ps

# Vérifier les logs
docker compose logs postgres
docker compose logs backend

# Attendre le healthcheck de PostgreSQL
docker compose up -d
sleep 15
docker compose logs backend
```

### Erreur : "database does not exist"

**Solution :**
```bash
# Recréer la base de données
docker compose down -v
docker compose up -d

# Ou manuellement
docker compose exec postgres psql -U centre_admin -c "CREATE DATABASE centre_formation;"
docker compose restart backend
```

## Erreurs au démarrage

### Les services ne démarrent pas

**Diagnostic :**
```bash
# Voir tous les logs
docker compose logs

# Logs d'un service spécifique
docker compose logs backend
docker compose logs postgres
docker compose logs frontend

# Voir les logs en temps réel
docker compose logs -f
```

**Solutions :**

1. **Port déjà utilisé :**
```bash
# Trouver le processus utilisant le port
# Linux/Mac
lsof -i :80
lsof -i :3000

# Windows
netstat -ano | findstr :80
netstat -ano | findstr :3000

# Changer le port dans docker-compose.yml
# ou dans le fichier .env
FRONTEND_PORT=8080
BACKEND_PORT=3001
```

2. **Manque de mémoire :**
```bash
# Voir l'utilisation des ressources
docker stats

# Dans Docker Desktop: Settings > Resources
# Augmenter Memory à 4GB minimum
```

3. **Volumes corrompus :**
```bash
# Supprimer les volumes et redémarrer
docker compose down -v
docker compose up -d
```

## Problèmes de performance

### Application lente

**Solutions :**
```bash
# 1. Vérifier l'utilisation des ressources
docker stats

# 2. Limiter les ressources des services
# Dans docker-compose.yml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M

# 3. Nettoyer Docker
docker system prune -a
docker volume prune
```

## Problèmes de migration Prisma

### Erreur : "Migration failed"

**Solution :**
```bash
# Accéder au conteneur backend
docker compose exec backend sh

# Vérifier l'état des migrations
npx prisma migrate status

# Forcer les migrations
npx prisma migrate deploy

# Générer le client
npx prisma generate

# Sortir et redémarrer
exit
docker compose restart backend
```

### Erreur : "Schema does not match"

**Solution :**
```bash
# Réinitialiser complètement la base
docker compose down -v
docker compose up -d

# Ou manuellement
docker compose exec backend npx prisma migrate reset --force
```

## Nettoyer Docker

### Nettoyage complet

```bash
# Arrêter tous les conteneurs
docker compose down

# Supprimer les images
docker compose down --rmi all

# Supprimer les volumes (⚠️ perte de données)
docker compose down -v

# Nettoyer tout Docker
docker system prune -a --volumes

# Redémarrer proprement
docker compose up -d --build
```

### Nettoyage sélectif

```bash
# Conteneurs arrêtés
docker container prune

# Images non utilisées
docker image prune -a

# Volumes non utilisés
docker volume prune

# Build cache
docker builder prune
```

## Problèmes de permissions (Linux)

### Erreur : "Permission denied"

**Solution :**
```bash
# Ajouter votre utilisateur au groupe docker
sudo usermod -aG docker $USER
newgrp docker

# Ou exécuter avec sudo
sudo docker compose up -d

# Corriger les permissions des volumes
sudo chown -R $USER:$USER ./
```

## Logs et débogage

### Voir les logs détaillés

```bash
# Tous les logs
docker compose logs

# Logs en temps réel
docker compose logs -f

# Logs d'un service
docker compose logs backend

# Dernières lignes
docker compose logs --tail=50 backend

# Logs depuis un certain temps
docker compose logs --since=10m backend

# Sauvegarder les logs
docker compose logs > logs.txt
```

### Accéder aux conteneurs

```bash
# Shell du backend
docker compose exec backend sh

# Shell de PostgreSQL
docker compose exec postgres psql -U centre_admin -d centre_formation

# Exécuter une commande
docker compose exec backend npm run prisma:studio
```

## Reconstruction forcée

### Reconstruire tout

```bash
# Méthode 1 : Complète
docker compose down -v
docker compose build --no-cache
docker compose up -d

# Méthode 2 : Avec le script
./scripts/stop.sh
./scripts/start.sh prod

# Méthode 3 : Avec make
make clean
make build
make up
```

### Reconstruire un service

```bash
# Backend uniquement
docker compose build --no-cache backend
docker compose up -d backend

# Frontend uniquement
docker compose build --no-cache frontend
docker compose up -d frontend
```

## Variables d'environnement

### Les variables ne sont pas prises en compte

**Solution :**
```bash
# Vérifier le fichier .env
cat .env

# S'assurer qu'il est dans le même dossier que docker-compose.yml
ls -la .env

# Créer depuis le template
cp .env.docker .env

# Éditer les valeurs
nano .env

# Redémarrer
docker compose down
docker compose up -d
```

## Base de données

### Sauvegarder la base

```bash
# Backup
docker compose exec postgres pg_dump -U centre_admin centre_formation > backup.sql

# Restaurer
docker compose exec -T postgres psql -U centre_admin -d centre_formation < backup.sql
```

### Réinitialiser la base

```bash
# Supprimer le volume
docker compose down -v

# Redémarrer (recrée automatiquement)
docker compose up -d

# Vérifier les logs
docker compose logs backend
```

## Vérifications de santé

### Vérifier que tout fonctionne

```bash
# 1. État des conteneurs
docker compose ps

# Tous doivent être "Up" ou "running"

# 2. Health check backend
curl http://localhost:3000/health

# Doit retourner: {"status":"OK",...}

# 3. Frontend
curl http://localhost

# Doit retourner du HTML

# 4. PostgreSQL
docker compose exec postgres pg_isready -U centre_admin

# Doit retourner: accepting connections

# 5. Logs sans erreurs
docker compose logs backend | grep -i error
```

## Support

Si le problème persiste :

1. Collectez les informations :
```bash
docker compose ps > status.txt
docker compose logs > logs.txt
docker version >> status.txt
docker compose version >> status.txt
```

2. Consultez la documentation :
   - [DOCKER.md](./DOCKER.md)
   - [README.md](./README.md)

3. Vérifiez les issues GitHub du projet

---

**Besoin d'aide supplémentaire ?** Ouvrez une issue avec les logs collectés.
