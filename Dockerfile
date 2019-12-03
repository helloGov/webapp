FROM node:10.17-alpine3.9

RUN apk add curl

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN npm install -g sass

RUN npm rebuild node-sass

RUN npm build

EXPOSE 8080
