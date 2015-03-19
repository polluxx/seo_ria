define([
    'modules/dashboard/main/module'
], function (module) {
    'use strict';

    module.controller('DashboardCtrl', ['$scope', 'bzUser', '$rootScope', 'localStorageService', function($scope, bzUser, $rootScope, localStorageService) {
        $scope.changeBoard = function() {
            $rootScope.boardType = !$rootScope.boardType;
            localStorageService.set('boardType', +$rootScope.boardType);
        }
    }]);

});