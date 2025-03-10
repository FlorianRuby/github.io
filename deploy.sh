#!/bin/bash

# Pull latest changes
git pull

# Install dependencies
npm install --production

# Restart PM2 process
pm2 restart ecosystem.config.js 