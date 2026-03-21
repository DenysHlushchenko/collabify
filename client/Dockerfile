FROM node:25-alpine AS build
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

ARG VITE_API_URL
ARG VITE_SOCKET_URL
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_SOCKET_URL=${VITE_SOCKET_URL}

COPY . .
RUN npm run build

FROM nginx:stable-alpine

RUN apk update && apk upgrade --no-cache

COPY --from=build /usr/src/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

