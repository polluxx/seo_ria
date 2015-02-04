define([
    'modules/view/robots/module',
    'alertify'
], function (module, alertify) {
    'use strict';


    module.controller('ViewRobotsCtrl', ['$scope', 'bzUser', '$routeParams', 'RobotsFactory', function($scope, bzUser, $routeParams, RobotsFactory) {
        $scope.robots = "";

        RobotsFactory.get($routeParams, function(resp) {
            if (resp.code == undefined || resp.code != 200) {
                // error
                alertify.error('помилка отримання файлу');
                return;
            }

            $scope.robots = resp.robots;
        });

        $scope.putData = function() {
            $routeParams['robots'] = $scope.robots;
            RobotsFactory.update($routeParams, function(resp) {
                if(resp.code != 200) {
                    alertify.error(resp.message);
                    return;
                }

                alertify.success('файл записано успішно');
            })
        }
    }]);

});