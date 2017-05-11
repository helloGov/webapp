const express = require('express');
const router = express.Router();
var passport = require('passport');

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

router.route('/auth/login')
.post(function(request, response) {
    passport.authenticate('local')(request, response, function() {
        response.status(200).end();
    });
});

module.exports = router;
