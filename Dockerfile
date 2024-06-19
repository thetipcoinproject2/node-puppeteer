FROM ghcr.io/puppeteer/puppeteer:22.8.1

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /

COPY package*.json ./
RUN npm ci
COPY . .
CMD ["node", "App.js"]