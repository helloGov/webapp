const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Promise = require('bluebird');
const crypto = require('crypto');
const randomBytes = Promise.promisify(crypto.randomBytes);
const config = require('../../conf/config');
const sgMail = require('@sendgrid/mail');

var PasswordReset = new Schema({
    email: { type: String, trim: true, required: true },
    resetToken: { type: String, trim: true, require: true },
    expiration: {type: Date, required: true}
});

// static methods
PasswordReset.statics.createResetObject = function(email) {
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
PasswordReset.methods.sendResetEmail = function(firstName) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
        to: this.email,
        from: config.noReplyEmail,
        templateId: 'd-bf5409ddeeeb418eaea1d66ddf0870ba',
        dynamic_template_data: {
            first_name: firstName,
            reset_pw_url: `${config.protocol}://${config.hostname}/auth/reset-password/${this.resetToken}`
        }
    };
    return sgMail.send(msg);
};

module.exports = mongoose.model('PasswordReset', PasswordReset);
