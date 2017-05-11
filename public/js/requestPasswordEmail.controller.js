import angular from 'angular';

export default angular.module('helloGov')
.controller('requestPasswordEmailController', function($scope, $http, $window, constants) {
    'ngInject';
    $scope.emailRequestDetails = {};

    $scope.requestReset = function() {
        $scope.error = '';
        $http.post(`${constants.API_ROOT}/user/requestReset`, $scope.emailRequestDetails)
            .then(function(data) {
                $window.location.href = '/home';
            })
            .catch(function() {
                $scope.error = 'Please try again later.';
            });
    };
})
.name;
