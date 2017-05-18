import angular from 'angular';

export default angular.module('helloGov')
.controller('resetPasswordController', function($scope, $http, $window, constants) {
    'ngInject';
    $scope.resetDetails = {};

    $scope.resetPassword = function() {
        $http.put(`${constants.API_ROOT}/auth/password`, $scope.resetDetails)
            .then(function(data) {
                $window.location.href = '/home';
            })
            .catch(function(data) {
                $scope.error = 'We couldn\'t complete your password reset right now. Please try again later.';
            });
    };
})
.name;
