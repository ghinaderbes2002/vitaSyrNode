# VitaSyr - Quick VPS Deployment Guide

Everything is automated inside Docker! Just follow these simple steps.

## Prerequisites on VPS

- Ubuntu 20.04+ or Debian 11+
- Root or sudo access

## Step 1: Install Docker & Docker Compose on VPS

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Set up the Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker

# Verify installation
sudo docker --version
sudo docker compose version
```

## Step 2: Install Git

```bash
sudo apt install -y git
```

## Step 3: Clone Repository

```bash
# Create directory
sudo mkdir -p /var/www
cd /var/www

# Clone your repository
sudo git clone YOUR_GITHUB_REPO_URL VitaSyr
cd VitaSyr
```

## Step 4: Configure Environment Variables

```bash
# Copy environment template
cp .env.example .env

# Edit environment file
nano .env
```

Update these values:

```env
POSTGRES_PASSWORD=YourSecurePassword123!
JWT_SECRET=your-generated-secret-key-here
NODE_ENV=production
```

**Generate JWT Secret:**
```bash
# If you have Node.js installed:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use openssl:
openssl rand -hex 32
```

Save and exit: `Ctrl+X`, `Y`, `Enter`

## Step 5: Start Everything with Docker Compose

```bash
# Build and start all services (PostgreSQL + Application)
sudo docker compose up -d --build
```

That's it! Docker will automatically:
- ✅ Start PostgreSQL database
- ✅ Wait for database to be ready
- ✅ Run Prisma migrations
- ✅ Generate Prisma Client
- ✅ Create uploads directory
- ✅ Start the Node.js application

## Step 6: Check Status

```bash
# View running containers
sudo docker compose ps

# View application logs
sudo docker compose logs -f app

# View database logs
sudo docker compose logs -f postgres
```

## Step 7: Configure Firewall

```bash
# Install firewall
sudo apt install -y ufw

# Allow SSH (IMPORTANT!)
sudo ufw allow 22/tcp

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow application port
sudo ufw allow 3000/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

## Access Your Application

Your application is now running at:
- **http://YOUR_VPS_IP:3000**

---

## Useful Docker Commands

### View logs
```bash
sudo docker compose logs -f app
sudo docker compose logs -f postgres
```

### Restart services
```bash
sudo docker compose restart
```

### Stop services
```bash
sudo docker compose down
```

### Stop and remove all data
```bash
sudo docker compose down -v
```

### Rebuild application
```bash
sudo docker compose up -d --build app
```

### Execute commands inside container
```bash
# Access application container shell
sudo docker compose exec app sh

# Run Prisma commands
sudo docker compose exec app npx prisma studio
sudo docker compose exec app npx prisma migrate deploy
```

### View container resource usage
```bash
sudo docker stats
```

---

## Update Application

```bash
cd /var/www/VitaSyr

# Pull latest changes
sudo git pull origin main

# Rebuild and restart
sudo docker compose up -d --build

# Check logs
sudo docker compose logs -f app
```

---

## Setup Nginx Reverse Proxy (Optional but Recommended)

### Install Nginx on VPS (not in Docker)

```bash
sudo apt install -y nginx
```

### Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/vitasyr
```

Paste this:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Save: `Ctrl+X`, `Y`, `Enter`

### Enable site

```bash
sudo ln -s /etc/nginx/sites-available/vitasyr /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Install SSL Certificate

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

Now access via: **https://your-domain.com**

---

## Backup Database

```bash
# Backup
sudo docker compose exec postgres pg_dump -U postgres vitasyr > backup_$(date +%Y%m%d).sql

# Restore
cat backup_20231201.sql | sudo docker compose exec -T postgres psql -U postgres vitasyr
```

---

## Troubleshooting

### Container won't start
```bash
sudo docker compose logs app
sudo docker compose logs postgres
```

### Check if containers are running
```bash
sudo docker compose ps
```

### Restart everything
```bash
sudo docker compose down
sudo docker compose up -d
```

### Clear everything and start fresh
```bash
sudo docker compose down -v
sudo docker compose up -d --build
```

### Check disk space
```bash
df -h
sudo docker system df
```

### Clean up Docker
```bash
# Remove unused containers, images, and volumes
sudo docker system prune -a --volumes
```

---

## Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| POSTGRES_USER | Database user | postgres |
| POSTGRES_PASSWORD | Database password | (required) |
| POSTGRES_DB | Database name | vitasyr |
| POSTGRES_PORT | Database port (external) | 5432 |
| APP_PORT | Application port (external) | 3000 |
| NODE_ENV | Environment mode | production |
| JWT_SECRET | JWT signing key | (required) |

---

## Complete One-Command Setup (Copy-Paste)

```bash
# Install Docker
sudo apt update && sudo apt upgrade -y && \
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common git && \
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg && \
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null && \
sudo apt update && \
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin && \
sudo systemctl start docker && \
sudo systemctl enable docker

# Clone and setup
sudo mkdir -p /var/www && \
cd /var/www && \
sudo git clone YOUR_REPO_URL VitaSyr && \
cd VitaSyr && \
cp .env.example .env

# Now edit .env file with nano
nano .env

# After saving .env, start everything:
sudo docker compose up -d --build

# View logs
sudo docker compose logs -f
```

---

## Support

For Docker-related issues:
- **Docker Docs**: https://docs.docker.com/
- **Docker Compose**: https://docs.docker.com/compose/
- **Prisma**: https://www.prisma.io/docs/

Your application is fully containerized and production-ready! 🚀
