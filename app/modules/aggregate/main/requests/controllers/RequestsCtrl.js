define([
    'modules/aggregate/main/requests/module'
], function (module) {
    'use strict';

    module.controller('RequestsCtrl', ['$scope', '$injector', 'bzUser', '$routeParams', '$location', function($scope, $injector, bzUser, $routeParams, $location) {
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
