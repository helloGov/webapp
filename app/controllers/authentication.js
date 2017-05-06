var User = require('../models/user');
var fs = require('fs');
var request = require('request');

var getFacebookPhoto = function(user) {
    var userID = user.id;
    var oauthID = user.oauthID;
    var photoJsonUrl = `http://graph.facebook.com/v2.8/${oauthID}/picture?type=large&redirect=false`;
    var photoPath = `public/images/users/${userID}.jpg`;

    request(photoJsonUrl, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var photoJson = JSON.parse(body);
            var photoUrl = photoJson.data.url;
            request.head(photoUrl, function() {
                request(photoUrl).pipe(fs.createWriteStream(photoPath)).on('close', function() {
                    console.log(`photo saved at ${photoPath}`);
                });
            });
        }
    });
};

var facebookAuthHandler = function(accessToken, refreshToken, profile, cb) {
    User.findOne({ oauthID: profile.id }, function(err, user) {
        if (err) {
            console.log(err);  // handle errors!
        }
        if (!err && user !== null) {
            cb(null, user);
        } else {
            user = new User({
                oauthID: profile.id,
                name: profile.displayName,
                image: '' /// TODO -- using a placeholder for now
            });
            user.save(function(err, result) {
                if (err) {
                    console.log(err);  // handle errors!
                } else {
                    console.log('saving user ...');
                    getFacebookPhoto(result);
                    cb(null, user);
                }
            });
        }
    });
};

module.exports.facebookAuthHandler = facebookAuthHandler;
