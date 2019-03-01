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
            let userState = null;
            for (let addressComponent of $scope.locDetails.address_components) {
                if ((addressComponent.types[0] === "country" && addressComponent.short_name === "PR") || addressComponent.types[0] === "administrative_area_level_1") {
                    userState = addressComponent.short_name;
                }
            }
            $http.get('/locateLegislator', { params: { address: address, latitude: latitude, longitude: longitude, campaignId: $scope.campaign } })
                .then(function (result) {
                    $scope.repFound = result.data.representativeFound;
                    $scope.repInfo = result.data.representativeInfo;
                    $scope.addrForm = false;
                    let legislatureLevel = result.data.campaign.legislature_level;

                    if (!["AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DC",
                        "DE", "FL", "GA", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA",
                        "MA", "MD", "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE",
                        "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "PR", "RI", "SC",
                        "SD", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY"].includes(userState)) {
                        $scope.stateOutOfRange = true;
                        $scope.addrForm = true;
                    } else if ((legislatureLevel.state_senate || legislatureLevel.state_assembly) && (userState !== result.data.campaign.state)) {
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
        $scope.stateOutOfRange = false;
    })
    .name;
