const express = require('express');
const router = express.Router();
const Signup = require('../../models/signup');
const User = require('../../models/user');

// Signup list
router.route('/signups')

.post((request, response) => {
    if (request.user && request.user.admin) {
        let email = request.body.email;

        // don't add if Signup already exists
        Signup.findOne({email: email})
            .then(function(signup) {
                if (signup) {
                    throw new Error('Signup already exists with this email address.');
                }
            })
            // check to see if user has already created an account with this email
            .then(function() {
                return User.findOne({email: email})
                    .then(function(user) {
                        if (user) {
                            throw new Error('User account already exists with this email address.');
                        }
                    });
            })
            .then(function() {
                var signup = new Signup({email: email});
                return signup.save();
            })
            .then(function(signup) {
                return response.send(signup);
            })
            .catch(function(err) {
                response.status(400).send({
                    error: {
                        statusCode: 400,
                        status: 'Bad request',
                        message: 'There was an error creating new signup: ' + err
                    }
                });
            });
    } else {
        response.status(403).end();
    }
})

.get((request, response) => {
    if (request.user && request.user.admin) {
        Signup.find().sort('-createdAt')
            .then((signups) => {
                return response.send({result: signups});
            });
    } else {
        return response.status(403).end();
    }
});

// Signup detail
router.route('/signups/:signupLink')

.get((request, response) => {
    Signup.findOne({signupLink: request.params.signupLink})
        .then(function(signup) {
            if (!signup) {
                return response.status(404).end();
            }
            return response.send({result: signup});
        });
});

module.exports = router;
