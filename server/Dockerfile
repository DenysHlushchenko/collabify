FROM node:25-alpine

WORKDIR /usr/src/app 

COPY . .

RUN npm install

EXPOSE 5000

CMD ["node", "dist/main.js"]

