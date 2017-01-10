// public/js/core.js
var helloGov = angular.module('helloGov', []);

helloGov.controller('campaignController', function ($scope, $http) {
    $scope.formData = {};

    $scope.createCampaign = function() {
        $http.post('/campaign/create', $scope.formData)
            .then(function(data) {
                $scope.formData = {};
                $scope.campaign = data;
                console.log(data);
            })
            .catch(function(data) {
                console.log('Error: ' + data);
            });
    };
});

