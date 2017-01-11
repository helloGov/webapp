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

    $scope.createCampaign = function() {
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

