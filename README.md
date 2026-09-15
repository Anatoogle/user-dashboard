# user-dashboard
user-dashboard

# Apply all pending Prisma database migrations
# Recreate database schema after deleting the Docker volume
npx prisma@7.10.0 migrate deploy

# start backend server
npm run dev

# start frontend server
npm run dev

# docker
docker compose --env-file .env.docker up -d      
docker compose --env-file .env.docker down 


## Architecture Note

This project uses Docker to run the frontend, backend, and PostgreSQL database in separate containers.

Nginx and HTTPS are intentionally not included in the current setup, as the project focuses on learning and development rather than production deployment.

For a production environment, Nginx could be added as a reverse proxy together with HTTPS.
