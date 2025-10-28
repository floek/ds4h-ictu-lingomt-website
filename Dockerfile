# --- Build Stage ---
FROM node:20-alpine AS build

# Arbeitsverzeichnis setzen
WORKDIR /app

# Package-Dateien kopieren und Dependencies installieren
COPY package*.json ./
RUN npm install

# Rest des Projekts kopieren
COPY . .

# Vite-Projekt bauen
RUN npm run build

# --- Production Stage ---
FROM nginx:alpine

# Standard-nginx-Seite löschen
RUN rm -rf /usr/share/nginx/html/*

# Gebaute Dateien von Build-Stage kopieren
COPY --from=build /app/dist /usr/share/nginx/html

# Optional: eigene nginx.conf kopieren
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Port freigeben
EXPOSE 80

# Container starten
CMD ["nginx", "-g", "daemon off;"]
