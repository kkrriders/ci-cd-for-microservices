# syntax=docker/dockerfile:1

FROM node:20-alpine

ENV NODE_ENV=production
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --only=production

COPY . .

USER node

EXPOSE 8082

CMD ["npm", "start"]
