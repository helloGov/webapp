var mongoose = require('mongoose'),
	Schema = mongoose.Schema


var CampaignSchema = new Schema({
	title: { type: String, required: true, index: { unique: true }, trim: true },
	script: { type: String, trim: true },
	thank_you: {type: String, trim: true},
	learn_more: {type: String, trim: true},
//	influencer: {type: String, trim: false},
//	image: {type: String, trim:false},
//	timestamp: {type: Date, default: Date.now}
});

mongoose.model('Campaign', CampaignSchema);
