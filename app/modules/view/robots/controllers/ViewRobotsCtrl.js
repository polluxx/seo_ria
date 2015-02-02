define([
    'modules/view/robots/module'
], function (module) {
    'use strict';


    module.controller('ViewRobotsCtrl', ['$scope', 'bzUser', '$routeParams', 'RobotsFactory', function($scope, bzUser, $routeParams, RobotsFactory) {
        $scope.robots = "";

        RobotsFactory.get($routeParams, function(resp) {
            if (resp.code == undefined || resp.code != 200) {
                // error
                return;
            }

            $scope.robots = resp.robots;
        });

        $scope.putData = function() {
            $routeParams['robots'] = $scope.robots;
            RobotsFactory.update($routeParams, function(resp) {
                console.log(resp);
            })
        }
    }]);

});