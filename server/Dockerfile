FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json tsconfig.json prisma ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000
CMD ["node", "dist/index.js"]