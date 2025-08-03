# Etapa 1: build
FROM node:22-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build 

# Etapa 2: nginx para servir app Angular
FROM nginx:alpine

# Copie os arquivos da build Angular para o local servido pelo Nginx
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Substitua a config padrão do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf


EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
