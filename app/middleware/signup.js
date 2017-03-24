var Signup = require('../models/signup');

var signupController = {};

signupController.newSignup = function(usrEmail) {
    var findStr = {email: usrEmail};
    return Signup.find(findStr).exec()
    .then(function(result) {
        if (result.length > 0) {
            console.log('email ' + usrEmail + ' already in the system!');
            var promise = new Promise(function() {});
        } else {
            console.log('Creating new signup with email ' + usrEmail);
            var signup = new Signup({email: usrEmail});
            promise = signup.save();
        }

        return promise;
    });
};

module.exports = signupController;
