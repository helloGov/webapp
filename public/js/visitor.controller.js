import angular from 'angular';

export default angular.module('helloGov')
.controller('visitorController', function($scope, $http, $window, $location, constants) {
    'ngInject';
    var urlSplit = $location.absUrl().split('/');
    $scope.campaign = urlSplit.pop();
    $scope.locResult = '';
    $scope.locOptions = null;
    $scope.locDetails = '';

    $scope.sendEvent = function(type) {
        $http.post(`${constants.API_ROOT}/events`, {type: type, campaign: $scope.campaign});
    };
    $scope.sendEvent('visit');
    $scope.update = function() {
        var coordinates = {
            'latitude': $scope.locDetails.geometry.location.lat(),
            'longitude': $scope.locDetails.geometry.location.lng()
        };

        $http.get('/locateLegislator', {params: coordinates})
        .then(function(result) {
            $scope.repFound = result.data.representativeFound;
            $scope.repInfo = result.data.representativeInfo;

            $scope.addrForm = false;
            if ($scope.repFound) {
                $scope.repForm = true;
            } else {
                $scope.repNotFoundForm = true;
            }
        })
        .catch(function(data) {
            console.log(data);
        });
    };

    $scope.addrForm = true;
    $scope.repForm = false;
    $scope.repNotFoundForm = false;
})
.name;
