var mongoose = require('mongoose');
var shortid = require('shortid');
var Schema = mongoose.Schema;
var User = require('./user');

var CampaignSchema = new Schema({
    _id: { type: String, index: { unique: true }, 'default': shortid.generate },
    title: { type: String, required: true, trim: true },
    script: { type: String, trim: true },
    thank_you: { type: String, trim: true },
    learn_more: { type: String, trim: true },
    publish: { type: Boolean, trim: true },
    legislature_level: {
        federal_senate: { type: Boolean },
        federal_house: { type: Boolean },
        state_senate: { type: Boolean },
        state_assembly: { type: Boolean }
    },
    user: { type: Schema.Types.ObjectId, ref: User }
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
CampaignSchema.statics.findForRequestingUser = function (campaignId, requestUserId) {
    return this.findOne({ _id: campaignId })
        .then((campaign) => {
            if (!campaign) {
                return null;
            }
            // if campaign is not published, only return to owner of campaign
            if (!campaign.publish && campaign.user.toString() !== requestUserId) {
                return null;
            }
            return campaign;
        });
};

CampaignSchema.statics.findByUser = function (userId, sort) {
    let allowedSortOptions = ['createdAt', '-createdAt'];
    if (allowedSortOptions.indexOf(sort) === -1) {
        sort = '-createdAt';
    }
    return this.find({ user: userId }).sort(sort);
};

// instance methods
CampaignSchema.methods.delete = function (userId) {
    return new Promise((resolve, reject) => {
        if (this.user.toString() === userId) {
            resolve(this.remove());
        } else {
            console.log('unauthorized delete');
            reject(new Error('Cannot delete campaign belonging to other users.'));
        }
    });
};

CampaignSchema.virtual('url').get(function () {
    return `/${this._id}`;
});

var Campaign = mongoose.model('Campaign', CampaignSchema);

module.exports = Campaign;
