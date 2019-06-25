import angular from 'angular';

export default angular.module('helloGov')
.component('createSuccessPage', {
    template: require('./createSuccessPage.html'),
    controller: function($http, $location, constants) {
        'ngInject';
        // FIXME: less brittle way to get campaignId, but still not using Angular's router
        let url = new URL($location.absUrl());
        let campaignId = url.pathname.replace('/success', '').replace(/[/]/g, '');

        this.campaignFullUrl = url.href.replace('/success', '');
        $http.get(`${constants.API_ROOT}/campaigns/${campaignId}`)
            .then((resp) => {
                this.campaign = resp.data;
            });
    }
})
.name;
