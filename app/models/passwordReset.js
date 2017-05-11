var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PasswordReset = new Schema({
    email: { type: String, trim: true, required: true },
    resetToken: { type: String, trim: true, require: true },
    expiration: {type: Date, required: true}
});

module.exports = mongoose.model('PasswordReset', PasswordReset);
