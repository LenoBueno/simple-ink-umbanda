# Etapa de construção
FROM node:18-alpine as build

# Definir o diretório de trabalho
WORKDIR /app

# Copiar os arquivos de dependências
COPY package*.json ./
RUN npm install

# Garantir permissões de execução
RUN chmod -R 755 /app

# Instalar o Vite globalmente
RUN npm install -g vite

# Copiar o restante dos arquivos do projeto
COPY . .

# Rodar o comando de build do React
RUN npm run build

# Etapa de produção com Nginx
FROM nginx:alpine

# Remover a configuração padrão do Nginx
RUN rm -rf /etc/nginx/conf.d/*

# Copiar a configuração personalizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar os arquivos de build da etapa anterior para o diretório do Nginx
COPY --from=build /app/dist /usr/share/nginx/html/dist

# Expor a porta 80 para o Nginx
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
