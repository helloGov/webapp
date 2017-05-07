var userController = require('../controllers/user');
var passport = require('passport');
var Signup = require('../models/signup');

module.exports = function(router) {
    router.get('/signup/:signupId', (request, response) => {
        if (!request.user) {
            Signup.findOne({signupLink: request.params.signupId})
                .then((signup) => {
                    response.render('signup', {user: null, logged_in: request.user != null, signup: signup});
                });
        } else {
            response.redirect('/');
        }
    });

    // Redirect the user to Facebook for authentication.  When complete,
    // Facebook will redirect the user back to the application at
    //     /auth/facebook/callback
    router.get('/auth/facebook', userController.addUserWithFacebook);

    // Facebook will redirect the user to this URL after approval.  Finish the
    // authentication process by attempting to obtain an access token.  If
    // access was granted, the user will be logged in.  Otherwise,
    // authentication has failed.
    router.get('/auth/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '/login' }),
        function(req, res) {
            console.log(`got user_details: ${JSON.stringify(req.body)}`);
            res.redirect('/');
        });


    router.get('/login', (request, response) => {
        response.render('login', {user: null, logged_in: false});
    });

    // removed line:
    // response.render('login', {user: null, logged_in: request.user != null});
    
    router.get('/settings', (request, response) => {
        if (request.user) {
            response.render('settings', {user: request.user, logged_in: true});
        } else {
            response.redirect('/login');
        }
    });

    // scripttutorial, contact, and help added by kerobinso
    // by copying the above

    router.get('/scripttutorial', (request, response) => {
        if (request.user) {
            response.render('scripttutorial', {user: request.user, logged_in: true});
        } else {
            response.redirect('/login');
        }
    });

    router.get('/contact', (request, response) => {
        response.render('contact', {user: request.user, logged_in: request.user != null});
    });

    router.get('/help', (request, response) => {
        response.render('help', {user: request.user, logged_in: request.user != null});
    });
    
};
