import angular from 'angular';

export default angular.module('helloGov')
.controller('campaignsController', function($scope, $http, $window, $location, constants) {
    'ngInject';
    $scope.formData = {};
    $http.get(`${constants.API_ROOT}/campaigns`, $scope.campaigns)
    .then(function(result) {
        $scope.campaigns = result.data;
    })
    .catch(function(data) {
        console.log('Error: ' + data);
    });
})
.name;
