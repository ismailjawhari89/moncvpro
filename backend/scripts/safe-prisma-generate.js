#!/usr/bin/env node

/**
 * Safe Prisma Generate Script
 * Only runs prisma generate if @prisma/client is installed
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check if @prisma/client is installed
const clientPath = path.join(__dirname, '..', 'node_modules', '@prisma', 'client');

if (fs.existsSync(clientPath)) {
  console.log('✅ @prisma/client found, running prisma generate...');
  try {
    execSync('prisma generate', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    console.log('✅ Prisma client generated successfully');
  } catch (error) {
    console.error('❌ Failed to generate Prisma client:', error.message);
    process.exit(1);
  }
} else {
  console.log('⏭️  @prisma/client not found, skipping prisma generate (will run during build)');
}
