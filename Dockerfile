FROM node:10.15.0-alpine
RUN apk update && apk add --no-cache bash curl
WORKDIR /usr/src/app
RUN npm install --global yarn