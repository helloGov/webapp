import angular from 'angular';

export default angular.module('helloGov')
.component('thanksPage', {
    template: require('./thanksPage.html'),
    controller: function($http, $location, constants) {
        'ngInject';
        // FIXME: less brittle way to get campaignId, but still not using Angular's router
        let campaignId = new URL($location.absUrl()).pathname.replace('/thank-you', '').replace(/[/]/g, '');

        $http.get(`${constants.API_ROOT}/campaigns/${campaignId}`)
            .then((resp) => {
                this.campaign = resp.data;
            });
    }
})
.name;
