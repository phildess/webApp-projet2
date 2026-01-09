# Guide d'Utilisation - Centre de Formation pour Adultes

## 🎯 Vue d'ensemble

Application web complète de gestion pour un centre de formation pour adultes, comprenant 7 modules fonctionnels avec authentification et gestion des rôles.

## 🚀 Démarrage rapide

### Démarrer l'application avec Docker

```bash
# Démarrer tous les services
docker compose up -d

# Ou utiliser le Makefile
make start
```

L'application sera accessible sur :
- **Frontend** : http://localhost (port 80)
- **Backend API** : http://localhost:3000
- **Base de données** : localhost:5432

### Arrêter l'application

```bash
docker compose down

# Ou
make stop
```

## 👥 Comptes de test

L'application est pré-configurée avec des comptes de test :

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| **Administrateur** | admin@centre-formation.com | password123 |
| **Formateur** | jean.dupont@centre-formation.com | password123 |
| **Apprenant** | pierre.bernard@example.com | password123 |

## 📚 Modules disponibles

### 1. **Tableau de bord** (`/dashboard`)
- Statistiques en temps réel (formations, apprenants, formateurs, sessions)
- Affichage adapté selon le rôle de l'utilisateur
- Actions rapides vers les modules principaux
- **Accessible par** : Tous les utilisateurs

### 2. **Formations** (`/formations`)
- Catalogue complet des formations
- Recherche et filtrage par niveau (Débutant, Intermédiaire, Avancé, Expert)
- Affichage des détails : durée, nombre de sessions, coût
- Cartes visuelles avec images
- **Accessible par** : Tous les utilisateurs

### 3. **Apprenants** (`/apprenants`)
- Liste complète avec recherche
- Statistiques par statut (Actif, Diplômé, Inactif)
- Informations de contact (email, téléphone)
- Filtres et tri
- **Accessible par** : Admin, Formateurs

### 4. **Formateurs** (`/formateurs`)
- Gestion de l'équipe pédagogique
- Affichage des domaines d'expertise
- Types de contrat (CDI, CDD, Prestataire)
- Statistiques par type de contrat
- **Accessible par** : Admin uniquement

### 5. **Emploi du temps** (`/emploi-du-temps`)
- Calendrier interactif
- Sélection de date avec bouton "Aujourd'hui"
- Affichage des cours avec :
  - Horaires (début/fin)
  - Salle
  - Formateur
  - Formation concernée
- **Accessible par** : Tous les utilisateurs

### 6. **Évaluations** (`/evaluations`)
- Gestion des évaluations
- Saisie des notes
- Statistiques des évaluations
- Historique des activités
- **Accessible par** : Admin, Formateurs, Apprenants

### 7. **Administration** (`/admin`)
- Configuration système
- Gestion des utilisateurs
- Paramètres de sécurité
- Sauvegardes de base de données
- Notifications et rapports
- **Accessible par** : Admin uniquement

## 🔐 Système d'authentification

### Connexion
1. Accédez à http://localhost
2. Entrez vos identifiants
3. Vous êtes automatiquement redirigé vers le tableau de bord

### Rôles et permissions

**ADMIN** - Accès complet à tous les modules
- Gestion des formations
- Gestion des apprenants
- Gestion des formateurs
- Emploi du temps
- Évaluations
- Administration système

**FORMATEUR** - Accès limité aux outils pédagogiques
- Consultation des formations
- Gestion des apprenants
- Emploi du temps
- Évaluations (création et notation)

**APPRENANT** - Accès consultation
- Catalogue des formations
- Emploi du temps personnel
- Consultation des évaluations et notes

### Déconnexion
Cliquez sur l'icône de déconnexion en haut à droite de l'interface.

## 🗄️ Base de données

### Structure
L'application utilise PostgreSQL avec Prisma ORM. Les tables principales :

- **Users** : Comptes utilisateurs
- **Apprenants** : Profils des apprenants
- **Formateurs** : Profils des formateurs
- **Formations** : Catalogue de formations
- **SessionFormation** : Sessions planifiées
- **Inscriptions** : Inscriptions des apprenants aux sessions
- **ModuleFormation** : Modules de cours
- **EmploiDuTemps** : Planning des cours
- **Evaluations** : Évaluations et examens
- **Notes** : Notes des apprenants
- **Competences** : Compétences et certifications
- **Salles** : Salles de cours
- **Documents** : Documents attachés

### Initialisation automatique

Au premier démarrage, la base de données est automatiquement :
1. Créée avec le schéma complet
2. Peuplée avec des données de test

### Réinitialiser la base de données

```bash
# Arrêter les conteneurs
docker compose down

# Supprimer les volumes (efface toutes les données)
docker volume rm webApp-projet2_postgres_data

# Redémarrer
docker compose up -d
```

## 🛠️ Architecture technique

### Stack technologique

**Backend**
- Node.js 18
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL 14
- JWT pour l'authentification
- Bcrypt pour le hachage des mots de passe

**Frontend**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios pour les appels API
- React Hot Toast pour les notifications

