# 📖 Guide d'Installation Détaillé

Ce guide vous accompagne pas à pas dans l'installation et la configuration de l'application Centre de Formation pour Adultes.

## 📋 Sommaire

1. [Prérequis](#1-prérequis)
2. [Installation de PostgreSQL](#2-installation-de-postgresql)
3. [Installation de Node.js](#3-installation-de-nodejs)
4. [Configuration du projet](#4-configuration-du-projet)
5. [Configuration de la base de données](#5-configuration-de-la-base-de-données)
6. [Démarrage de l'application](#6-démarrage-de-lapplication)
7. [Vérification de l'installation](#7-vérification-de-linstallation)
8. [Résolution des problèmes](#8-résolution-des-problèmes)

## 1. Prérequis

### Systèmes d'exploitation supportés
- Windows 10/11
- macOS 10.15+
- Linux (Ubuntu 20.04+, Debian 10+, etc.)

### Logiciels requis
- Node.js v18 ou supérieur
- PostgreSQL v14 ou supérieur
- Git
- Un éditeur de code (VS Code recommandé)

## 2. Installation de PostgreSQL

### Windows

1. Télécharger PostgreSQL depuis [postgresql.org](https://www.postgresql.org/download/windows/)
2. Exécuter l'installateur
3. Pendant l'installation :
   - Choisir le port par défaut : `5432`
   - Définir un mot de passe pour l'utilisateur `postgres` (IMPORTANT : notez-le !)
   - Installer pgAdmin 4 (recommandé)

### macOS

```bash
# Avec Homebrew
brew install postgresql@14

# Démarrer PostgreSQL
brew services start postgresql@14
```

### Linux (Ubuntu/Debian)

```bash
# Mettre à jour les packages
sudo apt update

# Installer PostgreSQL
sudo apt install postgresql postgresql-contrib

# Démarrer le service
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## 3. Installation de Node.js

### Windows & macOS

1. Télécharger depuis [nodejs.org](https://nodejs.org/)
2. Installer la version LTS (Long Term Support)
3. Vérifier l'installation :

```bash
node --version  # Doit afficher v18.x ou supérieur
npm --version   # Doit afficher 9.x ou supérieur
```

### Linux (Ubuntu/Debian)

```bash
# Installer Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Vérifier l'installation
node --version
npm --version
```

## 4. Configuration du projet

### 1. Cloner le repository

```bash
git clone <votre-repo-url>
cd webApp-projet2
```

### 2. Installer les dépendances

```bash
# Installation globale (recommandé)
npm install

# OU installer séparément pour chaque partie
cd backend
npm install
cd ../frontend
npm install
cd ..
```

## 5. Configuration de la base de données

### Étape 1 : Créer la base de données

#### Méthode 1 : Avec psql (ligne de commande)

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Dans le prompt psql :
CREATE DATABASE centre_formation;

# Créer un utilisateur dédié (recommandé)
CREATE USER centre_admin WITH PASSWORD 'VotreMotDePasseSecurise123!';
GRANT ALL PRIVILEGES ON DATABASE centre_formation TO centre_admin;

# Quitter
\q
```

#### Méthode 2 : Avec pgAdmin

1. Ouvrir pgAdmin
2. Clic droit sur "Databases" > Create > Database
3. Nom : `centre_formation`
4. Owner : `postgres` (ou votre utilisateur)
5. Cliquer sur "Save"

### Étape 2 : Configurer les variables d'environnement Backend

```bash
cd backend
cp .env.example .env
```

Modifier le fichier `backend/.env` :

```env
# Si vous utilisez l'utilisateur postgres par défaut :
DATABASE_URL="postgresql://postgres:VotreMotDePasse@localhost:5432/centre_formation?schema=public"

# Ou avec l'utilisateur dédié :
DATABASE_URL="postgresql://centre_admin:VotreMotDePasseSecurise123!@localhost:5432/centre_formation?schema=public"

# Générer une clé secrète JWT (32+ caractères aléatoires)
JWT_SECRET="votre-cle-secrete-tres-longue-et-aleatoire-123456"
JWT_EXPIRES_IN="7d"

# Configuration serveur
PORT=3000
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:5173
```

### Étape 3 : Initialiser la base de données

```bash
cd backend

# Générer le client Prisma
npm run prisma:generate

# Créer les tables (migrations)
npm run prisma:migrate

# Peupler avec des données de test
npm run prisma:seed
```

Vous devriez voir :

```
✅ Administrateur créé
✅ Formateurs créés
✅ Apprenants créés
✅ Salles créées
✅ Formations créées
...
🎉 Seeding terminé avec succès !
```

### Étape 4 : Configurer les variables d'environnement Frontend

```bash
cd ../frontend
cp .env.example .env
```

Le fichier `frontend/.env` devrait contenir :

```env
VITE_API_URL=http://localhost:3000/api
```

## 6. Démarrage de l'application

### Option 1 : Démarrer tout en une commande (Recommandé)

Depuis la racine du projet :

```bash
npm run dev
```

Cela démarre :
- ✅ Backend sur http://localhost:3000
- ✅ Frontend sur http://localhost:5173

### Option 2 : Démarrer séparément

**Terminal 1 - Backend :**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend :**
```bash
cd frontend
npm run dev
```

## 7. Vérification de l'installation

### 1. Vérifier le Backend

Ouvrir dans le navigateur ou avec curl :

```bash
curl http://localhost:3000/health
```

Réponse attendue :
```json
{
  "status": "OK",
  "message": "API Centre de Formation - Running",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

### 2. Vérifier le Frontend

Ouvrir dans le navigateur : http://localhost:5173

Vous devriez voir la page de connexion.

### 3. Tester la connexion

Utilisez un compte de test :

- **Email :** admin@centre-formation.com
- **Mot de passe :** password123

Si vous pouvez vous connecter et voir le tableau de bord, tout fonctionne ! 🎉

## 8. Résolution des problèmes

### Problème : "Port 3000 already in use"

**Solution :**
```bash
# Trouver le processus utilisant le port
# Windows
netstat -ano | findstr :3000

# macOS/Linux
lsof -i :3000

# Tuer le processus ou changer le port dans backend/.env
PORT=3001
```

### Problème : "Database connection failed"

**Vérifications :**

1. PostgreSQL est-il démarré ?

```bash
# Windows (Services)
# Vérifier que "PostgreSQL" est en cours d'exécution

# macOS
brew services list | grep postgresql

# Linux
sudo systemctl status postgresql
```

2. Vérifier les credentials dans `backend/.env`
3. Vérifier que la base `centre_formation` existe :

```bash
psql -U postgres -l
```

### Problème : "Module not found" ou erreurs npm

**Solution :**

```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install

# Ou pour chaque workspace
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

### Problème : Erreurs Prisma

**Solution :**

```bash
cd backend

# Régénérer le client Prisma
npx prisma generate

# Recréer la base de données (ATTENTION : supprime les données)
npx prisma migrate reset

# Re-peupler
npm run prisma:seed
```

### Problème : CORS errors dans le navigateur

**Vérifications :**

1. `backend/.env` contient bien `FRONTEND_URL=http://localhost:5173`
2. Le backend est démarré
3. Vider le cache du navigateur (Ctrl+Shift+Del)

### Problème : "Cannot find module '@/...'"

**Solution :**

```bash
cd frontend

# Vérifier tsconfig.json
# Vérifier vite.config.ts

# Redémarrer le serveur Vite
npm run dev
```

## 🎯 Étapes suivantes

Maintenant que votre installation fonctionne :

1. ✅ Explorez le tableau de bord
2. ✅ Consultez le catalogue de formations
3. ✅ Testez l'inscription à une session
4. ✅ Explorez les différents rôles (Admin, Formateur, Apprenant)
5. ✅ Consultez la documentation API dans le README

## 📞 Besoin d'aide ?

Si vous rencontrez des problèmes non couverts par ce guide :

1. Vérifiez les logs dans la console
2. Vérifiez les logs du serveur backend
3. Consultez la documentation PostgreSQL
4. Ouvrez une issue sur GitHub

---

**Bon développement ! 🚀**
