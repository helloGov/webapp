import angular from 'angular';

export default angular.module('helloGov')
.controller('loginController', function($scope, $http, $window, constants) {
    'ngInject';
    $scope.loginDetails = {};

    $scope.login = function() {
        $scope.error = '';
        $http.post(`${constants.API_ROOT}/auth/login`, $scope.loginDetails)
            .then(function(data) {
                $window.location.href = '/home';
            })
            .catch(function() {
                $scope.error = 'That doesn\'t look right. Please check your username and password and try again.';
            });
    };
})
.name;
