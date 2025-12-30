FROM node:18-alpine

WORKDIR /app

# Install dependencies
RUN apk add --no-cache git python3 make g++ jq curl

# Copy package files
COPY package.json package-lock.json ./
RUN npm ci --production

# Copy Hardhat config and contracts
COPY hardhat.config.js ./
COPY contracts/ ./contracts/
COPY scripts/ ./scripts/

# Compile contracts
RUN npx hardhat compile

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "console.log('healthy')" || exit 1

ENTRYPOINT ["npx", "hardhat"]
