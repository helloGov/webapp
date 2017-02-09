var mongoose = require('mongoose'),
    shortid = require('shortid'),
	Schema = mongoose.Schema

var CampaignSchema = new Schema({
    _id: { type: String, index: { unique: true }, 'default': shortid.generate },
	title: { type: String, required: true, trim: true },
	script: { type: String, trim: true },
	thank_you: {type: String, trim: true},
	learn_more: {type: String, trim: true},
    publish: {type: Boolean, trim: true},
    influencer: {type: String, trim: false}
//	image: {type: String, trim:false},
//	timestamp: {type: Date, default: Date.now}
});

mongoose.model('Campaign', CampaignSchema);
