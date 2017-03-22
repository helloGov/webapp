var mongoose = require("mongoose"),
    Signup = mongoose.model('Signup');

var signupController = {};

signupController.newSignup = function (usrEmail) {
    var findStr = {email: usrEmail};
    return Signup.find(findStr).exec()
    .then(function(result) {
        if(result.length > 0) {
            console.log("email "+usrEmail+ " already in the system!")
            promise = new Promise(function () {});
        } else {
            console.log("Creating new signup with email "+usrEmail)
            signup = new Signup({email: usrEmail});
            promise = signup.save();
        }

        return promise;
    });
}

module.exports = signupController;
