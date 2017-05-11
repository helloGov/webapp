import angular from 'angular';

export default angular.module('helloGov')
.controller('requestPasswordEmailController', function($scope, $http, $window, constants) {
    'ngInject';
    $scope.emailRequestDetails = {};

    $scope.requestReset = function() {
        $scope.error = '';
        $http.post(`${constants.API_ROOT}/auth/requestReset`, $scope.emailRequestDetails)
            .then(function(data) {
                $window.location.href = '/home';
            })
            .catch(function() {
                $scope.error = 'That doesn\'t look right. Please check your username and password and try again.';
            });
    };
})
.name;
