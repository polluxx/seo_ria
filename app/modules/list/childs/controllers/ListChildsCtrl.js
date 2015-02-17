define([
    'modules/list/childs/module'
], function (module) {
    'use strict';

    module.controller('ListChildsCtrl', ['$scope', 'bzUser', '$routeParams', 'ListFactory', '$rootScope', function($scope, bzUser, $routeParams, ListFactory, $rootScope) {
        var normalized = "/childs/";
        $scope.isChild = true;
        $scope.maxSize = 5;
        $scope.bigTotalItems = 10;
        $scope.bigCurrentPage = 1;
        $routeParams.priority = 2; // set children priority

        console.log($routeParams)

        $rootScope.listData = [];
        $scope.radioModel = '10';

        $scope.refresh = function(params, isSearch) {
            $scope.$loading = true;
            $routeParams.limit = $scope.bigTotalItems;
            $routeParams.limit = +$scope.radioModel;

            if (params != undefined && params.page != undefined) {
                $routeParams.page = params.page;
            }

            if (params != undefined && params.q != undefined) {
                $routeParams.q = params.q;
            }

            ListFactory.childs($routeParams, function (resp) {
                if (isSearch == true) {
                    $rootScope.issearch = false;
                }
                $scope.$loading = false;

                $scope.bigTotalItems = resp.data.pages;
                $rootScope.listData = resp.data;
            })
        }


        $rootScope.$watch("issearch", function() {
            if (!$rootScope.issearch) return;
            $scope.refresh({q:$rootScope.searchval}, true);
        })
        $scope.$watch("bigCurrentPage", function() {
            $scope.refresh({page:$scope.bigCurrentPage});
        });
        $scope.$watch("radioModel", function() {
            $scope.refresh();
        });


    }]);

});