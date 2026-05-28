#!/bin/bash

set -e

cd /var/www/html/midrix

echo "Pulling latest code..."
git pull origin main

echo "Installing PHP dependencies..."
COMPOSER_ALLOW_SUPERUSER=1 composer install --no-dev --optimize-autoloader --no-interaction

echo "Installing Node dependencies..."
npm ci

echo "Building frontend..."
npm run build

echo "Running migrations..."
php artisan migrate --force

echo "Optimizing Laravel..."
php artisan optimize

echo "Restarting services..."
sudo systemctl restart php8.4-fpm
sudo systemctl restart nginx

echo "Deployment completed successfully!"
