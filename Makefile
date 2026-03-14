# CMIS Docker Management Commands

.PHONY: help build up down restart logs clean dev prod

# Default target
help:
	@echo "CMIS Docker Management Commands:"
	@echo "  make dev     - Start development environment (database only)"
	@echo "  make prod    - Start production environment (full stack)"
	@echo "  make build   - Build all Docker images"
	@echo "  make up      - Start all services"
	@echo "  make down    - Stop all services"
	@echo "  make restart - Restart all services"
	@echo "  make logs    - Show logs for all services"
	@echo "  make clean   - Remove all containers, volumes, and images"
	@echo "  make db      - Access database shell"
	@echo "  make migrate - Run database migrations"

# Development environment (database only)
dev:
	docker-compose -f docker-compose.dev.yml up -d
	@echo "Development database started!"
	@echo "Database: localhost:5432"
	@echo "pgAdmin: http://localhost:5050"

# Production environment
prod:
	docker-compose up -d
	@echo "Production environment started!"
	@echo "Frontend: http://localhost"
	@echo "Backend: http://localhost:4000"
	@echo "pgAdmin: http://localhost:5050"

# Build all images
build:
	docker-compose build

# Start all services
up:
	docker-compose up -d

# Stop all services
down:
	docker-compose down

# Restart all services
restart:
	docker-compose restart

# Show logs
logs:
	docker-compose logs -f

# Clean everything
clean:
	docker-compose down -v --rmi all --remove-orphans
	docker system prune -f

# Database operations
db:
	docker-compose exec db psql -U cmis_user -d cmis

# Run migrations
migrate:
	docker-compose exec backend npx prisma migrate deploy
