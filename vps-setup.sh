#!/bin/bash

# VitaSyr VPS Setup Script
# This script installs and configures PostgreSQL, Node.js, and necessary dependencies

set -e  # Exit on any error

echo "================================"
echo "VitaSyr VPS Setup Script"
echo "================================"

# Update system packages
echo "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install PostgreSQL
echo "Installing PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL
echo "Starting PostgreSQL service..."
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Check PostgreSQL status
echo "Checking PostgreSQL status..."
sudo systemctl status postgresql --no-pager

# Configure PostgreSQL
echo "Configuring PostgreSQL..."

# Create database and user
sudo -u postgres psql << EOF
-- Create database
CREATE DATABASE vitasyr;

-- Create user with password (CHANGE THIS PASSWORD!)
CREATE USER vitasyr_user WITH ENCRYPTED PASSWORD 'your_secure_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE vitasyr TO vitasyr_user;

-- Connect to vitasyr database
\c vitasyr

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO vitasyr_user;

-- Exit
\q
EOF

echo "PostgreSQL database 'vitasyr' created successfully!"

# Install Node.js (using NodeSource repository)
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installations
echo "Verifying installations..."
node --version
npm --version
psql --version

# Install PM2 globally (for process management)
echo "Installing PM2..."
sudo npm install -g pm2

# Install Git (if not already installed)
echo "Installing Git..."
sudo apt install -y git

# Configure PostgreSQL to allow password authentication
echo "Configuring PostgreSQL authentication..."
sudo sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" /etc/postgresql/*/main/postgresql.conf

# Allow connections from localhost
echo "host    vitasyr    vitasyr_user    127.0.0.1/32    md5" | sudo tee -a /etc/postgresql/*/main/pg_hba.conf

# Restart PostgreSQL to apply changes
echo "Restarting PostgreSQL..."
sudo systemctl restart postgresql

echo "================================"
echo "Installation Complete!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Change the database password in the script above"
echo "2. Clone your application repository"
echo "3. Create .env file with database credentials"
echo "4. Run: npm install"
echo "5. Run: npx prisma migrate deploy"
echo "6. Run: pm2 start index.js --name vitasyr"
echo ""
echo "Database Connection String:"
echo "DATABASE_URL=\"postgresql://vitasyr_user:your_secure_password_here@localhost:5432/vitasyr?schema=public\""
echo ""
