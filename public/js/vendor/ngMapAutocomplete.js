(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ngMap = require('ng-map-autocomplete');

},{"ng-map-autocomplete":2}],2:[function(require,module,exports){
/*!
 The MIT License

 Copyright (c) 2014 Will Palahnuk

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */


/**
 * A directive for adding google places autocomplete to a text box
 * google places autocomplete info: https://developers.google.com/maps/documentation/javascript/places
 *
 * Usage:
 *
 * <input type="text"  ng-autocomplete ng-model="autocomplete" options="options" details="details/>
 *
 * + ng-model - autocomplete textbox value
 *
 * + details - more detailed autocomplete result, includes address parts, latlng, etc. (Optional)
 *
 * + options - configuration for the autocomplete (Optional)
 *
 *       + types: type,        String, values can be 'geocode', 'establishment', '(regions)', or '(cities)'
 *       + bounds: bounds,     Google maps LatLngBounds Object, biases results to bounds, but may return results outside these bounds
 *       + country: country    String, ISO 3166-1 Alpha-2 compatible country code. examples; 'ca', 'us', 'gb'
 *       + watchEnter:         Boolean, true; on Enter select top autocomplete result. false(default); enter ends autocomplete
 *
 * example:
 *
 *    options = {
 *        types: '(cities)',
 *        country: 'ca'
 *    }
<<<<<<< HEAD
**/

angular.module("ngMapAutocomplete", [])
    .directive('ngMapAutocomplete', [ '$timeout', function ($timeout) {
        return {
            require: 'ngModel',
            scope: {
                ngModel: '=ngModel',
                options: '=?',
                details: '=?'
            },
            link: function (scope, element, attrs, ngModel) {
                if (!ngModel) {
                    return;
                }// do nothing if no ng-model
                //options for autocomplete
                var opts;
                var watchEnter = false;

                //convert options provided to opts
                var initOpts = function () {

                    opts = {};
                    if (scope.options) {

                        watchEnter = scope.options.watchEnter === true;

                        if (scope.options.types) {
                            opts.types = [];
                            opts.types.push(scope.options.types);
                            scope.gPlace.setTypes(opts.types);
                        } else {
                            scope.gPlace.setTypes([]);
                        }

                        if (scope.options.bounds) {
                            opts.bounds = scope.options.bounds;
                            scope.gPlace.setBounds(opts.bounds);
                        } else {
                            scope.gPlace.setBounds(null);
                        }

                        if (scope.options.country) {
                            opts.componentRestrictions = {
                                country: scope.options.country
                            };
                            scope.gPlace.setComponentRestrictions(opts.componentRestrictions);
                        } else {
                            scope.gPlace.setComponentRestrictions(null);
                        }
                    }
                };

                if (scope.gPlace === undefined) {
                    scope.gPlace = new google.maps.places.Autocomplete(element[0], {});
                    if(ngModel) {
                        getPlace({name: ngModel});
                    }
                }

                google.maps.event.addListener(scope.gPlace, 'place_changed', function () {
                    var result = scope.gPlace.getPlace();
                    if (result !== undefined) {
                        if (result.address_components !== undefined) {
                            scope.$apply(function () {
                                scope.details = result;
                                scope.$emit('mapentrySelected', scope.details);
                                ngModel.$setViewValue(element.val());
                            });
                        }
                        else {
                            if (watchEnter) {
                                getPlace(result);
                            }
                        }
                    }
                });

/*                var applySelection = function() {
                    var result = scope.gPlace.getPlace();
                    console.log(scope.gPlace.getPlace());
                    if (true) {
                        if (true) {

                            scope.$apply(function () {
                                // scope.details = result;
                                // scope.details.description = element.val();
                                ngModel.$setViewValue(element.val());
                            });
                        }
                        else {
                            if (watchEnter) {
                                getPlace(result);
                            }
                        }
                    }
                };
                */
                // Watch enter and update autocomplete before sending
                element.bind("keydown keypress", function(event) {
                  if(event.which === 13) {
                    google.maps.event.trigger(scope.gPlace, 'place_changed');
                    return false;
                  }
                });

                //function to get retrieve the autocompletes first result using the AutocompleteService
                function getPlace(result) {
                    var autocompleteService = new google.maps.places.AutocompleteService();
                    if (result.name.length > 0) {
                        autocompleteService.getPlacePredictions(
                            {
                                input: result.name,
                                offset: result.name.length
                            },
                            function listentoresult(list, status) {
                                if (list === null || list.length === 0) {

                                    scope.$apply(function () {
                                        scope.details = null;
                                    });

                                } else {
                                    var placesService = new google.maps.places.PlacesService(element[0]);
                                    placesService.getDetails(
                                        {'reference': list[0].reference},
                                        function detailsresult(detailsResult, placesServiceStatus) {

                                            if (placesServiceStatus === google.maps.GeocoderStatus.OK) {
                                                scope.$apply(function () {
                                                    //detailsResult.formatted_address = list[0].description;
                                                    detailsResult.description = list[0].description;
                                                    ngModel.$setViewValue(detailsResult.formatted_address);
                                                    element.val(detailsResult.formatted_address);

                                                    scope.details = detailsResult;

                                                });
                                            }
                                        }
                                    );
                                }
                            });
                    }
                };

                ngModel.$render = function () {
                    var location = ngModel.$viewValue;
                    element.val(location);
                };

                //watch options provided to directive
                scope.watchOptions = function () {
                    return scope.options;
                };
                scope.$watch(scope.watchOptions, function () {
                    initOpts();
                }, true);

                //on focusout the value reverts, need to set it again.
                // with a timer to prevent maps event bug
                element.on('focusout', function (event) {
                    $timeout(function () {
                        element.val(ngModel.$viewValue);
                        event.preventDefault();
                    }, 2, false);
                    //    element.unbind('focusout');
                });
            }
        };
    }]);
},{}]},{},[1]);