**Infrastructure**
- Docker & Docker Compose
- Nginx (reverse proxy frontend)
- Multi-stage builds optimisés

### API REST

L'API backend expose les endpoints suivants :

```
POST   /api/auth/login              - Connexion
POST   /api/auth/register           - Inscription
GET    /api/auth/profile            - Profil utilisateur

GET    /api/formations              - Liste des formations
GET    /api/formations/:id          - Détails d'une formation
POST   /api/formations              - Créer une formation (Admin)

GET    /api/apprenants              - Liste des apprenants
GET    /api/apprenants/:id          - Détails d'un apprenant
PUT    /api/apprenants/:id          - Modifier un apprenant

GET    /api/formateurs              - Liste des formateurs
GET    /api/formateurs/:id          - Détails d'un formateur
GET    /api/formateurs/:id/emploi-du-temps - Planning d'un formateur

GET    /api/emploi-du-temps         - Planning global
POST   /api/emploi-du-temps         - Créer un créneau (Admin)

GET    /api/evaluations/sessions/:id - Évaluations d'une session
POST   /api/evaluations/notes       - Saisir une note
```

### Variables d'environnement

Fichier `.env` à la racine :

```env
# Base de données
POSTGRES_USER=centre_admin
POSTGRES_PASSWORD=centre_password_2025
POSTGRES_DB=centre_formation
POSTGRES_PORT=5432

# Backend
BACKEND_PORT=3000
JWT_SECRET=centre-formation-super-secret-key-docker-2025
JWT_EXPIRES_IN=7d

# Frontend
FRONTEND_PORT=80
FRONTEND_URL=http://localhost
```

## 📊 Fonctionnalités avancées

### Recherche et filtrage
- Tous les modules supportent la recherche en temps réel
- Filtres multiples (statut, niveau, type, etc.)
- Tri personnalisable

### Responsive Design
- Interface adaptée mobile, tablette et desktop
- Navigation sidebar collapsible
- Optimisation tactile

### Notifications
- Toasts de succès/erreur pour toutes les actions
- Messages informatifs contextuels
- Durée configurable

### Gestion des erreurs
- Gestion centralisée des erreurs API
- Messages d'erreur explicites
- Retry automatique sur échec réseau

## 🔧 Développement

### Installer les dépendances

```bash
# À la racine (monorepo)
npm install

# Ou séparément
cd backend && npm install
cd frontend && npm install
```

### Mode développement

```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

### Build production

```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

### Tests

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 📝 Logs et debugging

### Voir les logs

```bash
# Tous les services
docker compose logs -f

# Un service spécifique
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres
```

### Accéder à un conteneur

```bash
# Backend
docker compose exec backend sh

# Frontend
docker compose exec frontend sh

# Base de données
docker compose exec postgres psql -U centre_admin -d centre_formation
```

## 🚨 Dépannage

### L'application ne démarre pas
```bash
# Vérifier les logs
docker compose logs

# Recréer les conteneurs
docker compose down
docker compose up -d --build
```

### Erreurs de connexion à la base de données
```bash
# Vérifier que PostgreSQL est démarré
docker compose ps

# Vérifier les logs PostgreSQL
docker compose logs postgres
```

### Problèmes de permissions
```bash
# Réinitialiser les volumes
docker compose down -v
docker compose up -d
```

### Port déjà utilisé
Modifiez les ports dans `docker-compose.yml` si les ports 80, 3000 ou 5432 sont déjà occupés.

## 📚 Ressources supplémentaires

- **DOCKER.md** : Guide complet Docker
- **TROUBLESHOOTING.md** : Solutions aux problèmes courants
- **QUICKSTART.md** : Démarrage rapide en 2 minutes
- **CHANGELOG.md** : Historique des versions

## 🎓 Formation et support

Pour toute question ou problème :
1. Consultez les fichiers de documentation
2. Vérifiez les logs avec `docker compose logs`
3. Consultez le README.md pour plus de détails

## ✅ État de l'application

### ✅ Complété et fonctionnel

- [x] Authentification JWT avec 3 rôles
- [x] 7 modules complets et interconnectés
- [x] Dashboard dynamique avec statistiques réelles
- [x] Gestion des formations avec catalogue
- [x] Gestion des apprenants
- [x] Gestion des formateurs
- [x] Emploi du temps interactif
- [x] Système d'évaluations
- [x] Panel d'administration
- [x] Base de données PostgreSQL avec seed
- [x] API REST complète
- [x] Interface responsive
- [x] Docker et docker-compose
- [x] Documentation complète

### 🔄 En cours / À améliorer

- [ ] Formulaires de création/édition complets
- [ ] Upload de fichiers (photos, documents)
- [ ] Système de notifications en temps réel
- [ ] Export PDF des rapports
- [ ] Statistiques avancées et graphiques
- [ ] Système de messagerie interne
- [ ] Tests automatisés

---

**Version** : 1.0.0
**Date** : Janvier 2026
**Statut** : Production Ready ✅
