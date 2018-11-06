# helloGov

## Config
- ask wcrest for secrets.js file, and put into conf folder
- add a file named env.js in conf folder, with contents of `module.exports = 'dev';`

## Install dependencies
- `brew install node`
- `npm install`
- `sudo gem install sass`

## Start app
- `npm run start-dev`


## Create Signup Links to create Users (aka Influencers) the right way
**Make yourself an App Admin**
(There are currently only Admin and Influencer accounts)
- get mongo shell working: 'mongo'
- switch to the right db: 'use hellogv'
- give yourself admin rights by directly editing your record in the 'users' collection: 
```db.users.updateOne({ firstName: "[name to find]" }, { $set: {admin: true } })```
**Create Influencer**
- open `localhost:8080/admin`
- enter Influencer email (can't exist in db already)
- copy Signup link provided in UI
- open Incognito window (logged-in user will be redirected to '/' route)
- open `localhost:8080/singup/<specialCode>`
