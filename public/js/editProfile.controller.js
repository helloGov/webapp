import angular from 'angular';

export default angular.module('helloGov')
.controller('editProfileController', function($scope) {
    'ngInject';
    // For image upload
    $scope.file_changed = function(element) {
        $scope.$apply(function() {
            var photofile = element.files[0];
            var reader = new FileReader();
            reader.onload = function() {
            // handle onload here
            };
            reader.readAsDataURL(photofile);
        });
    };
})
.name;
