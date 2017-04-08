import angular from 'angular';

export default angular.module('helloGov')
.controller('adminController', function($scope, $http, $location, constants) {
    'ngInject';
    $scope.loginDetails = {};
    $scope.signupDetails = {};

    $scope.createLink = function() {
        $http.get(`${constants.API_ROOT}/createLink?email=${$scope.newUserDetails.email}`)
        .then(function(data) {
            $scope.showSignupLink = true;
            $scope.signupLink = $location.host() + '/signup/' + data.data;
        })
        .catch(function(data) {
            console.log('Error: ' + data);
        });
    };

    $scope.showSignupLink = false;
})
.name;
