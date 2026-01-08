# Changelog

## [1.0.1] - 2026-01-08

### Fixed
- 🐛 Correction des erreurs de build Docker (npm ci -> npm install)
- 📦 Ajout du package-lock.json pour le monorepo
- 🔧 Amélioration de la compatibilité avec npm workspaces

### Changed
- Les Dockerfiles utilisent maintenant `npm install` au lieu de `npm ci`
- Structure monorepo avec un seul package-lock.json à la racine

## [1.0.0] - 2026-01-08

### Added
- 🎓 Application web complète pour centre de formation
- 🔐 Système d'authentification JWT avec 3 rôles
- 👥 Module Apprenants (inscriptions, profils, suivi)
- 📚 Module Formations (catalogue, sessions)
- 📅 Module Emplois du Temps (planification, salles)
- 📖 Module Programmes (modules, ressources pédagogiques)
- 📊 Module Évaluation (notes, compétences, bulletins)
- 👨‍🏫 Module Formateurs (profils, contrats, disponibilités)
- 🐳 Configuration Docker complète
- 📚 Documentation complète (README, DOCKER, QUICKSTART, GUIDE_INSTALLATION)
- 🛠️ Scripts de démarrage rapide
- 📦 Makefile avec commandes pratiques

### Technology Stack
- Backend: Node.js + Express + TypeScript + Prisma + PostgreSQL
- Frontend: React + TypeScript + Vite + Tailwind CSS
- Infrastructure: Docker + Docker Compose
