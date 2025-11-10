#!/bin/bash

# Script d'arrêt pour Centre de Formation

set -e

echo "🛑 Arrêt de l'application Centre de Formation..."
echo ""

docker compose down

echo ""
echo "✅ Application arrêtée avec succès"
echo ""
echo "💡 Pour supprimer également les données (volumes):"
echo "   docker compose down -v"
