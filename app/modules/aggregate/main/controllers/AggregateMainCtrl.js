define([
    'modules/aggregate/main/module'
], function (module) {
    'use strict';

    module.controller('AggregateMainCtrl', ['$scope', 'bzUser', '$routeParams', function($scope, bzUser, $routeParams) {
        $scope.target = $scope.target || $routeParams.target;
        console.log($scope.target);
    }]);
});
