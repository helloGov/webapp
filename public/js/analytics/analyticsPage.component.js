import angular from 'angular';

export default angular.module('helloGov')
.component('analyticsPage', {
    template: require('./analyticsPage.html'),
    controller: function($scope, $http, $location, constants) {
        'ngInject';
        // FIXME: less brittle way to get campaignId, but still not using Angular's router
        $scope.campaignId = new URL($location.absUrl()).pathname.replace('analytics', '').replace(/[/]/g, '');

        $http.get(`${constants.API_ROOT}/campaigns/${$scope.campaignId}`, $scope.campaign)
        .then(function(result) {
            $scope.campaign = result.data;
        })
        .catch(function(data) {
            console.log(`Error:  ${JSON.stringify(data)}`);
        });

        $http.get(`${constants.API_ROOT}/events?campaignId=${$scope.campaignId}`, $scope.analytics)
        .then(function(result) {
            $scope.analytics = result.data;
        })
        .catch(function(data) {
            console.log(`Error:  ${JSON.stringify(data)}`);
        });
    }
})
.name;
