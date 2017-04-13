import angular from 'angular';

export default angular.module('helloGov')
.controller('loginController', function($scope, $http, $window, constants) {
    'ngInject';
    $scope.loginDetails = {};

    $scope.login = function() {
        $scope.error = '';
        $http.post(`${constants.API_ROOT}/influencers/login`, $scope.loginDetails)
            .then(function(data) {
                $window.location.href = '/home';
            })
            .catch(function() {
                $scope.error = 'That account doesn\'t exist. Please check your username and password and try again.';
            });
    };
})
.name;
