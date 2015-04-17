define([
    'modules/list/main/module',
    'angular-bootstrap-tpl',

], function (module) {
    'use strict';

    module.controller('ListMainCtrl', ['$scope', '$rootScope', '$routeParams', 'ListFactory', '$location', function($scope, $rootScope, $routeParams, ListFactory, $location) {
        $scope.maxSize = 5;
        $scope.bigTotalItems = 10;

        $scope.bigCurrentPage = +$routeParams.page || "1";
        $scope.total = 1;
        $scope.radioModel = $routeParams.limit || "10";
        $scope.listData = {};
        $scope.searchparams = {
            limit: +$scope.radioModel,
            project: $routeParams.id,
            id: $routeParams.id,
            page: +$scope.bigCurrentPage
        };

        $scope.listData.total = ($scope.searchparams.limit * $scope.searchparams.page) + 1;

        var search;
        var paramsForCheck = ["filter", "filterType", "sorting", "sortingType"];
        paramsForCheck.forEach(function(param) {
            if($routeParams[param] != undefined) {
                $scope.searchparams[param] = $routeParams[param];
            }
        });
        if($routeParams.q != undefined) {
            $rootScope.searchval = $scope.searchparams.q =  $routeParams.q;
        }

        $routeParams = $scope.searchparams;

        $scope.refresh = function(params, isSearch) {
            $scope.$loading = true;
            //$routeParams.page = 1;

            $location.search($routeParams);

            ListFactory.get($routeParams, function(response) {
                if (isSearch == true) {
                    $rootScope.issearch = false;
                    //$rootScope.$apply();
                }
                $scope.$loading = false;
                if (response.code != 200) {

                    console.log(response);
                    return;
                    //alertify.error(data.message || "Помилка доступу до сервіса. Спробуйте пізніше");
                }
                $scope.bigTotalItems = response.data.pages;
                $scope.total = response.data.total;

                $scope.listData = response.data;
                //$rootScope.$apply();
            });

        };

        $scope.$watch("searchparams", function(newVal, oldVal) {
            //if($scope.searchparams == undefined) return;
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