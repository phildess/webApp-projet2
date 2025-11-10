.PHONY: help build up down restart logs clean dev prod

# Variables
COMPOSE_FILE=docker-compose.yml
COMPOSE_FILE_DEV=docker-compose.dev.yml

help: ## Afficher cette aide
	@echo "Commandes disponibles:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

build: ## Construire les images Docker
	docker compose -f $(COMPOSE_FILE) build

up: ## Démarrer l'application en production
	docker compose -f $(COMPOSE_FILE) up -d
	@echo "\n✅ Application démarrée sur http://localhost"
	@echo "📊 Voir les logs: make logs"

down: ## Arrêter l'application
	docker compose -f $(COMPOSE_FILE) down

restart: ## Redémarrer l'application
	docker compose -f $(COMPOSE_FILE) restart

logs: ## Voir les logs en temps réel
	docker compose -f $(COMPOSE_FILE) logs -f

ps: ## Voir l'état des conteneurs
	docker compose -f $(COMPOSE_FILE) ps

clean: ## Arrêter et nettoyer (⚠️ supprime les volumes)
	docker compose -f $(COMPOSE_FILE) down -v
	docker compose -f $(COMPOSE_FILE_DEV) down -v

dev: ## Démarrer en mode développement
	docker compose -f $(COMPOSE_FILE_DEV) up
	@echo "\n✅ Application en mode dev sur http://localhost:5173"

dev-build: ## Construire et démarrer en mode développement
	docker compose -f $(COMPOSE_FILE_DEV) up --build

prod: ## Démarrer en production avec rebuild
	docker compose -f $(COMPOSE_FILE) up -d --build
	@echo "\n✅ Application démarrée sur http://localhost"

backend-shell: ## Accéder au shell du backend
	docker compose -f $(COMPOSE_FILE) exec backend sh

db-shell: ## Accéder au shell PostgreSQL
	docker compose -f $(COMPOSE_FILE) exec postgres psql -U centre_admin -d centre_formation

migrate: ## Exécuter les migrations
	docker compose -f $(COMPOSE_FILE) exec backend npx prisma migrate deploy

seed: ## Peupler la base de données
	docker compose -f $(COMPOSE_FILE) exec backend npx prisma db seed

studio: ## Ouvrir Prisma Studio
	docker compose -f $(COMPOSE_FILE) exec backend npx prisma studio
