import angular from 'angular';

export default angular.module('helloGov')
.component('resetPasswordForm', {
    template: require('./resetPassword.html'),
    controller: function($scope, $http, $window, constants, $location) {
        'ngInject';
        // FIXME: this is super brittle to get the resetToken like this, but we're not using angular's
        // routing so it's not possible to get it using angular yet
        const self = this;
        let urlSplit = $location.absUrl().split('/');
        let resetToken = urlSplit[urlSplit.length - 1];

        this.resetDetails = {
            resetToken: resetToken
        };

        this.resetPassword = function() {
            $http.put(`${constants.API_ROOT}/auth/password`, self.resetDetails)
                .then(function(data) {
                    self.passwordResetSuccess = true;
                })
                .catch(function(data) {
                    self.error = 'We couldn\'t complete your password reset right now. Please try again later.';
                });
        };
    }
})
.name;
