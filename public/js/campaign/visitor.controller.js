import angular from 'angular';

export default angular.module('helloGov')
    .controller('visitorController', function ($scope, $http, $location, constants) {
        'ngInject';
        // FIXME: this is super brittle to get the campaignId like this, but we're not using angular's
        // routing so it's not possible to get it using angular yet
        var urlSplit = $location.absUrl().split('/');
        $scope.campaign = urlSplit.pop();
        $scope.locResult = '';
        $scope.locOptions = null;
        $scope.locDetails = '';

        $scope.sendEvent = function (type) {
            $http.post(`${constants.API_ROOT}/events`, { type: type, campaign: $scope.campaign });
        };
        $scope.sendEvent('visit');
        $scope.update = function () {
            let address = $scope.locDetails.formatted_address.replace(/ /g, '%20');
            let latitude = $scope.locDetails.geometry.location.lat();
            let longitude = $scope.locDetails.geometry.location.lng();
            let userState = $scope.locDetails.adr_address.split("region")[1].split("").splice(2, 2).join("");

            $http.get('/locateLegislator', { params: { address: address, latitude: latitude, longitude: longitude, campaignId: $scope.campaign } })
                .then(function (result) {
                    $scope.repFound = result.data.representativeFound;
                    $scope.repInfo = result.data.representativeInfo;
                    $scope.addrForm = false;
                    let legislatureLevel = result.data.campaign.legislature_level;

                    if ((legislatureLevel.state_senate || legislatureLevel.state_assembly) && (userState !== result.data.campaign.state)) {
                        $scope.stateMismatch = true;
                    }
                    else if ($scope.repFound) {
                        $scope.repForm = true;
                    } else {
                        $scope.repNotFoundForm = true;
                    }
                })
                .catch(function (data) {
                    console.log(data);
                });
        };

        $scope.addrForm = true;
        $scope.repForm = false;
        $scope.repNotFoundForm = false;
        $scope.stateMismatch = false;
    })
    .name;
