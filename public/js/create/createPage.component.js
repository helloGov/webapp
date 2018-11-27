import angular from 'angular';

export default angular.module('helloGov')
    .component('createPage', {
        template: require('./createPage.html'),
        controller: function ($http, constants, $location, $window, $scope) {
            'ngInject';
            let self = this;
            let isNew = true;
            $scope.federalSenateSelected = false;
            $scope.federalHouseSelected = false;
            $scope.stateSenateSelected = false;
            $scope.stateAssemblySelected = false;
            // FIXME: this is super brittle to get the campaignId like this, but we're not using angular's
            // routing so it's not possible to get it using angular yet
            let urlSplit = $location.absUrl().split('/');

            // if on an edit page, then grab the campaignId from URL
            if (urlSplit.indexOf('edit') !== -1) {
                var campaignId = urlSplit[urlSplit.length - 2];
                isNew = false;

                $http.get(`${constants.API_ROOT}/campaigns/${campaignId}`)
                    .then((resp) => {
                        self.campaign = resp.data;
                    })
                    .catch(() => {
                        $window.location.href = '/home';
                    });
            }

            $scope.federalLegislatureSelected = function () {
                return $scope.federalSenateSelected || $scope.federalHouseSelected;
            };

            $scope.stateLegislatureSelected = function () {
                return $scope.stateSenateSelected || $scope.stateAssemblySelected;
            };

            $scope.updateLegislatureSelection = function () {
                const checked = event.target.checked;
                switch (event.target.name) {
                case 'federal-senate':
                    $scope.federalSenateSelected = checked;
                    return;
                case 'federal-house':
                    $scope.federalHouseSelected = checked;
                    return;
                case 'state-senate':
                    $scope.stateSenateSelected = checked;
                    return;
                case 'state-assembly':
                    $scope.stateAssemblySelected = checked;
                }
            };

            this.saveCampaign = function (publishFlag) {
                self.campaign.publish = publishFlag;
                if (isNew) {
                    $http.post(`${constants.API_ROOT}/campaigns`, self.campaign)
                        .then(function (resp) {
                            if (publishFlag) {
                                $window.location.href = `${resp.data.result.url}/success`;
                            } else {
                                $window.location.href = '/home';
                            }
                        })
                        .catch(function () {
                            self.error = 'There was an error creating your campaign. Please try again later.';
                        });
                } else {
                    $http.patch(`${constants.API_ROOT}/campaigns/${campaignId}`, self.campaign)
                        .then(function (resp) {
                            if (publishFlag) {
                                $window.location.href = `${resp.data.result.url}/success`;
                            } else {
                                $window.location.href = '/home';
                            }
                        })
                        .catch(function () {
                            self.error = 'There was an error saving your campaign. Please try again later.';
                        });
                }
            };
        }
    })
    .name;
