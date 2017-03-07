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
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

var Campaign = mongoose.model('Campaign', CampaignSchema);

module.exports = Campaign;
