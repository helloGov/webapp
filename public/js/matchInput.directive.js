import angular from 'angular';

export default angular.module('helloGov')
.directive('matchInput', function() {
    'ngInject';
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attrs, ctrl) {
            function check() {
                var el1 = scope.$eval(attrs.ngModel);
                var el2 = scope.$eval(attrs.matchInput);
                return el1 === el2;
            }

            scope.$watch(check, function(n) {
                ctrl.$setValidity('unique', n);
            });
        }
    };
})
.name;
