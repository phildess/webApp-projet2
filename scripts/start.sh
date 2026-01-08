#!/bin/bash

# Script de démarrage rapide pour Centre de Formation
# Usage: ./scripts/start.sh [dev|prod]

set -e

MODE=${1:-prod}

echo "🎓 Centre de Formation - Démarrage"
echo "=================================="
echo ""

# Vérifier que Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé"
    echo "📥 Installez Docker depuis: https://docs.docker.com/get-docker/"
    exit 1
fi

# Vérifier que Docker Compose est installé
if ! command -v docker compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé"
    exit 1
fi

echo "✅ Docker détecté"
echo ""

# Créer le fichier .env s'il n'existe pas
if [ ! -f .env ]; then
    echo "📝 Création du fichier .env..."
    cp .env.docker .env
    echo "✅ Fichier .env créé"
    echo ""
fi

if [ "$MODE" = "dev" ]; then
    echo "🚀 Démarrage en mode DÉVELOPPEMENT..."
    echo ""

    # Arrêter les conteneurs existants
    echo "🛑 Arrêt des conteneurs existants..."
    docker compose -f docker-compose.dev.yml down 2>/dev/null || true

    echo ""
    echo "🔨 Construction des images..."
    docker compose -f docker-compose.dev.yml build

    echo ""
    echo "🚀 Démarrage des services..."
    docker compose -f docker-compose.dev.yml up

elif [ "$MODE" = "prod" ]; then
    echo "🚀 Démarrage en mode PRODUCTION..."
    echo ""

    # Arrêter les conteneurs existants
    echo "🛑 Arrêt des conteneurs existants..."
    docker compose down 2>/dev/null || true

    echo ""
    echo "🔨 Construction des images (cela peut prendre quelques minutes)..."
    docker compose build --no-cache

    echo ""
    echo "🚀 Démarrage des services..."
    docker compose up -d

    echo ""
    echo "⏳ Attente du démarrage des services..."
    sleep 10

    echo ""
    echo "📊 État des services:"
    docker compose ps

    echo ""
    echo "📋 Logs du backend:"
    docker compose logs backend | tail -20

    echo ""
    echo "=================================="
    echo "✅ Application démarrée avec succès!"
    echo ""
    echo "🌐 Frontend: http://localhost"
    echo "🔌 Backend API: http://localhost:3000"
    echo "🔍 Health check: http://localhost:3000/health"
    echo "🗄️  PostgreSQL: localhost:5432"
    echo ""
    echo "👤 Comptes de test:"
    echo "   Admin: admin@centre-formation.com / password123"
    echo "   Formateur: jean.dupont@centre-formation.com / password123"
    echo "   Apprenant: pierre.bernard@example.com / password123"
    echo ""
    echo "📝 Commandes utiles:"
    echo "   docker compose logs -f          # Voir les logs en temps réel"
    echo "   docker compose logs -f backend  # Logs du backend uniquement"
    echo "   docker compose down             # Arrêter l'application"
    echo "   docker compose restart          # Redémarrer"
    echo "   docker compose ps               # État des conteneurs"
    echo ""
    echo "🐛 En cas de problème:"
    echo "   docker compose logs backend     # Voir les erreurs du backend"
    echo "   docker compose down -v          # Nettoyer et redémarrer"
    echo "   docker compose up -d --build    # Reconstruire"
    echo ""
else
    echo "❌ Mode invalide. Utilisez: ./scripts/start.sh [dev|prod]"
    exit 1
fi
