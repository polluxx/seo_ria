define([
    'modules/list/history/module',
    'angular-bootstrap-tpl',
    'alertify'

], function (module, bootstrap, alertify) {
    'use strict';

    module.controller('HistoryMainCtrl', ['$scope', '$rootScope', '$routeParams', 'HistoryFactory', '$location', function($scope, $rootScope, $routeParams, HistoryFactory, $location) {
        $scope.maxSize = 5;
        $scope.bigTotalItems = 10;
        $scope.bigCurrentPage = 1;
        //$scope.limit = 10;
        $rootScope.listData = [];
        $scope.radioModel = '10';

        $scope.refresh = function(params, isSearch) {
            $scope.$loading = true;

            $routeParams.limit = $scope.bigTotalItems;

            if (params.page != undefined) {
                $routeParams.page = params.page;
            }

            $routeParams.project = $routeParams.id;

            if (params.q != undefined) {
                $routeParams.q = params.q;
            }

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

        $rootScope.$watch("issearch", function() {
            if (!$rootScope.issearch) return;
            $scope.refresh({q:$rootScope.searchval}, true)
        })

        $scope.$watch("bigCurrentPage", function() {
            $scope.refresh({page:$scope.bigCurrentPage})
        });
        $scope.$watch("radioModel", function() {
            $scope.refresh();
        });



    }]);

});