var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
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
    username: {
        type: String,
        trim: true,
        required: true
    },
    organizationName: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    bio: {
        type: String,
        trim: true,
        default: ''
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
        },
        toJSON: {
            virtuals: true
        },
        toObject: {
            virtuals: true
        }
    }
);

User.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

var validatePasswordLength = function(password, cb) {
    if (password.length < 7) {
        return cb('Password must be at least 8 characters long.');
    }
    return cb();
};

User.plugin(passportLocalMongoose, { passwordValidator: validatePasswordLength });
module.exports = mongoose.model('User', User);
