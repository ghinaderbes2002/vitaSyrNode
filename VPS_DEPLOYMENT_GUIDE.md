# VitaSyr - VPS Deployment Guide

Complete guide for deploying VitaSyr on a VPS (Ubuntu/Debian) with PostgreSQL.

## Prerequisites

- VPS with Ubuntu 20.04+ or Debian 11+
- Root or sudo access
- SSH access to your VPS
- Domain name (optional, but recommended)

## Step 1: Connect to Your VPS

```bash
ssh root@your_vps_ip
# or
ssh your_username@your_vps_ip
```

## Step 2: Run Automated Setup Script

### Option A: Download and run the setup script

```bash
# If you have the script in your repository
wget https://your-repo-url/vps-setup.sh
chmod +x vps-setup.sh
./vps-setup.sh
```

### Option B: Manual Installation

Follow the commands below to install everything manually.

## Step 3: Manual PostgreSQL Installation

### Install PostgreSQL

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Check status
sudo systemctl status postgresql
```

### Create Database and User

```bash
# Switch to postgres user
sudo -u postgres psql

# Inside PostgreSQL prompt, run:
```

```sql
-- Create database
CREATE DATABASE vitasyr;

-- Create user (CHANGE THE PASSWORD!)
CREATE USER vitasyr_user WITH ENCRYPTED PASSWORD 'YourSecurePassword123!';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE vitasyr TO vitasyr_user;

-- Connect to database
\c vitasyr

-- Grant schema privileges (PostgreSQL 15+)
GRANT ALL ON SCHEMA public TO vitasyr_user;

-- Grant default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO vitasyr_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO vitasyr_user;

-- Exit
\q
```

### Verify PostgreSQL Installation

```bash
# Check PostgreSQL version
psql --version

# Test connection
psql -U vitasyr_user -d vitasyr -h localhost -W
# Enter password when prompted
# Type \q to exit
```

## Step 4: Install Node.js

```bash
# Install Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

## Step 5: Install PM2 (Process Manager)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Verify installation
pm2 --version
```

## Step 6: Clone and Setup Application

```bash
# Install Git if not already installed
sudo apt install -y git

# Create application directory
sudo mkdir -p /var/www
cd /var/www

# Clone your repository
git clone https://github.com/your-username/VitaSyr.git
cd VitaSyr

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate
```

## Step 7: Configure Environment Variables

```bash
# Create .env file
nano .env
```

Add the following content (update values):

```env
# Database Configuration
DATABASE_URL="postgresql://vitasyr_user:YourSecurePassword123!@localhost:5432/vitasyr?schema=public"

# Application Configuration
NODE_ENV=production
PORT=3000

# JWT Secret (Generate a secure random string)
JWT_SECRET=your-very-secure-jwt-secret-change-this
```

**Generate a secure JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 8: Run Database Migrations

```bash
# Run Prisma migrations
npx prisma migrate deploy

# Optional: Seed database if you have seed script
# npx prisma db seed
```

## Step 9: Create Uploads Directory

```bash
# Create uploads directory with proper permissions
mkdir -p uploads
chmod 755 uploads
```

## Step 10: Start Application with PM2

```bash
# Start application
pm2 start index.js --name vitasyr

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup systemd
# Follow the command output instructions

# Check application status
pm2 status

# View logs
pm2 logs vitasyr
```

## Step 11: Configure Firewall

```bash
# Install UFW if not installed
sudo apt install -y ufw

# Allow SSH (important!)
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow application port (if accessing directly)
sudo ufw allow 3000/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

## Step 12: Setup Nginx Reverse Proxy (Recommended)

### Install Nginx

```bash
# Install Nginx
sudo apt install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Configure Nginx

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/vitasyr
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Increase upload size limit
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

    location /uploads {
        alias /var/www/VitaSyr/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### Enable Site and Restart Nginx

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/vitasyr /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## Step 13: Setup SSL with Let's Encrypt (Optional but Recommended)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Follow the prompts and select redirect HTTP to HTTPS

# Test auto-renewal
sudo certbot renew --dry-run
```

## Useful PM2 Commands

```bash
# View application status
pm2 status

# View logs
pm2 logs vitasyr

# Restart application
pm2 restart vitasyr

# Stop application
pm2 stop vitasyr

# Delete application from PM2
pm2 delete vitasyr

# Monitor application
pm2 monit

# View detailed info
pm2 info vitasyr
```

