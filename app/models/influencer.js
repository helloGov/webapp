var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	passportLocalMongoose = require('passport-local-mongoose');

var Influencer = new Schema({
	name: { type: String, trim: true },
	email: { type: String, trim: true },
	bio: {type: String, trim: true},
	oauthID: {type: Number},
	password: {type: String, trim: false},
	image: {type: String, trim:false},
	timestamp: {type: Date, default: Date.now}
});

Influencer.plugin(passportLocalMongoose);
module.exports = mongoose.model('Influencer', Influencer);
