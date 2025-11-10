# 🎓 Web Application - Centre de Formation pour Adultes

Une application web moderne et complète pour la gestion d'un centre de formation pour adultes, développée avec React, Node.js, TypeScript et PostgreSQL.

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Technologies utilisées](#-technologies-utilisées)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Démarrage](#-démarrage)
- [Structure du projet](#-structure-du-projet)
- [API Documentation](#-api-documentation)
- [Comptes de test](#-comptes-de-test)
- [Modules](#-modules)

## ✨ Fonctionnalités

### Module Apprenants
- ✅ Inscription en ligne avec validation
- ✅ Gestion des profils complets (informations personnelles, documents)
- ✅ Historique des formations suivies
- ✅ Suivi des formations actuelles
- ✅ Gestion des statuts (actif, en attente, terminé, suspendu)

### Module Formations
- ✅ Catalogue de formations avec recherche et filtres avancés
- ✅ Création et modification de formations
- ✅ Gestion des sessions (dates, places disponibles, formateurs)
- ✅ Système d'inscription aux sessions

### Module Emplois du Temps
- ✅ Génération d'emplois du temps par formation/formateur
- ✅ Gestion des salles et ressources
- ✅ Vue calendrier interactive
- ✅ Gestion des contraintes de disponibilité

### Module Programmes de Formation
- ✅ Structure modulaire des formations
- ✅ Ressources pédagogiques (documents, vidéos, liens)
- ✅ Suivi de progression par module
- ✅ Compétences par formation/module

### Module Évaluation
- ✅ Notation sur 20 avec coefficients personnalisables
- ✅ Évaluation par compétences (Acquis, En cours, Non acquis)
- ✅ Saisie et modification des notes par les formateurs
- ✅ Consultation des résultats détaillés
- ✅ Génération de bulletins et attestations

### Module Formateurs
- ✅ Gestion des profils et qualifications
- ✅ Gestion des contrats (CDI, CDD, Vacation, Freelance)
- ✅ Gestion des disponibilités
- ✅ Tableau de bord dédié

### Module Administration
- ✅ Gestion des utilisateurs et rôles
- ✅ Rapports et statistiques
- ✅ Système de notifications
- ✅ Sauvegarde des données

## 🚀 Technologies utilisées

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Typage statique
- **Prisma** - ORM pour PostgreSQL
- **PostgreSQL** - Base de données relationnelle
- **JWT** - Authentification sécurisée
- **bcryptjs** - Hashage des mots de passe

### Frontend
- **React 18** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Vite** - Build tool moderne et rapide
- **Tailwind CSS** - Framework CSS utility-first
- **React Router** - Navigation côté client
- **Axios** - Client HTTP
- **React Hook Form** - Gestion des formulaires
- **React Hot Toast** - Notifications
- **React Icons** - Bibliothèque d'icônes

## 📦 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (v18 ou supérieur)
- **npm** ou **yarn**
- **PostgreSQL** (v14 ou supérieur)
- **Git**

## 🛠️ Installation

### 1. Cloner le repository

```bash
git clone <votre-repo-url>
cd webApp-projet2
```

### 2. Installer les dépendances

```bash
# Installer les dépendances globales et des workspaces
npm install

# Ou installer séparément
cd backend && npm install
cd ../frontend && npm install
```

### 3. Configuration de la base de données

#### Créer la base de données PostgreSQL

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données
CREATE DATABASE centre_formation;

# Créer un utilisateur (optionnel)
CREATE USER centre_admin WITH PASSWORD 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON DATABASE centre_formation TO centre_admin;

# Quitter
\q
```

## ⚙️ Configuration

### Backend

1. Copier le fichier `.env.example` vers `.env` :

```bash
cd backend
cp .env.example .env
```

2. Modifier le fichier `.env` avec vos paramètres :

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/centre_formation?schema=public"

# JWT
JWT_SECRET="votre-clé-secrète-très-sécurisée"
JWT_EXPIRES_IN="7d"

# Server
PORT=3000
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:5173
```

3. Générer le client Prisma et exécuter les migrations :

```bash
# Générer le client Prisma
npm run prisma:generate

# Exécuter les migrations
npm run prisma:migrate

# Peupler la base de données avec des données de test
npm run prisma:seed
```

### Frontend

1. Copier le fichier `.env.example` vers `.env` :

```bash
cd frontend
cp .env.example .env
```

2. Le fichier `.env` devrait contenir :

```env
VITE_API_URL=http://localhost:3000/api
```

## 🚀 Démarrage

### Démarrer l'application complète

Depuis la racine du projet :

```bash
# Démarrer backend et frontend simultanément
npm run dev
```

### Démarrer séparément

#### Backend uniquement

```bash
cd backend
npm run dev
```

L'API sera accessible sur `http://localhost:3000`

#### Frontend uniquement

```bash
cd frontend
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## 📁 Structure du projet

```
webApp-projet2/
├── backend/                    # API Node.js + Express
│   ├── prisma/
│   │   ├── schema.prisma      # Schéma de base de données
│   │   └── seed.ts            # Données de test
│   ├── src/
│   │   ├── config/            # Configuration (DB, JWT)
│   │   ├── controllers/       # Contrôleurs REST
│   │   ├── middleware/        # Middlewares (auth, errors)
│   │   ├── routes/            # Routes API
│   │   ├── services/          # Logique métier
│   │   ├── types/             # Types TypeScript
│   │   ├── utils/             # Utilitaires
│   │   └── index.ts           # Point d'entrée
│   ├── uploads/               # Fichiers uploadés
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # Application React
│   ├── src/
│   │   ├── components/        # Composants réutilisables
│   │   ├── context/           # Contextes React
│   │   ├── hooks/             # Hooks personnalisés
│   │   ├── pages/             # Pages de l'application
│   │   ├── services/          # Services API
│   │   ├── types/             # Types TypeScript
│   │   ├── utils/             # Utilitaires
│   │   ├── App.tsx            # Composant principal
│   │   ├── main.tsx           # Point d'entrée
│   │   └── index.css          # Styles globaux
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── package.json               # Configuration monorepo
└── README.md
```

## 📚 API Documentation

### Authentification

#### POST `/api/auth/register`
Créer un nouveau compte utilisateur.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "nom": "Dupont",
  "prenom": "Jean",
  "role": "APPRENANT",
  "telephone": "0123456789"
}
```

#### POST `/api/auth/login`
Se connecter à l'application.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": { ... },
  "token": "jwt-token",
  "message": "Connexion réussie"
}
```

#### GET `/api/auth/profile`
Récupérer le profil de l'utilisateur connecté.

**Headers:** `Authorization: Bearer <token>`

### Formations

#### GET `/api/formations`
Liste de toutes les formations.

**Query params:**
- `niveau`: DEBUTANT | INTERMEDIAIRE | AVANCE | EXPERT
- `domaine`: string
- `search`: string

#### GET `/api/formations/:id`
Détails d'une formation.

#### POST `/api/formations`
Créer une nouvelle formation (ADMIN uniquement).

#### PUT `/api/formations/:id`
Modifier une formation (ADMIN uniquement).

#### DELETE `/api/formations/:id`
Supprimer une formation (ADMIN uniquement).

### Apprenants

#### GET `/api/apprenants`
Liste de tous les apprenants (ADMIN, FORMATEUR).

**Query params:**
- `statut`: ACTIF | EN_ATTENTE | TERMINE | SUSPENDU
- `search`: string

#### GET `/api/apprenants/:id`
Détails d'un apprenant.

#### PUT `/api/apprenants/:id`
Modifier un apprenant.

### Évaluations

#### POST `/api/evaluations`
Créer une évaluation (ADMIN, FORMATEUR).

#### POST `/api/evaluations/notes`
Saisir une note (ADMIN, FORMATEUR).

#### GET `/api/evaluations/apprenants/:apprenantId/notes`
Récupérer les notes d'un apprenant.

### Emploi du temps

#### GET `/api/emploi-du-temps`
Récupérer l'emploi du temps.

**Query params:**
- `dateDebut`: ISO date
- `dateFin`: ISO date
- `sessionId`: string
- `formateurId`: string
- `salleId`: string

#### POST `/api/emploi-du-temps`
Créer un cours dans l'emploi du temps (ADMIN).

## 👥 Comptes de test

Après avoir exécuté `npm run prisma:seed`, vous pouvez vous connecter avec :

### Administrateur
- **Email:** admin@centre-formation.com
- **Mot de passe:** password123

### Formateurs
- **Email:** jean.dupont@centre-formation.com
- **Mot de passe:** password123

- **Email:** marie.martin@centre-formation.com
- **Mot de passe:** password123

### Apprenants
- **Email:** pierre.bernard@example.com
- **Mot de passe:** password123

- **Email:** sophie.dubois@example.com
- **Mot de passe:** password123

## 🎯 Modules

### 1. Module Apprenants
- Gestion complète des profils
- Inscription et validation
- Suivi des formations
- Historique et documents

### 2. Module Formations
- Catalogue complet
- Sessions planifiées
- Inscriptions en ligne
- Gestion des places

### 3. Module Emplois du Temps
- Calendrier interactif
- Gestion des salles
- Contraintes horaires
- Vue par formateur/session

### 4. Module Programmes
- Structure modulaire
- Ressources pédagogiques
- Suivi de progression
- Compétences visées

### 5. Module Évaluation
- Notes et coefficients
- Évaluation par compétences
- Bulletins automatiques
- Statistiques détaillées

### 6. Module Formateurs
- Profils et qualifications
- Gestion des contrats
- Disponibilités
- Tableau de bord

### 7. Module Administration
- Gestion des utilisateurs
- Rapports et statistiques
- Paramètres système
- Notifications

## 📝 Licence

Ce projet est développé pour un centre de formation pour adultes.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📧 Contact

Pour toute question ou suggestion, n'hésitez pas à nous contacter.

---

**Développé avec ❤️ pour faciliter la gestion des centres de formation**
