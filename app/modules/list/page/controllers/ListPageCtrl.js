define([
    'modules/list/page/module'
], function (module) {
    'use strict';

    module.controller('ListPageCtrl', ['$scope', 'bzUser', '$location', '$rootScope', 'localStorageService', function($scope, bzUser, $location, $rootScope, localStorageService) {
        var normalized = "/list/";



        $scope.projects = [
            {"id":1, "slang":"auto","name":"AUTO.ria.com"},
            {"id":2, "slang":"ria","name":"RIA.com"},
            {"id":3, "slang":"dom","name":"DOM.ria.com"},
            {"id":5, "slang":"market","name":"MARKET.ria.com"}
        ];

        $scope.login = function(user) {
            bzUser.$login(user);
        }

        $scope.choose = function(id) {

            $rootScope.currentProject = id;

            localStorageService.set('currentProject', $rootScope.currentProject);

            $location.path(normalized+id);
            $location.replace();
        }
    }]);

});