import angular from 'angular';

export default angular.module('helloGov')
.component('adminPage', {
    template: require('./admin.html'),
    controller: function($http, $location, constants) {
        'ngInject';
        let self = this;

        this.$onInit = function() {
            this.newUserDetails = {};
            this.host = $location.host();
            this.protocol = $location.protocol();
            $http.get(`${constants.API_ROOT}/signups`)
                .then((resp) => {
                    self.signups = resp.data.result;
                });
        };

        this.createLink = function() {
            self.signupLink = '';
            self.error = undefined;
            $http.post(`${constants.API_ROOT}/signups`, {email: self.newUserDetails.email})
                .then(function(resp) {
                    self.signupLink = `${self.protocol}://${self.host}/signup/${resp.data.signupLink}`;
                    self.signups.unshift(resp.data);
                    self.newUserDetails = {};
                })
                .catch(function(resp) {
                    self.error = resp.data.error.message;
                });
        };
    }
})
.name;
