import angular from 'angular';

export default angular.module('helloGov')
.controller('createController', function($scope, $http, $window, $location, constants) {
    'ngInject';

    $scope.createCampaign = function(publishFlag) {
        $scope.formData.publish = publishFlag;

        let isNew = true;

        // if on an edit page, then grab the shortid from URL
        var urlSplit = $location.absUrl().split('/');
        if (urlSplit.indexOf('edit') !== -1) {
            $scope.formData.shortid = urlSplit[urlSplit.length - 2];
            isNew = false;
        }

        if (isNew) {
            $http.post(`${constants.API_ROOT}/campaigns`, $scope.formData)
                .then(function(resp) {
                    if (publishFlag) {
                        $window.location.href = `${resp.data.result.url}/success`;
                    } else {
                        $window.location.href = '/campaigns';
                    }
                })
                .catch(function() {
                    $scope.error = 'There was an error creating your campaign. Please try again later.';
                });
        } else {
            $http.patch(`${constants.API_ROOT}/campaigns/${$scope.formData.shortid}`, $scope.formData)
                .then(function(resp) {
                    if (publishFlag) {
                        $window.location.href = `${resp.data.result.url}/success`;
                    } else {
                        $window.location.href = '/campaigns';
                    }
                })
                .catch(function() {
                    $scope.error = 'There was an error saving your campaign. Please try again later.';
                });
        }
    };
})
.name;
