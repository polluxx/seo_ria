define([
    'modules/list/main/module',
    'angular-bootstrap-tpl',

], function (module) {
    'use strict';

    module.controller('ListMainCtrl', ['$scope', '$rootScope', '$routeParams', 'ListFactory', function($scope, $rootScope, $routeParams, ListFactory) {
        $scope.maxSize = 5;
        $scope.bigTotalItems = 10;
        $scope.bigCurrentPage = 1;
        $scope.total = 1;
        $scope.radioModel = '10';

        $scope.refresh = function(params, isSearch) {
            $scope.$loading = true;
            //$routeParams.page = 1;
            $routeParams.limit = +$scope.radioModel;
            if (params != undefined && params.page != undefined) {
                $routeParams.page = params.page;
            }

            $routeParams.project = $routeParams.id;


            if (params != undefined && params.q != undefined) {
                $routeParams.q = params.q;
            }

            ListFactory.get($routeParams, function(response) {
                if (isSearch == true) {
                    $rootScope.issearch = false;
                    //$rootScope.$apply();
                }
                $scope.$loading = false;
                if (response.code != 200) {
                    console.info(response.message);
                    //alertify.error(data.message || "Помилка доступу до сервіса. Спробуйте пізніше");
                }
                $scope.bigTotalItems = response.data.pages;
                $scope.total = response.data.total;
                console.log($scope.total)
                $rootScope.listData = response.data;
                //$rootScope.$apply();
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
            $scope.refresh()
        });


    }]);

});