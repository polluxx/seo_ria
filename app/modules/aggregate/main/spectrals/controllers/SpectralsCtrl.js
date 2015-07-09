define([
    'modules/aggregate/main/spectrals/module'
], function (module) {
    'use strict';

    module.controller('SpectralsCtrl', ['$scope', '$injector', 'bzUser', '$routeParams', function($scope, $injector, bzUser, $routeParams) {
        //$injector.invoke(AggregateMainCtrl, this, {
        //    $scope: $scope
        //});
        // MODELS
        angular.extend($scope, {
            target: this.target || $routeParams.target,

        });

        // METHODS
        angular.extend($scope, {
            start: function() {

            }
        });
    }]);


});
