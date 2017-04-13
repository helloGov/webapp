import angular from 'angular';

export default angular.module('helloGov')
.controller('userController', function($scope, $http, $location, $window) {
    'ngInject';
    $scope.loginDetails = {};

    $scope.login = function() {
        $http.post('/login', $scope.loginDetails)
            .then(function(data) {
                $scope.loginDetails = {};
                $scope.session = data;
                $window.location.href = '/home';
            })
            .catch(function() {
                angular.element('#login-message').html('Login failed');
            });
    };

    // For image upload
    $scope.file_changed = function(element) {
        $scope.$apply(function() {
            var photofile = element.files[0];
            var reader = new FileReader();
            reader.onload = function() {
            // handle onload here
            };
            reader.readAsDataURL(photofile);
        });
    };
})
.name;
