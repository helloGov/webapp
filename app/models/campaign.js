var mongoose = require('mongoose');
var shortid = require('shortid');
var Schema = mongoose.Schema;

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
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
        },
        toJSON: {
            virtuals: true
        },
        toObject: {
            virtuals: true
        }
    });

// static methods
CampaignSchema.statics.findByTitleAndUser = function(title, influencerId) {
    return this.find({title: title, influencer: influencerId});
};

CampaignSchema.statics.findByUser = function(influencerId) {
    return this.find({influencer: influencerId});
};

// instance methods
CampaignSchema.methods.delete = function(userId) {
    return new Promise((resolve, reject) => {
        if (this.influencer === userId) {
            resolve(this.remove());
        } else {
            console.log('unauthorized delete');
            reject(new Error('Cannot delete campaign belonging to other users.'));
        }
    });
};

CampaignSchema.virtual('url').get(function() {
    return `/c/${this._id}`;
});

var Campaign = mongoose.model('Campaign', CampaignSchema);

module.exports = Campaign;
