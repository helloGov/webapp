const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Promise = require('bluebird');
const crypto = require('crypto');
const randomBytes = Promise.promisify(crypto.randomBytes);
const config = require('../../conf/config');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const transporter = nodemailer.createTransport({
    service: 'Sparkpost',
    auth: {
        user: config.email_service_user,
        pass: config.email_service_password
    }
});

transporter.use('compile', hbs({
    extName: '.hbs',
    viewPath: 'app/views/emails'
}));

var PasswordReset = new Schema({
    email: { type: String, trim: true, required: true },
    resetToken: { type: String, trim: true, require: true },
    expiration: {type: Date, required: true}
});

// static methods
PasswordReset.statics.createReset = function(email) {
    return randomBytes(20)
        .then(function(buffer) {
            var today = new Date().getTime();
            return {
                resetToken: buffer.toString('hex'),
                expiration: new Date(today + 86400000),
                email: email
            };
        })
        .catch(function(err) {
            console.log(err);
        });
};

// instance methods
PasswordReset.methods.sendResetEmail = function() {
    var mail = {
        from: `"helloGov" <${config.noreply_email}>`,
        to: this.email,
        subject: 'Reset Your Password',
        template: 'passwordResetEmail',
        context: {
            resetToken: this.resetToken,
            helloGovDomain: `${config.protocol}://${config.hostname}`,
            supportEmail: config.support_email
        }
    };
    return transporter.sendMail(mail)
        .then((info) => {
            console.log('Message sent: %s with response: %s', info.messageId, info.response);
        })
        .catch((error) => {
            console.log('Message failed to send with error: %s', error);
        });
};

module.exports = mongoose.model('PasswordReset', PasswordReset);
