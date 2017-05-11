import angular from 'angular';

export default angular.module('helloGov')
.controller('resetPasswordController', function($scope, $http, $window, constants) {
    'ngInject';
    $scope.resetDetails = {};

    $scope.resetPassword = function() {
        $http.put(`${constants.API_ROOT}/auth/resetPassword`, $scope.resetDetails)
            .then(function(data) {
                $window.location.href = '/home';
            })
            .catch(function(data) {
                $scope.error = 'We couldn\'t complete your password reset right now. Check your info and try again, or contact us at team@hellogov.org for assistance.';
            });
    };
})
.name;
