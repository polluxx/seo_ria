define([
    'modules/list/history/module',
    'angular-bootstrap-tpl',
    'alertify'

], function (module, bootstrap, alertify) {
    'use strict';

    module.controller('HistoryMainCtrl', ['$scope', '$rootScope', '$routeParams', 'HistoryFactory', '$location', function($scope, $rootScope, $routeParams, HistoryFactory, $location) {
        $scope.maxSize = 5;
        $scope.bigTotalItems = 10;
        //$scope.limit = 10;
        $rootScope.listData = [];
        $scope.bigCurrentPage = $routeParams.page || "1";
        $scope.radioModel = $routeParams.limit || "10";

        $scope.searchparams = {};
        $scope.searchparams.limit = +$scope.radioModel;
        $scope.searchparams.project = $routeParams.id;
        $scope.searchparams.page = +$scope.bigCurrentPage;

        if($routeParams.q != undefined || $rootScope.searchval != undefined) {
            $routeParams.q = $rootScope.searchval = $scope.searchparams.q =  "";
        }

        $scope.refresh = function(params, isSearch) {
            $scope.$loading = true;


            $location.search($routeParams);

            HistoryFactory.get($routeParams, function(response) {
                if (isSearch == true) {
                    $rootScope.issearch = false;
                    //$rootScope.$apply();
                }
                $scope.$loading = false;
                if (response.code != 200) {

                    alertify.error(response.message || "Помилка доступу до сервіса. Спробуйте пізніше");
                }
                $scope.bigTotalItems = response.data.pages;
                $rootScope.listData = response.data;
            });

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