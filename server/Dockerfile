FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json tsconfig.json ./
RUN npm install
COPY . .
RUN npx prisma generate    # se ainda precisar do client gerado em build
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY --from=build /app/dist ./dist

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

CMD ["node", "dist/index.js"]