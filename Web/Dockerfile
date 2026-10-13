# Etapa 1: gera o build de produção
FROM node:22-alpine AS build
WORKDIR /app

# Instala as dependências antes de copiar o código, para o Docker reaproveitar esta camada
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Etapa 2: o nginx serve o build e encaminha /api para o back-end
FROM nginx:1.28-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
