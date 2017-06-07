import angular from 'angular';

export default angular.module('helloGov')
.component('createSuccessPage', {
    template: require('./createSuccessPage.html'),
    controller: function($http, $location, constants) {
        'ngInject';
        // FIXME: this is super brittle to get the campaignId like this, but we're not using angular's
        // routing so it's not possible to get it using angular yet
        let url = $location.absUrl();
        let urlSplit = url.split('/');
        let campaignId = urlSplit[urlSplit.length - 2];

        this.campaignFullUrl = url.replace('/success', '');
        $http.get(`${constants.API_ROOT}/campaigns/${campaignId}`)
            .then((resp) => {
                this.campaign = resp.data;
            });
    }
})
.name;
