# --- Stage 1: Build React/Vite app ---
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install --no-audit --no-fund
COPY . .
RUN npm run build

# --- Stage 2: Serve built static files ---
FROM node:18-alpine

WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist

EXPOSE 80
CMD ["serve", "-s", "dist", "-l", "80"]
