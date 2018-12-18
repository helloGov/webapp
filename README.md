# helloGov

## Install dependencies

- install node and mongo
  ```
  $ brew install node mongo
  ```
- install packages
  ```
  $ npm install
  ```
- install sass
  ```
  $ sudo gem install sass
  ```

## Config

You only have to do this once.

- ask in the slack channel for the `secrets.js` file
- add the `secrets.js` file to the `conf/` directory
- ask in the slack channel for the `.env` file
- add the `.env` file to the project root directory
- generate assets with webpack
  ```
  $ npm run build
  ```

## Provision MongoDB
- [Install Docker](https://docs.docker.com/v17.12/install/)
- `docker-compose up -d mongo`
 - Command starts a mongodb container running in the background, available at localhost
 - Run `docker-compose stop` to stop mongo container (will continue if not explicitly stopped)


## Start app

- start the database service
  ```
  $ docker-compose up -d mongo
  ```
- start the application
  ```
  $ npm run start-dev
  ```

## Populate the seed data
```
$ npm run seed
```

After running the seed task you should be able to log in to the app with username `admin` and password `password`.

## View app
- `localhost:8080/login`

## Running the mongo shell
- run `docker ps` and copy the `CONTAINER ID` associated with the docker container running mongo
- run the shell in the docker container
  ```
  docker exec -it CONTAINER mongo
  ```
