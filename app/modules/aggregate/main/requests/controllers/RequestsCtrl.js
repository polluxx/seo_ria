define([
    'modules/aggregate/main/requests/module'
], function (module) {
    'use strict';

    module.controller('RequestsCtrl', ['$scope', '$injector', 'bzUser', '$routeParams', function($scope, $injector, bzUser, $routeParams) {
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
