import angular from 'angular';

export default angular.module('helloGov')
    .component('campaignsList', {
        template: require('./campaigns-list.html'),
        controller: function ($location, $http, constants, $scope) {
            'ngInject';
            let self = this;

            this.$onInit = function () {
                this.hostName = `${$location.protocol()}://${$location.host()}`;
                $scope.showComfirmFlags = {};// to track which campaign is being asked for delete confirmation
                if ($location.port()) {
                    this.hostName = `${this.hostName}:${$location.port()}`;
                }
                $http.get(`${constants.API_ROOT}/campaigns?sort=-createdAt`)
                    .then(function (result) {
                        self.campaigns = result.data;
                        self.campaigns.forEach(element => {
                            $scope.showComfirmFlags[element.id] = false; // initialize not showing delete-confirm
                        // $http.get(`${constants.API_ROOT}/events?campaignId=${$scope.campaignId}`, $scope.analytics)
                        // .then(function(result) {
                        //     $scope.analytics = result.data;
                        // })
                        // .catch(function(data) {
                        //     console.log(`Error:  ${JSON.stringify(data)}`);
                        });
                    })
                    .catch(function (data) {
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
        }
    })
    .name;
