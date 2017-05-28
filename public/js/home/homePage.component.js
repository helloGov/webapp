import angular from 'angular';

export default angular.module('helloGov')
.component('homePage', {
    template: require('./homePage.html')
})
.name;
