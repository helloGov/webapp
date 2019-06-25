import angular from 'angular';

export default angular.module('helloGov')
.component('signupPage', {
    template: require('./signupPage.html'),
    controller: function($location, $http, $window, constants) {
        'ngInject';
        let self = this;
        this.signupDetails = {};

        this.$onInit = function() {
            // FIXME: less brittle way to get signupId, but still not using Angular's router
            let signupId = new URL($location.absUrl()).pathname.replace('/signup/', '');
            $http.get(`${constants.API_ROOT}/signups/${signupId}`)
                .then((resp) => {
                    self.signupDetails.signupLink = resp.data.result.signupLink;
                })
                .catch(() => {
                    // once we are using a client router we can show a 404 page instead
                    self.error = 'This doesn\'t appear to be a valid signup URL. Please check this and try again.';
                });
        };

        this.signUp = function() {
            $http.post(`${constants.API_ROOT}/users`, self.signupDetails)
                .then(function(data) {
                    $window.location.href = '/home';
                })
                .catch(function(data) {
                    self.error = 'We couldn\'t complete your sign up right now. Check your info and try again, or contact us at team@hellogov.org for assistance.';
                });
        };
    }
})
.name;
