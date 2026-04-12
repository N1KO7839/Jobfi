FROM node:22-alpine

WORKDIR /frontend

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

# RUN npm run build

CMD [ "npm", "start" ]