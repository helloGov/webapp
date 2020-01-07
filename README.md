# HelloGOV

[HelloGOV](https://www.hellogov.app/) is a project of [Hack for LA](http://hackforla.org/), a Code for America brigade. This project seeks to make it easy to add a call-to-rep tool to social posts, including state senates and assemblies, and federal legislators. 

Our primary users are small grassroots organizations who run their own state legislature-level campaigns to advocate on issues most important to their work. Know an org that might be interested in testing? Get in touch with us on the Hack For LA Slack.

## Next Major Project Goals

This product is currently launched and in invite-only beta. We would love your help implementing end to end testing, working with our users, and implementing their feedback in new and revised features.

Weekly Monday meetups at the Santa Monica Hack for LA hack night will be the primary methods of updates sharing, idea discussions, technical troubleshootings, technical resource exchanges.

## Contributing to this Project

- Join [the Hack For LA Slack team](http://hackforla.org/slack) and find us in channel #hellogov.
- Check out the background info in Google Drive (pinned in the channel).
- Github Repository: https://github.com/hellogov/webapp On slack please message @kate with your GitHub username so she can add you to our team.
- Our list of issues to be worked on in Github is on our project's [Prioritized Backlog list](https://github.com/helloGov/webapp/projects).
- Post in an issue when you're starting work on something, so @kate-rose can keep track of it and so we don't duplicate work.
- We <3 new people and beginners.

## Setup

### Install dependencies

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

### Config

You only have to do this once.

- ask in the slack channel for the `secrets.js` file
- add the `secrets.js` file to the `conf/` directory
- ask in the slack channel for the `.env` file
- add the `.env` file to the project root directory
- generate assets with webpack
  ```
  $ npm run build
  ```

### Provision MongoDB
- [Install Docker](https://docs.docker.com/v17.12/install/)
- `docker-compose up -d mongo`
 - Command starts a mongodb container running in the background, available at localhost
 - Run `docker-compose stop` to stop mongo container (will continue if not explicitly stopped)


### Start app

- start the database service
  ```
  $ docker-compose up -d mongo
  ```
- start the application
  ```
  $ npm run start-dev
  ```

### Populate the seed data
```
$ npm run seed
```

After running the seed task you should be able to log in to the app with username `admin` and password `password`.

### View app
- `localhost:8080/login`

### Running the mongo shell
- run `docker ps` and copy the `CONTAINER ID` associated with the docker container running mongo
- run the shell in the docker container
  ```
  docker exec -it CONTAINER mongo
  ```
