define([
    'modules/list/childs/module'
], function (module) {
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

        $rootScope.listData = [];
        //$scope.radioModel = '10';


        $scope.searchparams = {};
        $scope.searchparams.priority = $routeParams.priority;
        $scope.searchparams.parent = $routeParams.parent;
        $scope.searchparams.limit = +$scope.radioModel;
        $scope.searchparams.project = $routeParams.project;
        $scope.searchparams.page = +$scope.bigCurrentPage;


        if($routeParams.q != undefined || $rootScope.searchval != undefined) {
            $routeParams.q = $rootScope.searchval = $scope.searchparams.q =  "";
        }

        $scope.refresh = function(params, isSearch) {
            $scope.$loading = true;

            $location.search($routeParams);

            ListFactory.childs($routeParams, function (resp) {
                if (isSearch == true) {
                    $rootScope.issearch = false;
                }
                $scope.$loading = false;

                $scope.bigTotalItems = resp.data.pages;
                $rootScope.listData = resp.data;
            })
        };


        $scope.$watch("searchparams", function(newVal, oldVal) {
            $routeParams = $scope.searchparams;
            $scope.refresh();
        }, true);

        $rootScope.$watch("issearch", function() {
            if (!$rootScope.issearch) return;

            $scope.searchparams.q = $rootScope.searchval;
        });

        $scope.$watch("bigCurrentPage", function() {
            $scope.searchparams.page = +$scope.bigCurrentPage;
        });

        $scope.$watch("radioModel", function() {
            $scope.searchparams.limit = +$scope.radioModel;
        });


    }]);

});