import angular from 'angular';

export default angular.module('helloGov')
.component('notFoundPage', {
    template: require('./404.html')
})
.name;
