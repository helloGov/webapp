import angular from 'angular';

export default angular.module('helloGov')
    .component('campaignsList', {
        template: require('./campaigns-list.html'),
        controller: function ($location, $http, constants, $scope, $timeout) {
            'ngInject';
            let self = this;

            this.$onInit = function () {
                this.hostName = `${$location.protocol()}://${$location.host()}`;
                $scope.showClipboardText = {};// to track which campaign is showing clipboard text
                $scope.showComfirmFlags = {};// to track which campaign is being asked for delete confirmation
                if ($location.port()) {
                    this.hostName = `${this.hostName}:${$location.port()}`;
                }
                $http.get(`${constants.API_ROOT}/campaigns?sort=-createdAt`)
                    .then(function (result) {
                        self.campaigns = result.data;
                        self.campaigns.forEach(element => {
                            $scope.showClipboardText[element.id] = false; // initialize not showing clipboard text
                            $scope.showComfirmFlags[element.id] = false; // initialize not showing delete-confirm
                            $http.get(`${constants.API_ROOT}/events?campaignId=${element.id}`)
                            .then(function(result) {
                                element.analytics = result.data;
                            })
                            .catch(function(data) {
                                console.log(`Error:  ${JSON.stringify(data)}`);
                            });
                        });
                    })
                    .catch(function () {
                        self.error = 'There was an error getting your campaigns. Please try agan later.';
                    });
            };

            this.confirm = function (id) {
                $scope.showComfirmFlags[id] = true;
            }
            this.cancel = function (id) {
                $scope.showComfirmFlags[id] = false;
            }

            this.delete = function (campaignId) {
                $http.delete(`${constants.API_ROOT}/campaigns/${campaignId}`)
                    .then(() => {
                        self.campaigns = self.campaigns.filter(function (campaign) {
                            return campaign.id !== campaignId;
                        });
                    })
                    .catch(() => {
                        self.error = 'There was an error deleting your campaign. Please try again later.';
                    });
            };

            this.toggleClipboardText = function (campaignId) {
                $scope.showClipboardText[campaignId] = false;
                $timeout(function() {
                    $scope.showClipboardText[campaignId] = true;
                }, 10);
            };
        }
    })
    .name;
