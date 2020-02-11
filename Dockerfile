FROM cypress/base:10

WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN npm install -g sass
RUN npm rebuild node-sass
RUN npm build

EXPOSE 8080
