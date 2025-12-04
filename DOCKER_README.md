# VitaSyr - Docker Setup Guide

This guide explains how to run the VitaSyr application using Docker and Docker Compose.

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)

## Quick Start

1. **Clone the repository and navigate to the project directory**

2. **Create environment file**
   ```bash
   cp .env.example .env
   ```

3. **Update the `.env` file with your configuration**
   - Change `JWT_SECRET` to a secure random string
   - Modify database credentials if needed

4. **Start the application**
   ```bash
   docker-compose up -d
   ```

   This will:
   - Pull the required Docker images
   - Create a PostgreSQL database container
   - Build and start the Node.js application
   - Run Prisma migrations automatically

5. **Check the logs**
   ```bash
   docker-compose logs -f app
   ```

6. **Access the application**
   - Application: http://localhost:3000
   - Database: localhost:5432

## Docker Commands

### Start the services
```bash
docker-compose up -d
```

### Stop the services
```bash
docker-compose down
```

### Stop and remove volumes (this will delete all data)
```bash
docker-compose down -v
```

### View logs
```bash
# All services
docker-compose logs -f

# Application only
docker-compose logs -f app

# Database only
docker-compose logs -f postgres
```

### Rebuild the application
```bash
docker-compose up -d --build app
```

### Access the application container shell
```bash
docker-compose exec app sh
```

### Access the database
```bash
docker-compose exec postgres psql -U postgres -d vitasyr
```

## Database Management

### Run Prisma migrations
```bash
docker-compose exec app npx prisma migrate deploy
```

### Generate Prisma Client
```bash
docker-compose exec app npx prisma generate
```

### Access Prisma Studio (Database GUI)
```bash
docker-compose exec app npx prisma studio
```
Then open http://localhost:5555 in your browser

### Create a new migration
```bash
docker-compose exec app npx prisma migrate dev --name migration_name
```

## Development Workflow

The docker-compose setup includes volume mounting, so code changes will be reflected immediately with nodemon.

1. Make code changes on your local machine
2. The changes will be automatically synced to the container
3. Nodemon will restart the application automatically

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| POSTGRES_USER | PostgreSQL username | postgres |
| POSTGRES_PASSWORD | PostgreSQL password | postgres |
| POSTGRES_DB | Database name | vitasyr |
| POSTGRES_PORT | Database port | 5432 |
| APP_PORT | Application port | 3000 |
| NODE_ENV | Environment | development |
| JWT_SECRET | JWT secret key | (required) |
| DATABASE_URL | Full database connection string | (auto-generated) |

## Troubleshooting

### Port already in use
If port 3000 or 5432 is already in use, change the ports in `.env`:
```
APP_PORT=3001
POSTGRES_PORT=5433
```

### Database connection issues
1. Check if the database container is healthy:
   ```bash
   docker-compose ps
   ```

2. Verify the DATABASE_URL in your .env file

3. Restart the services:
   ```bash
   docker-compose restart
   ```

### Prisma migration errors
If you encounter migration errors, you can reset the database:
```bash
docker-compose down -v
docker-compose up -d
```

### Container won't start
Check the logs for errors:
```bash
docker-compose logs app
```

## Production Deployment

For production deployment:

1. Update `.env` with production values:
   - Set `NODE_ENV=production`
   - Use strong passwords
   - Use a secure `JWT_SECRET`

2. Modify the Dockerfile to use production settings:
   ```dockerfile
   CMD ["node", "index.js"]
   ```

3. Remove volume mounting from docker-compose.yml in production

4. Consider using Docker secrets for sensitive data

## File Structure

```
.
├── Dockerfile              # Application container definition
├── docker-compose.yml      # Multi-container orchestration
├── .dockerignore          # Files to exclude from Docker build
├── .env.example           # Environment variables template
└── DOCKER_README.md       # This file
```

## Support

For issues or questions related to Docker setup, please check:
- Docker documentation: https://docs.docker.com/
- Docker Compose documentation: https://docs.docker.com/compose/
- Prisma documentation: https://www.prisma.io/docs/
