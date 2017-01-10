var mongoose = require('mongoose'),
	Schema = mongoose.Schema


var InfluencerSchema = new Schema({
	username: { type: String, required: true, index: { unique: true }, trim: true },
	email: { type: String, trim: true },
	bio: {type: String, trim: true},
	loginName: {type: String, trim: true},
	password: {type: String, trim: false},
	image: {type: String, trim:false},
	timestamp: {type: Date, default: Date.now}
});

mongoose.model('Influencer', InfluencerSchema);
