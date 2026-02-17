FROM node:25-alpine

WORKDIR /usr/src/app 

COPY . .

RUN npm install

RUN npm run build

EXPOSE 5000

CMD ["node", "dist/main.js"]

