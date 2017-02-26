// public/js/core.js
var helloGov = angular.module('helloGov', ['ngMapAutocomplete', 'ngclipboard']).config(function($interpolateProvider){
        $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

helloGov.controller('visitorController', function ($scope, $http, $window, $location) {
    var urlSplit = $location.absUrl().split('/');
    $scope.campaign = urlSplit.pop();
    $scope.locResult = '';
    $scope.locOptions = null;
    $scope.locDetails = '';

    $scope.sendEvent = function(type){
        $http.post('/event', {type: type, campaign: $scope.campaign});
    }
    $scope.sendEvent('visit');
    $scope.update = function() {
        coordinates = {"latitude": $scope.locDetails.geometry.location.lat(),
                        "longitude": $scope.locDetails.geometry.location.lng()};

        $http.get('/locateLegislator', {params: coordinates})
        .then(function(result) {
            $scope.repFound = result.data.representativeFound;
            $scope.repInfo = result.data.representativeInfo;

            $scope.addrForm = false;
            if($scope.repFound) {
                $scope.repForm = true;
            } else {
                $scope.repNotFoundForm = true;
            }

        })
        .catch(function(data) {
            console.log(data);
        });
    }

    $scope.addrForm = true;
    $scope.repForm = false;
    $scope.repNotFoundForm = false;
});

helloGov.controller('campaignController', function ($scope, $http, $window, $location) {
    $scope.formData = {};
    $http.get('/campaignList', $scope.campaigns)
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
        if(urlSplit.indexOf("edit") != -1) {
            $scope.formData.shortid = urlSplit[3];
        }

        $http.post('/campaign/create', $scope.formData)
            .then(function(result) {
                console.log(result.data);
                if(publishFlag) {
                    $window.location.href = '/campaignSuccess?shortid='+result.data;
                } else {
                    $window.location.href = '/campaigns';
                }
            })
            .catch(function(data) {
                console.log('Error: ' + data);
            }
        );
    };

});

helloGov.controller('successController', function($scope, $location) {
    var urlSplit = $location.absUrl().split('=');
    $scope.shortid = urlSplit[1];
});


helloGov.controller('userController', function ($scope, $http, $window) {
    $scope.loginDetails = {};
    $scope.signupDetails = {};

    $scope.createAcct = function() {
        $window.location.href = '/signup';
    }

    $scope.signUp = function() {
        $http.post('/signup', $scope.signupDetails)
            .then(function(data) {
                $scope.signUpDetails = {};
                $scope.session = data;
                $window.location.href = '/';
                console.log(data);
            })
            .catch(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.login = function() {
        $http.post('/login', $scope.loginDetails)
            .then(function(data) {
                $scope.loginDetails = {};
                $scope.session = data;
                $window.location.href = '/';
                console.log(data);
            })
            .catch(function(data) {
                $('#login-message').html("Login failed");
            });
    };
});

helloGov.controller('analyticsController', function($scope, $http, $location) {
    var urlSplit = $location.absUrl().split('/');
    $scope.campaignId = urlSplit.pop();

    $http.get(`/api/campaign/${$scope.campaignId}`, $scope.campaign)
    .then(function(result) {
        console.log(`got analytics data: ${result.data}`);
        $scope.campaign = result.data;
    })
    .catch(function(data) {
        console.log(`Error:  ${JSON.stringify(data)}`);
    });
    
    $http.get(`/api/analytics/${$scope.campaignId}`, $scope.analytics)
    .then(function(result) {
        console.log(`got analytics data: ${result.data}`);
        $scope.analytics = result.data;
    })
    .catch(function(data) {
        console.log(`Error:  ${JSON.stringify(data)}`);
    });
});

