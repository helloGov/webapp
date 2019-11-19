const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../../models/user');
const Signup = require('../../models/signup');

// Users list
router.route('/users')

.post(function(request, response) {
    var findStr = { email: request.body.email, signupLink: request.body.signupLink };
    Signup.findOne(findStr).exec()
    .then(function(signup) {
        if (signup) {
            User.register(
                new User({
                    firstName: request.body.firstName,
                    lastName: request.body.lastName,
                    username: request.body.username,
                    email: request.body.email,
                    organizationName: request.body.organizationName
                }),
                request.body.password,
                function(err, account) {
                    if (err) {
                        console.log('error! could not create new user: ' + err);
                        response.status(403).send({
                            error: {
                                statusCode: 403,
                                status: 'Unauthorized',
                                message: 'There was an error creating account.'
                            }
                        });
                    } else {
                        Signup.remove(findStr, function() {
                            passport.authenticate('local')(request, response, function() {
                                response.status(200).end();
                            }, function() {
                                response.status(403).send({
                                    error: {
                                        statusCode: 403,
                                        status: 'Unauthorized',
                                        message: 'There was an error logging in.'
                                    }
                                });
                            });
                        });
                    }
                }
            );
        } else {
            console.log('User not found in signup database! User: ' + request.body.email + ' link: ' + request.body.signupLink);
            response.status(403).send({
                error: {
                    statusCode: 403,
                    status: 'Unauthorized',
                    message: 'User not found in signup database.'
                }
            });
        }
    })
    .catch(function(reason) {
        console.log('Error! Could not find signup link: ' + reason);
        response.status(403).send({
            error: {
                statusCode: 403,
                status: 'Unauthorized',
                message: 'User not found in signup database.'
            }
        });
    });
});

// Users detail
router.route('/users/:userId')

.get((request, response) => {
    User.findById(request.params.userId)
        .then(function(user) {
            response.json({result: user});
        })
        .catch(function(err) {
            response.json(err);
        });
})

.patch((request, response) => {
    if (request.user.id !== request.params.userId) {
        return response.status(403).end();
    }
    User.findOneAndUpdate({'_id': request.params.userId}, request.body, {new: true})
        .then(function(user) {
            response.json({result: user});
        })
        .catch(function(err) {
            response.json(err);
        });
});

module.exports = router;
