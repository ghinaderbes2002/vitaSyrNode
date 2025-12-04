#!/bin/bash
set -e

echo "================================"
echo "VitaSyr Application Starting..."
echo "================================"

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h postgres -U ${POSTGRES_USER:-postgres} -d ${POSTGRES_DB:-vitasyr}; do
  echo "Waiting for database connection..."
  sleep 2
done

echo "PostgreSQL is ready!"

# Run Prisma migrations
echo "Running database migrations..."
npx prisma migrate deploy

echo "Migrations completed successfully!"

# Generate Prisma Client (in case it's needed)
echo "Generating Prisma Client..."
npx prisma generate

echo "Prisma Client generated!"

# Create uploads directory if it doesn't exist
mkdir -p /app/uploads
chmod 755 /app/uploads

echo "================================"
echo "Starting Node.js application..."
echo "================================"

# Execute the main command
exec "$@"
