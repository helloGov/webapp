import angular from 'angular';

export default angular.module('helloGov')
.component('errorPage', {
    template: require('./errorPage.html')
})
.name;
