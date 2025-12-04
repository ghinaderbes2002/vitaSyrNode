#!/bin/bash
set -e

echo "Initializing VitaSyr database..."

# This script runs automatically when PostgreSQL container starts for the first time
# The database and user are already created by Docker, but we can add additional setup here

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Ensure UTF8 encoding
    UPDATE pg_database SET datistemplate = FALSE WHERE datname = '$POSTGRES_DB';

    -- Grant all privileges
    GRANT ALL PRIVILEGES ON DATABASE $POSTGRES_DB TO $POSTGRES_USER;

    -- Connect to the database and set up schema permissions
    \c $POSTGRES_DB

    -- Grant schema privileges
    GRANT ALL ON SCHEMA public TO $POSTGRES_USER;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $POSTGRES_USER;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $POSTGRES_USER;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO $POSTGRES_USER;

    -- Create extensions if needed
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
EOSQL

echo "Database initialization completed!"
