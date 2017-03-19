var mongoose = require('mongoose'),
    shortid = require('shortid'),
    Schema = mongoose.Schema;

var Signup = new Schema({
    email: { type: String, trim: true },
    signupLink: {type: String, trim: true, 'default': shortid.generate },
});

module.exports = mongoose.model('Signup', Signup);
