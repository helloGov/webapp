const { User } = require('../models/user');
const {Strategy: LocalStrategy} = require('passport-local');

const localstrategy = new LocalStrategy((email, done) => {
    User.findOne({email: email})
    .then(foundUser => {
        if (!foundUser) {
            return Promise.reject(new Error({
                status: 400,
                message: 'no user found'
            }));
        }
        return done(null, foundUser);
    });
});

module.exports = (localstrategy);
