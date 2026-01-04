#!/bin/bash
# set-secrets.sh

# Ensure wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "Installing wrangler..."
    npm install -g wrangler
fi

# Load keys from local environment (if exists, or prompt user)
if [ -f "backend/.env.production" ]; then
    set -a
    source backend/.env.production
    set +a
fi

echo "🔐 Setting Cloudflare Secrets..."
echo "Note: You will be prompted if keys are missing from environment."

# Function to safely put secret
put_secret() {
    KEY=$1
    VALUE=$2
    if [ -z "$VALUE" ]; then
        echo "Enter value for $KEY:"
        read -s VALUE
    fi
    
    if [ -n "$VALUE" ]; then
        echo "Setting $KEY..."
        wrangler secret put $KEY --text "$VALUE"
    else
        echo "Skipping $KEY (no value provided)"
    fi
}

put_secret "GEMINI_API_KEY" "$GEMINI_API_KEY"
put_secret "GROQ_API_KEY" "$GROQ_API_KEY"
put_secret "OPENAI_API_KEY" "$OPENAI_API_KEY"

echo "✅ All secrets processed!"
