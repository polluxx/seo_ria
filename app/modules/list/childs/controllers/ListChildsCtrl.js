define([
    'modules/list/childs/module',
    'alertify'
], function (module, alertify) {
    'use strict';

    module.controller('ListChildsCtrl', ['$scope', 'bzUser', '$routeParams', 'ListFactory', '$rootScope', '$location', function($scope, bzUser, $routeParams, ListFactory, $rootScope, $location) {
        var normalized = "/childs/";
        $scope.isChild = true;
        $scope.maxSize = 5;
        $scope.bigTotalItems = 10;
        $scope.bigCurrentPage = $routeParams.page || "1";
        $scope.total = 1;
        $scope.radioModel = $routeParams.limit || "10";
        $routeParams.priority = 2; // set children priority

        $routeParams.project = $routeParams.project || $rootScope.currentProject;
        $scope.listData = {};
        //$scope.radioModel = '10';
        $scope.searchparams = {
            limit: +$scope.radioModel,
            project: $routeParams.project,
            page: +$scope.bigCurrentPage,
            priority: $routeParams.priority,
            parent: $routeParams.parent,
            search: "title"
        };


        $scope.listData.total = ($scope.searchparams.limit * $scope.searchparams.page) + 1;

        var paramsForCheck = ["filter", "filterType", "sorting", "sortingType"];
        paramsForCheck.forEach(function(param) {
            if($routeParams[param] != undefined) {
                $scope.searchparams[param] = $routeParams[param];
            }
        });
        if($routeParams.q != undefined || $rootScope.searchval != undefined) {
            $routeParams.q = $rootScope.searchval = $scope.searchparams.q =  "";
        }
        $scope.refresh = function(params, isSearch) {
            $scope.$loading = true;

            $location.search($scope.searchparams);

            ListFactory.childs($scope.searchparams, function (resp) {
                if ($rootScope.issearch == true) $rootScope.issearch = false;

                $scope.$loading = false;

                $scope.bigTotalItems = resp.data.pages;
                $scope.listData = resp.data;
            })
        };


        $scope.$watch("searchparams", function(newVal, oldVal) {

            //$routeParams = $scope.searchparams;
            $scope.refresh();
        }, true);

        $rootScope.$watch("issearch", function() {
            if (!$rootScope.issearch) return;

            delete $routeParams.view;
            $scope.searchparams.q = $rootScope.searchval;
        });

        $scope.$watch("bigCurrentPage", function() {
            $scope.searchparams.page = +$scope.bigCurrentPage;
        });

        $scope.$watch("radioModel", function() {
            $scope.searchparams.limit = +$scope.radioModel;
        });



        // check elements on sites
        $scope.startCheck = function(target, isParent) {
            ListFactory.check({path: target, target: $rootScope.domain, parent: isParent ? target : null}, function(resp) {

                if(resp.error !== undefined) {
                    alertify.error(resp.error);
                    return;
                }
                alertify.log("успешно поставлен в очередь на проверку");
            });
        }


    }]);

});