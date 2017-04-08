import angular from 'angular';

export default angular.module('helloGov')
.controller('successController', function($scope, $location) {
    'ngInject';
    var urlSplit = $location.absUrl().split('=');
    $scope.shortid = urlSplit[1];
})
.name;
