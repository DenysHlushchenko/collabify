FROM node:25

WORKDIR /usr/src/app 

COPY --chown=node:node . .

RUN npm install

EXPOSE 5000

USER node

CMD ["npm", "run", "start:dev"]

