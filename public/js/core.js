// public/js/core.js
var helloGov = angular.module('helloGov', []);

helloGov.controller('campaignController', function ($scope, $http, $window) {
    $scope.formData = {};
    $http.get('/campaignList', $scope.campaigns)
    .then(function(result) {
        $scope.campaigns = result.data;
        console.log($scope.campaigns)
    })
    .catch(function(data) {
        console.log('Error: ' + data);
    });

    $scope.createCampaign = function(publishFlag) {
        $scope.formData.publish = publishFlag;
        console.log($scope.formData);
        $http.post('/campaign/create', $scope.formData)
            .then(function(data) {
                $scope.formData = {};
                $scope.campaign = data;
                $window.location.href = '/';
                console.log(data);
            })
            .catch(function(data) {
                console.log('Error: ' + data);
            });
    };
});

helloGov.controller('userController', function ($scope, $http, $window) {
    $scope.loginDetails = {};
    $scope.signupDetails = {};

    $scope.signUp = function() {
        $http.post('/user/signup', $scope.signupDetails)
            .then(function(data) {
                $scope.signUpDetails = {};
                $scope.session = data;
                $window.location.href = '/';
                console.log(data);
            })
            .catch(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.login = function() {
        $http.post('/user/login', $scope.loginDetails)
            .then(function(data) {
                $scope.loginDetails = {};
                $scope.session = data;
                $window.location.href = '/';
                console.log(data);
            })
            .catch(function(data) {
                $('#login-message').html("Login failed");
            });
    };
});
