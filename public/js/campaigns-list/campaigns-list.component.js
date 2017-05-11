import angular from 'angular';

export default angular.module('helloGov')
.component('campaignsList', {
    template: require('./campaigns-list.html'),
    controller: function($location, $http, constants) {
        'ngInject';
        let self = this;
        this.hostName = `${$location.protocol()}://${$location.host()}`;
        if ($location.port()) {
            this.hostName = `${this.hostName}:${$location.port()}`;
        }
        $http.get(`${constants.API_ROOT}/campaigns?sort=-createdAt`)
            .then(function(result) {
                self.campaigns = result.data;
            })
            .catch(function(data) {
                self.error = 'There was an error getting your campaigns. Please try agan later.';
            });
    }
})
.name;
