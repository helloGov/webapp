import angular from 'angular';

export default angular.module('helloGov')
.controller('campaignController', function($scope, $http, $window, $location, constants) {
    'ngInject';
    $scope.formData = {};
    $http.get(`${constants.API_ROOT}/campaigns`, $scope.campaigns)
    .then(function(result) {
        $scope.campaigns = result.data;
    })
    .catch(function(data) {
        console.log('Error: ' + data);
    });

    $scope.createCampaign = function(publishFlag) {
        $scope.formData.publish = publishFlag;

        // if on an edit page, then grab the shortid from URL
        var urlSplit = $location.absUrl().split('/');
        if (urlSplit.indexOf('edit') !== -1) {
            $scope.formData.shortid = urlSplit[3];
        }

        $http.post(`${constants.API_ROOT}/campaigns`, $scope.formData)
            .then(function(result) {
                console.log(result.data);
                if (publishFlag) {
                    $window.location.href = '/campaignSuccess?shortid=' + result.data;
                } else {
                    $window.location.href = '/campaigns';
                }
            })
            .catch(function(data) {
                console.log('Error: ' + data);
            }
        );
    };
})
.name;
