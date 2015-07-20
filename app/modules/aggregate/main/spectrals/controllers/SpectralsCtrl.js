define([
    'modules/aggregate/main/spectrals/module'
], function (module) {
    'use strict';

    module.controller('SpectralsCtrl', ['$scope', '$injector', 'bzUser', '$routeParams', '$location', function($scope, $injector, bzUser, $routeParams, $location) {
        //$injector.invoke(AggregateMainCtrl, this, {
        //    $scope: $scope
        //});
        // MODELS
        angular.extend($scope, {
            target: this.target || $routeParams.target,
            path: $location.path()
        });

        // METHODS
        angular.extend($scope, {
            start: function() {

            }
        });
    }]);


});
