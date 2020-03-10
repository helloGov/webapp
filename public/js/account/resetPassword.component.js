import angular from 'angular';

export default angular.module('helloGov')
.component('resetPasswordForm', {
    template: require('./resetPassword.html'),
    controller: function($scope, $http, $window, constants, $location) {
        'ngInject';
        const self = this;
        // FIXME: less brittle way to get resetToken, but still not using Angular's router
        let resetToken = new URL($location.absUrl()).pathname.replace('/auth/reset-password/', '').replace(/[/]/g, '');

        this.resetDetails = {
            resetToken: resetToken
        };

        this.resetPassword = function() {
            $http.put(`${constants.API_ROOT}/auth/password`, self.resetDetails)
                .then(function() {
                    self.passwordResetSuccess = true;
                })
                .catch(function() {
                    self.error = 'We couldn\'t complete your password reset right now. Please try again later.';
                });
        };
    }
})
.name;
