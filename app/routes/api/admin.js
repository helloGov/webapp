const express = require('express');
const shortid = require('shortid');
const router = express.Router();
const signupController = require('../../middleware/signup');
const Signup = require('../../models/signup');

// admin link generation
router.route('/createLink')

.get((request, response) => {
    if (request.user) {
        signupController.newSignup(request.query.email)
             .then(function() {
                 return Signup.find({email:request.query.email});
             })
             .then(function(result) {
                 response.send(result[0].signupLink);
             })
             .catch(function(err) {console.log(err)});
    } else {
        response.status(301).render('unauthorized', {logged_in: false});
    }
});

module.exports = router;
