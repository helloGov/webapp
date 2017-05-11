const express = require('express');
const router = express.Router();
var passport = require('passport');
var userController = require('../../controllers/user.js');
var PasswordReset = require('../../models/passwordReset');
var Influencer = require('../../models/influencer')

router.route('/auth/password')
.put((request, response) => {
    request.user.setPassword(request.body.password, function(err, model, passwordErr) {
        if (err || passwordErr) {
            response.status(400).end();
        } else {
            model.save();
            response.status(200).end();
        }
    });
});

router.route('/auth/resetPassword')
.put((request, response) => {
    PasswordReset.findOne({resetToken: request.body.resetToken}).exec()
    .then(function(passwordReset){
        Influencer.findOne({email:passwordReset.email}).exec()
        .then(function(user){
            user.setPassword(request.body.password, function(err, model, passwordErr) {
                if (err || passwordErr) {
                    response.status(400).end();
                } else {
                    model.update();
                    response.status(200).end();
                }
            });
        });
    });
});

router.route('/auth/login')
.post(function(request, response) {
    passport.authenticate('local')(request, response, function() {
        response.status(200).end();
    });
});

router.route('/auth/requestReset')
.post(function(request, response) {
    Influencer.findOne({email:request.body.email}).exec()
    .then(function(user){
        console.log("sending password email");
        userController.sendPasswordResetEmail(request, response);
        //TODO: redirect to login
    });
});

module.exports = router;
