FROM node:25-alpine

WORKDIR /usr/src/app 

COPY . .

RUN npm install

RUN npm run build

EXPOSE 5000

CMD ["sh", "-c", "npx typeorm migration:run && node dist/main.js"]

