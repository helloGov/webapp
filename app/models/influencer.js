var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Influencer = new Schema({
    firstName: {
        type: String,
        trim: true,
        required: true
    },
    lastName: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    bio: {
        type: String,
        trim: true
    },
    oauthID: {
        type: String
    },
    image: {
        type: String,
        trim: false
    },
    admin: {
        type: Boolean,
        trim: true,
        default: false
    }
},
    {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
        }
    }
);

Influencer.plugin(passportLocalMongoose);
module.exports = mongoose.model('Influencer', Influencer);
