#!/bin/bash

# Database Backup Script for MonCVPro
# This script creates a PostgreSQL backup and uploads it to S3

set -e

# Configuration
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR=${BACKUP_DIR:-/backups/postgres}
BACKUP_FILE=$BACKUP_DIR/moncvpro_$TIMESTAMP.sql.gz
S3_BUCKET=${S3_BUCKET:-moncvpro-backups}
RETENTION_DAYS=${RETENTION_DAYS:-30}

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔄 Starting database backup...${NC}"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ ERROR: DATABASE_URL environment variable is not set${NC}"
    exit 1
fi

# Create backup
echo -e "${YELLOW}📦 Creating backup: $BACKUP_FILE${NC}"
pg_dump $DATABASE_URL | gzip > $BACKUP_FILE

# Check if backup was successful
if [ $? -eq 0 ]; then
    BACKUP_SIZE=$(du -h $BACKUP_FILE | cut -f1)
    echo -e "${GREEN}✅ Backup created successfully (Size: $BACKUP_SIZE)${NC}"
else
    echo -e "${RED}❌ Backup failed${NC}"
    exit 1
fi

# Upload to S3 if AWS credentials are available
if [ -n "$AWS_ACCESS_KEY_ID" ] && [ -n "$AWS_SECRET_ACCESS_KEY" ]; then
    echo -e "${YELLOW}☁️  Uploading to S3: s3://$S3_BUCKET/postgres/${NC}"
    aws s3 cp $BACKUP_FILE s3://$S3_BUCKET/postgres/
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Uploaded to S3 successfully${NC}"
    else
        echo -e "${RED}❌ S3 upload failed${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  AWS credentials not found. Skipping S3 upload.${NC}"
fi

# Clean up old backups (keep only last N days)
echo -e "${YELLOW}🧹 Cleaning up old backups (keeping last $RETENTION_DAYS days)...${NC}"
find $BACKUP_DIR -name "moncvpro_*.sql.gz" -mtime +$RETENTION_DAYS -delete

# Count remaining backups
BACKUP_COUNT=$(find $BACKUP_DIR -name "moncvpro_*.sql.gz" | wc -l)
echo -e "${GREEN}✅ Backup completed. Total backups: $BACKUP_COUNT${NC}"

echo -e "${GREEN}🎉 Database backup process completed successfully!${NC}"
