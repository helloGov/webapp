var Signup = require('../models/signup');
var passport = require('passport');
const nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');
var secrets = require('../../secrets');
var crypto = require('crypto');
const PasswordReset = require('../models/passwordReset');

let transporter = nodemailer.createTransport({
    service: 'Sparkpost',
    auth: {
        user: secrets.email_service_user,
        pass: secrets.email_service_password
    }
});

var options = {
    extName: '.hbs',
    layoutsDir: 'app/views/layouts',
    defaultLayout: 'template',
    partialsDir: '../views/partials/', 
    viewPath: 'app/views'
}
transporter.use('compile', hbs(options));


var userController = {};

userController.addUserWithFacebook = function(request, response) {
    var findStr = { email: request.body.email, signupLink: request.body.signupLink };
    Signup.findOne(findStr).exec()
    .then(function(signup) {
        if (signup) {
            passport.authenticate('facebook');
        } else {
            console.log('User not found in signup database! User: ' + request.body.email + ' link: ' + request.body.signupLink);
        }
    })
    .catch(function(reason) {
        console.log('Error! Could not find signup link: ' + reason);
    });
};

userController.sendPasswordResetEmail = function(request, response) {
    crypto.randomBytes(20, function(err, buffer) {
        var token = buffer.toString('hex');
        console.log("we have token: " + token);
        var today = new Date().getTime();
        var expiration = new Date(today + 86400000);
        var passwordReset = new PasswordReset({
            email: request.body.email, 
            resetToken: token, 
            expiration: expiration
        });
        console.log("passwordReset.email: " + passwordReset.email);
        passwordReset.save()
        .then(function(resetObject){
            console.log("passwordObject saved");
            var mail = {
                from: `"helloGov" <${secrets.noreply_email}>`, 
                to: request.body.email, 
                subject: 'Reset Your Password',
                template: 'passwordResetEmail', 
                context: {
                    resetToken: token,
                    resetExpiration: expiration,
                    helloGovDomain: secrets.hellogov_domain, 
                    supportEmail: secrets.support_email
                }
            };
            transporter.sendMail(mail, (error, info) => {
                if (error) {
                    response.send("ERROR");
                    return console.log(error);
                }
                console.log('Message %s sent: %s', info.messageId, info.response);
                response.send("SUCCESS");
            });
        });
    });
}

module.exports = userController;
