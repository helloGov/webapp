import angular from 'angular';

export default angular.module('helloGov')
.component('loginPage', {
    template: require('./loginPage.html'),
    controller: function($scope, $http, $window, constants) {
        'ngInject';
        $scope.loginDetails = {};

        $scope.login = function() {
            $scope.error = '';
            $http.post(`${constants.API_ROOT}/auth/login`, $scope.loginDetails)
                .then(function() {
                    $window.location.href = '/home';
                })
                .catch(function() {
                    $scope.error = 'That doesn\'t look right. Please check your username and password and try again.';
                });
        };
    }
})
.name;
