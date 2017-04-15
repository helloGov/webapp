import angular from 'angular';

export default angular.module('helloGov')
.controller('analyticsController', function($scope, $http, $location, constants) {
    'ngInject';
    var urlSplit = $location.absUrl().split('/');
    $scope.campaignId = urlSplit[1];

    $http.get(`${constants.API_ROOT}/campaigns/${$scope.campaignId}`, $scope.campaign)
    .then(function(result) {
        console.log(`got analytics data: ${result.data}`);
        $scope.campaign = result.data;
    })
    .catch(function(data) {
        console.log(`Error:  ${JSON.stringify(data)}`);
    });

    $http.get(`${constants.API_ROOT}/events?campaignId=${$scope.campaignId}`, $scope.analytics)
    .then(function(result) {
        console.log(`got analytics data: ${result.data}`);
        $scope.analytics = result.data;
    })
    .catch(function(data) {
        console.log(`Error:  ${JSON.stringify(data)}`);
    });
})
.name;
