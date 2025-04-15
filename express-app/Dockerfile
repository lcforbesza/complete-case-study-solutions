FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4567

ENV NODE_ENV=production

CMD ["node", "express.js"]