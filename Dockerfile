FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

# Remover a configuração padrão do Nginx
RUN rm -rf /etc/nginx/conf.d/*

# Copiar a configuração personalizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar os arquivos de build para o diretório do Nginx
COPY --from=build /app/dist /usr/share/nginx/html/dist

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]