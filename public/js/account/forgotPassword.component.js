import angular from 'angular';

export default angular.module('helloGov')
.component('forgotPasswordForm', {
    template: require('./forgotPassword.html'),
    controller: function($http, $window, constants) {
        'ngInject';
        const self = this;
        this.emailRequestDetails = {};

        this.submitDisabled = false;

        this.requestReset = function() {
            self.submitDisabled = true;
            self.message = '';
            self.error = '';
            $http.post(`${constants.API_ROOT}/auth/password/requestReset`, self.emailRequestDetails)
                .then(function(data) {
                    self.message = 'An email has been sent to you. Please check your inbox for instructions to reset your password. If you do not receive this email, please check your spam folder.';
                    self.emailRequestDetails = {};
                })
                .catch(function() {
                    self.error = 'There was an error. Please try again later.';
                })
                .finally(function() {
                    self.submitDisabled = false;
                });
        };
    }
})
.name;
