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

if [ "$MODE" = "dev" ]; then
    echo "🚀 Démarrage en mode DÉVELOPPEMENT..."
    echo ""
    docker compose -f docker-compose.dev.yml up --build
elif [ "$MODE" = "prod" ]; then
    echo "🚀 Démarrage en mode PRODUCTION..."
    echo ""
    docker compose up -d --build

    echo ""
    echo "⏳ Attente du démarrage des services..."
    sleep 5

    echo ""
    echo "📊 État des services:"
    docker compose ps

    echo ""
    echo "=================================="
    echo "✅ Application démarrée avec succès!"
    echo ""
    echo "🌐 Frontend: http://localhost"
    echo "🔌 Backend API: http://localhost:3000"
    echo "🗄️  PostgreSQL: localhost:5432"
    echo ""
    echo "👤 Comptes de test:"
    echo "   Admin: admin@centre-formation.com / password123"
    echo "   Formateur: jean.dupont@centre-formation.com / password123"
    echo "   Apprenant: pierre.bernard@example.com / password123"
    echo ""
    echo "📝 Commandes utiles:"
    echo "   docker compose logs -f          # Voir les logs"
    echo "   docker compose down             # Arrêter l'application"
    echo "   docker compose restart          # Redémarrer"
    echo ""
else
    echo "❌ Mode invalide. Utilisez: ./scripts/start.sh [dev|prod]"
    exit 1
fi