## Database Management Commands

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Connect to vitasyr database
psql -U vitasyr_user -d vitasyr -h localhost

# Backup database
pg_dump -U vitasyr_user -h localhost vitasyr > backup_$(date +%Y%m%d).sql

# Restore database
psql -U vitasyr_user -h localhost vitasyr < backup_20231201.sql

# View running queries
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity;"
```

## Updating Your Application

```bash
# Navigate to application directory
cd /var/www/VitaSyr

# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Run new migrations
npx prisma migrate deploy

# Regenerate Prisma Client
npx prisma generate

# Restart application
pm2 restart vitasyr

# Check logs
pm2 logs vitasyr
```

## Troubleshooting

### Application won't start

```bash
# Check logs
pm2 logs vitasyr

# Check if port is in use
sudo lsof -i :3000

# Check application status
pm2 status
```

### Database connection issues

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-*-main.log

# Test database connection
psql -U vitasyr_user -d vitasyr -h localhost
```

### Nginx issues

```bash
# Check Nginx status
sudo systemctl status nginx

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Test configuration
sudo nginx -t
```

### Check disk space

```bash
# View disk usage
df -h

# Check large files
du -sh /var/www/VitaSyr/*
```

### View system resources

```bash
# Check memory usage
free -h

# Check CPU usage
top

# View running processes
ps aux | grep node
```

## Security Best Practices

1. **Use strong passwords** for database and JWT secret
2. **Keep system updated**: `sudo apt update && sudo apt upgrade`
3. **Use firewall**: Enable UFW and only open necessary ports
4. **Use SSL/HTTPS**: Install Let's Encrypt certificates
5. **Regular backups**: Automate database backups
6. **Monitor logs**: Regularly check PM2 and Nginx logs
7. **Limit file uploads**: Configure max upload size
8. **Use environment variables**: Never commit secrets to Git
9. **Regular updates**: Keep Node.js, PostgreSQL, and dependencies updated
10. **Setup monitoring**: Consider tools like Grafana or New Relic

## Monitoring and Logs

```bash
# PM2 logs (real-time)
pm2 logs vitasyr

# PM2 logs (last 100 lines)
pm2 logs vitasyr --lines 100

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-*-main.log

# System logs
sudo journalctl -u nginx
sudo journalctl -u postgresql
```

## Backup Strategy

```bash
# Create backup script
sudo nano /usr/local/bin/backup-vitasyr.sh
```

Add the following:

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/vitasyr"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup database
pg_dump -U vitasyr_user -h localhost vitasyr > $BACKUP_DIR/db_backup_$DATE.sql

# Backup uploads folder
tar -czf $BACKUP_DIR/uploads_backup_$DATE.tar.gz /var/www/VitaSyr/uploads

# Keep only last 7 days of backups
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: $DATE"
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/backup-vitasyr.sh

# Setup daily backup with cron
sudo crontab -e

# Add this line (runs daily at 2 AM)
0 2 * * * /usr/local/bin/backup-vitasyr.sh
```

## Performance Optimization

### PostgreSQL Tuning

```bash
# Edit PostgreSQL config
sudo nano /etc/postgresql/*/main/postgresql.conf
```

Adjust these settings based on your VPS resources:

```conf
shared_buffers = 256MB          # 25% of RAM
effective_cache_size = 1GB      # 50-75% of RAM
work_mem = 16MB
maintenance_work_mem = 128MB
max_connections = 100
```

Restart PostgreSQL:
```bash
sudo systemctl restart postgresql
```

## Support

For issues specific to:
- **PostgreSQL**: https://www.postgresql.org/docs/
- **Node.js**: https://nodejs.org/docs/
- **PM2**: https://pm2.keymetrics.io/docs/
- **Nginx**: https://nginx.org/en/docs/
- **Prisma**: https://www.prisma.io/docs/

## Connection Information Summary

After setup, your application will be accessible at:
- **Direct**: http://your-vps-ip:3000
- **With Nginx**: http://your-domain.com
- **With SSL**: https://your-domain.com

Database connection:
- **Host**: localhost
- **Port**: 5432
- **Database**: vitasyr
- **User**: vitasyr_user
- **Password**: (the one you set)
