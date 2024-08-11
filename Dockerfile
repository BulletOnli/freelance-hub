FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma ./prisma/

COPY . .

RUN npx prisma generate

# RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "dev" ]