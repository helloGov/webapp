import angular from 'angular';

export default angular.module('helloGov')
.controller('signupController', function($scope, $http, $window) {
    'ngInject';
    $scope.signupDetails = {};

    $scope.signUp = function() {
        $http.post('/signup', $scope.signupDetails)
            .then(function(data) {
                $scope.signUpDetails = {};
                $scope.session = data;
                if (data.data.includes('Error')) {
                    $window.location.href = '/error';
                } else {
                    $window.location.href = '/';
                }
            })
            .catch(function(data) {
                angular.element('#login-message').html('Signup failed! Check your email and try again, or contact us at team@hellogov.org for assistance');
            });
    };
})
.name;
