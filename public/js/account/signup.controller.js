import angular from 'angular';

export default angular.module('helloGov')
.controller('signupController', function($scope, $http, $window, constants) {
    'ngInject';
    $scope.signupDetails = {};

    $scope.signUp = function() {
        $http.post(`${constants.API_ROOT}/users`, $scope.signupDetails)
            .then(function(data) {
                $window.location.href = '/home';
            })
            .catch(function(data) {
                $scope.error = 'We couldn\'t complete your sign up right now. Check your info and try again, or contact us at team@hellogov.org for assistance.';
            });
    };
})
.name;
