const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../../models/user');
const PasswordReset = require('../../models/passwordReset');

router.route('/auth/password')
    .put((request, response) => {
        let reset;
        let userPromise = new Promise(function (resolve, reject) {
            if (request.user) {
                // for cases when user is authenticated
                resolve(request.user);
            } else if (request.body.resetToken) {
                // for cases when resetToken is passed in
                PasswordReset.findOne({ resetToken: request.body.resetToken })
                    .then(function (passwordReset) {
                        // save it for removal after new password is set
                        reset = passwordReset;
                        return User.findOne({ email: passwordReset.email });
                    })
                    .then(function (user) {
                        resolve(user);
                    });
            } else {
                // bad request
                reject(new Error('User not found.'));
            }
        });

        userPromise.then((user) => {
            user.setPassword(request.body.password, function (err, model, passwordErr) {
                if (err || passwordErr || request.body.password.length < 7) {
                    response.status(400).end();
                } else {
                    model.save()
                        .then(function () {
                            if (reset) {
                                reset.remove();
                            }
                            response.status(200).end();
                        });
                }
            });
        });
    });

router.route('/auth/password/requestReset')
    .post(function (request, response) {
        User.findOne({ email: request.body.email })
            .then(function (user) {
                if (user) {
                    PasswordReset.createResetObject(user.email)
                        .then(function (newReset) {
                            // update an existing reset, or add a new one
                            return PasswordReset.findOneAndUpdate({
                                email: user.email
                            }, newReset, { upsert: true, new: true });
                        })
                        .then(function (reset) {
                            return reset.sendResetEmail();
                        })
                        .then(function () {
                            return response.status(200).end();
                        });
                } else {
                    return response.status(404).end();
                }
            });
    });

router.route('/auth/login')
    .post(function (request, response) {
        passport.authenticate('local')(request, response, function () {
            response.status(200).end();
        });
    });

module.exports = router;
