up:
	docker compose --env-file .env.docker up -d

build:
	docker compose --env-file .env.docker up -d --build

down:
	docker compose --env-file .env.docker down

restart:
	docker compose --env-file .env.docker down
	docker compose --env-file .env.docker up -d

logs:
	docker compose --env-file .env.docker logs -f

ps:
	docker compose --env-file .env.docker ps

migrate:
	npx prisma@7.10.0 migrate deploy

clean:
	docker compose --env-file .env.docker down

frontend:
	docker compose --env-file .env.docker up -d --no-deps frontend

backend:
	docker compose --env-file .env.docker up -d --no-deps backend

postgres:
	docker compose --env-file .env.docker up -d --no-deps postgres

dev-frontend:
	cd frontend && npm run dev

dev-backend:
	cd backend && npm run dev	

.PHONY: up build down restart logs ps migrate clean clean-images dev-frontend dev-backend frontend backend postgres