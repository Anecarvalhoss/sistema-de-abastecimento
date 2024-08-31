# Estágio 1: Compilação do TypeScript
FROM node:16 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# Estágio 2: Execução da aplicação
FROM node:16

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY package.json package-lock.json ./
RUN npm install --only=production

EXPOSE 3000

CMD ["node", "dist/server.js"]
