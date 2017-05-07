import angular from 'angular';

export default angular.module('helloGov')
.controller('createController', function($scope, $http, $window, $location, constants) {
    'ngInject';

    $scope.createCampaign = function(publishFlag,preview2Flag,preview3Flag,preview4Flag) {
        $scope.formData.publish = publishFlag;
	$scope.formData.preview2 = preview2Flag;
	$scope.formData.preview2 = preview3Flag;
	$scope.formData.preview2 = preview4Flag;
	
        let isNew = true;

        // if on an edit page, then grab the shortid from URL
        var urlSplit = $location.absUrl().split('/');
        if (urlSplit.indexOf('edit') !== -1) {
            // FIXME: this is super brittle to get the campaignId like this, but we're not using angular's
            // routing so it's not possible to get it using angular yet
            $scope.formData.shortid = urlSplit[urlSplit.length - 2];
            isNew = false;
        }
	else {
	    if (urlSplit.indexOf('create2') !== -1) {
		$scope.formData.shortid = urlSplit[urlSplit.length - 2];
		isNew = false;
	    }
	    else {
		if (urlSplit.indexOf('create3') !== -1) {
		    $scope.formData.shortid = urlSplit[urlSplit.length - 2];
		    isNew = false;
		}
	    }
	}
	
        if (isNew) {
            $http.post(`${constants.API_ROOT}/campaigns`, $scope.formData)
                .then(function(resp) {
                    if (publishFlag) {
                        $window.location.href = `${resp.data.result.url}/success`;
                    } else {
			if (preview2Flag) {
			    $window.location.href = `${resp.data.result.url}/create2`;
			} else {
			    if (preview3Flag) {
			    $window.location.href = `${resp.data.result.url}/create3`;				
			    }
			    else {
				if (preview4Flag) {
				    $window.location.href = `${resp.data.result.url}/create4`;				
				}
				else {
				    $window.location.href = '/campaigns';
				}
			    }
			}
		    }
                })
                .catch(function() {
                    $scope.error = 'There was an error creating your campaign. Please try again later.';
                });
        } else { //do this if it's not new
            $http.patch(`${constants.API_ROOT}/campaigns/${$scope.formData.shortid}`, $scope.formData)
                .then(function(resp) {
                    if (publishFlag) {
                        $window.location.href = `${resp.data.result.url}/success`;
                    } else {
			if (preview2Flag) {
			    $window.location.href = `${resp.data.result.url}/create2`;
			} else {
			    if (preview3Flag) {
				$window.location.href = `${resp.data.result.url}/create3`;				
			    }
			    else {
				if (preview4Flag) {
				    $window.location.href = `${resp.data.result.url}/create4`;				
				}
				else {
				    $window.location.href = '/campaigns';
				}
			    }
			}
		    }
                })
                .catch(function() {
                    $scope.error = 'There was an error saving your campaign. Please try again later.';
                });
        }
    };
})
.name;
