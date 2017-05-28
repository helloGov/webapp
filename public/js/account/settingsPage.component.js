import angular from 'angular';

export default angular.module('helloGov')
.component('settingsPage', {
    template: require('./settingsPage.html'),
    controller: function($http, constants, currentUserId, $scope) {
        'ngInject';
        var self = this;

        function resetForm(form) {
            form.$setPristine();
            form.$setUntouched();

            self.profile = {};
        }

        this.profile = {};

        this.$onInit = function() {
            self.activeSetting = null;
            $http.get(`${constants.API_ROOT}/users/${currentUserId}`)
                .then((resp) => {
                    self.user = resp.data.result;
                });
        };

        this.editSetting = function(settingName) {
            // reset any open form
            if (self.activeSetting) {
                let formName = `${self.activeSetting}Form`;
                let form = $scope[formName];
                resetForm(form);
            }
            self.activeSetting = settingName;
        };

        this.cancel = function(form) {
            resetForm(form);
            self.activeSetting = null;
        };

        this.save = function(data, form) {
            $http.patch(`${constants.API_ROOT}/users/${currentUserId}`, data)
                .then((resp) => {
                    self.user = resp.data.result;
                    resetForm(form);
                    self.activeSetting = null;
                })
                .catch(() => {
                    self.error = 'There was an error saving your change. Please try again later.';
                });
        };

        this.updatePassword = function(data, form) {
            $http.put(`${constants.API_ROOT}/auth/password`, data)
                .then(() => {
                    resetForm(form);
                    self.activeSetting = null;
                })
                .catch(() => {
                    self.error = 'There was an error setting your password. Please try again later';
                });
        };

        // For image upload
        this.file_changed = function(element) {
            self.$apply(function() {
                var photofile = element.files[0];
                var reader = new FileReader();
                reader.onload = function() {
                // handle onload here
                };
                reader.readAsDataURL(photofile);
            });
        };
    }
})
.name;
