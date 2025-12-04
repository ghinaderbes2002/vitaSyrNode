# VitaSyr VPS Installation Commands

Copy and paste these commands directly into your VPS terminal.

## Step 1: Update System

```bash
sudo apt update && sudo apt upgrade -y
```

## Step 2: Install PostgreSQL

```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
sudo systemctl status postgresql
```

## Step 3: Create Database and User

```bash
sudo -u postgres psql << 'EOF'
CREATE DATABASE vitasyr;
CREATE USER vitasyr_user WITH ENCRYPTED PASSWORD 'YourSecurePassword123!';
GRANT ALL PRIVILEGES ON DATABASE vitasyr TO vitasyr_user;
\c vitasyr
GRANT ALL ON SCHEMA public TO vitasyr_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO vitasyr_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO vitasyr_user;
\q
EOF
```

**Important:** Change `YourSecurePassword123!` to your own secure password!

## Step 4: Install Node.js 20.x

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version
npm --version
```

## Step 5: Install PM2

```bash
sudo npm install -g pm2
pm2 --version
```

## Step 6: Install Git and Clone Repository

```bash
sudo apt install -y git
sudo mkdir -p /var/www
cd /var/www
git clone YOUR_GITHUB_REPO_URL VitaSyr
cd VitaSyr
```

**Replace `YOUR_GITHUB_REPO_URL` with your actual repository URL**

## Step 7: Install Dependencies

```bash
npm install
npx prisma generate
```

## Step 8: Create .env File

```bash
nano .env
```

Paste this content (press Ctrl+Shift+V):

```
DATABASE_URL="postgresql://vitasyr_user:YourSecurePassword123!@localhost:5432/vitasyr?schema=public"
NODE_ENV=production
PORT=3000
JWT_SECRET=REPLACE_WITH_SECURE_RANDOM_STRING
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and replace `REPLACE_WITH_SECURE_RANDOM_STRING` with it.

Save and exit: Press `Ctrl+X`, then `Y`, then `Enter`

## Step 9: Run Database Migrations

```bash
npx prisma migrate deploy
```

## Step 10: Create Uploads Directory

```bash
mkdir -p uploads
chmod 755 uploads
```

## Step 11: Start Application with PM2

```bash
pm2 start index.js --name vitasyr
pm2 save
pm2 startup
```

**Important:** Copy and run the command that PM2 outputs after `pm2 startup`

## Step 12: Check Application Status

```bash
pm2 status
pm2 logs vitasyr
```

## Step 13: Configure Firewall

```bash
sudo apt install -y ufw
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp
sudo ufw enable
sudo ufw status
```

## Step 14: Install and Configure Nginx (Optional)

```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

Create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/vitasyr
```

Paste this content:

```
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

    location /uploads {
        alias /var/www/VitaSyr/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

Save and exit: `Ctrl+X`, `Y`, `Enter`

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/vitasyr /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 15: Install SSL Certificate (Optional)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

Follow the prompts and select redirect HTTP to HTTPS.

---

## Useful Commands

### Check Application Status
```bash
pm2 status
pm2 logs vitasyr
pm2 monit
```

### Restart Application
```bash
pm2 restart vitasyr
```

### Stop Application
```bash
pm2 stop vitasyr
```

### Update Application
```bash
cd /var/www/VitaSyr
git pull origin main
npm install
npx prisma migrate deploy
npx prisma generate
pm2 restart vitasyr
```

### Database Backup
```bash
pg_dump -U vitasyr_user -h localhost vitasyr > backup_$(date +%Y%m%d).sql
```

### Database Restore
```bash
psql -U vitasyr_user -h localhost vitasyr < backup_20231201.sql
```

### Check PostgreSQL Status
```bash
sudo systemctl status postgresql
```

### Check Nginx Status
```bash
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

### View System Resources
```bash
free -h
df -h
top
```

---

## Testing Your Setup

### Test Database Connection
```bash
psql -U vitasyr_user -d vitasyr -h localhost -W
```

### Test Application
```bash
curl http://localhost:3000
```

### Check if port is listening
```bash
sudo lsof -i :3000
sudo netstat -tulpn | grep 3000
```

---

## Troubleshooting

### If application won't start
```bash
cd /var/www/VitaSyr
pm2 logs vitasyr --lines 50
node index.js  # Test directly
```

### If database connection fails
```bash
sudo systemctl status postgresql
sudo tail -f /var/log/postgresql/postgresql-*-main.log
```

### Check .env file
```bash
cat /var/www/VitaSyr/.env
```

### Reset and restart everything
```bash
pm2 delete vitasyr
pm2 start index.js --name vitasyr
pm2 save
```

---

## Quick Copy-Paste Full Installation

Here's the complete installation in one block (manual database password entry):

```bash
# Update and install PostgreSQL
sudo apt update && sudo apt upgrade -y
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database (you'll enter the psql prompt)
sudo -u postgres psql
```

In psql, run:
```sql
CREATE DATABASE vitasyr;
CREATE USER vitasyr_user WITH ENCRYPTED PASSWORD 'YourSecurePassword123!';
GRANT ALL PRIVILEGES ON DATABASE vitasyr TO vitasyr_user;
\c vitasyr
GRANT ALL ON SCHEMA public TO vitasyr_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO vitasyr_user;
\q
```

Continue:
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git

# Install PM2
sudo npm install -g pm2

# Clone and setup
sudo mkdir -p /var/www
cd /var/www
git clone YOUR_REPO_URL VitaSyr
cd VitaSyr
npm install
npx prisma generate

# Create .env (open nano and paste content)
nano .env
```

In nano, paste:
```
DATABASE_URL="postgresql://vitasyr_user:YourSecurePassword123!@localhost:5432/vitasyr?schema=public"
NODE_ENV=production
PORT=3000
JWT_SECRET=YOUR_GENERATED_SECRET
```

Continue:
```bash
# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Update .env with the generated secret, then save (Ctrl+X, Y, Enter)

# Run migrations
npx prisma migrate deploy

# Create uploads directory
mkdir -p uploads
chmod 755 uploads

# Start app
pm2 start index.js --name vitasyr
pm2 save
pm2 startup  # Run the command it outputs

# Setup firewall
sudo apt install -y ufw
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp
sudo ufw enable

# Check status
pm2 status
pm2 logs vitasyr
```

Your application should now be running on http://YOUR_VPS_IP:3000
