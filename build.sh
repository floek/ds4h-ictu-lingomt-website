#!/usr/bin/env bash
set -e

# Name des Images und Containers
IMAGE_NAME="node-vite-build"
CONTAINER_NAME="node-vite-temp"

# 1. Docker-Image bauen
echo "📦 Baue Docker-Image..."
docker build -t $IMAGE_NAME -f - . <<'EOF'
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build
EOF

# 2. Temporären Container starten
echo "🚀 Starte temporären Container..."
docker create --name $CONTAINER_NAME $IMAGE_NAME

# 3. Build-Ergebnis in lokales dist/-Verzeichnis kopieren
echo "📂 Kopiere Build nach ./dist..."
rm -rf dist
docker cp $CONTAINER_NAME:/app/dist ./dist

# 4. Container entfernen
echo "🧹 Bereinige temporäre Ressourcen..."
docker rm $CONTAINER_NAME >/dev/null

echo "✅ Build abgeschlossen! Dateien befinden sich in ./dist"

