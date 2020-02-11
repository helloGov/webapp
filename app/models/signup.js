var mongoose = require('mongoose');
var shortid = require('shortid');
var Schema = mongoose.Schema;

var Signup = new Schema({
    email: { type: String, lowercase: true, trim: true },
    signupLink: { type: String, trim: true, 'default': shortid.generate }
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

module.exports = mongoose.model('Signup', Signup);
