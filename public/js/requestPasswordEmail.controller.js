import angular from 'angular';

export default angular.module('helloGov')
.controller('requestPasswordEmailController', function($scope, $http, $window, constants) {
    'ngInject';
    $scope.emailRequestDetails = {};

    $scope.requestReset = function() {
        $scope.error = '';
        $http.post(`${constants.API_ROOT}/auth/password/requestReset`, $scope.emailRequestDetails)
            .then(function(data) {
                $scope.message = 'An email has been sent to you. Please check your inbox for instructions to reset your password. If you do not receive this email, please check your spam folder.';
            })
            .catch(function() {
                $scope.message = 'Please try again later.';
            });
    };
})
.name;
