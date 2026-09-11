# user-dashboard
user-dashboard

# Apply all pending Prisma database migrations
# Recreate database schema after deleting the Docker volume
npx prisma@7.10.0 migrate deploy

# start backend server
npm exec tsx src/index.ts

# start frontend server
npm run dev

