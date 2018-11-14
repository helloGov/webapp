# helloGov

## Install dependencies

- install node
  ```
  $ brew install node
  ```
- install mongodb
  ```
  $ brew install mongodb
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

- ask in slack channel for `secrets.js` file
- add `conf/secrets.js` file
- add `.env`
  ```
  $ touch conf/secrets.js
  ```
- provision hellogov database and db users
  ```
  $ sh ./scripts/provision_mongo.sh
  ```
- generate assets with webpack
  ```
  $ npm run build
  ```

## Start app

- start the database service
  ```
  $ npm run restart-db
  ```
- start the application
  ```
  $ npm run start-dev
  ```