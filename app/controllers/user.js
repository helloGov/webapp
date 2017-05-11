var Signup = require('../models/signup');
const passport = require('passport');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
var secrets = require('../../secrets');
var crypto = require('crypto');
var PasswordReset = require('../models/passwordReset');

let transporter = nodemailer.createTransport({
    service: 'Sparkpost',
    auth: {
        user: secrets.email_service_user,
        pass: secrets.email_service_password
    }
});

var options = {
    extName: '.hbs',
    viewPath: 'app/views/emails'
};
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

userController.sendPasswordResetEmail = function(userEmail) {
    crypto.randomBytes(20, function(err, buffer) {
        if (err) {
            console.log('Failed to generate reset token');
        } else {
            var token = buffer.toString('hex');
            var today = new Date().getTime();
            var expiration = new Date(today + 86400000);
            var passwordReset = new PasswordReset({
                email: userEmail,
                resetToken: token,
                expiration: expiration
            });
            passwordReset.save()
            .then(function(resetObject) {
                var mail = {
                    from: `"helloGov" <${secrets.noreply_email}>`,
                    to: userEmail,
                    subject: 'Reset Your Password',
                    template: 'passwordResetEmail',
                    context: {
                        resetToken: token,
                        helloGovDomain: secrets.hellogov_domain,
                        supportEmail: secrets.support_email
                    }
                };
                transporter.sendMail(mail, (error, info) => {
                    if (error) {
                        console.log('Message failed to send with error: %s', error);
                    }
                    console.log('Message sent: %s with response: %s', info.messageId, info.response);
                });
            });
        }
    });
};

module.exports = userController;
