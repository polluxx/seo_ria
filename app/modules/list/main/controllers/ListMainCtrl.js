define([
    'modules/list/main/module',
    'angular-bootstrap-tpl',

], function (module) {
    'use strict';

    module.controller('ListMainCtrl', ['$scope', '$rootScope', '$routeParams', 'ListFactory', '$location', function($scope, $rootScope, $routeParams, ListFactory, $location) {
        $scope.maxSize = 5;
        $scope.bigTotalItems = 10;
        $scope.bigCurrentPage = 1;
        $scope.total = 1;
        $scope.radioModel = '10';
        $rootScope.listData = [];

        $scope.searchparams = {};
        $scope.searchparams.limit = +$scope.radioModel;
        $scope.searchparams.project = $routeParams.id;
        $scope.searchparams.id = $routeParams.id;
        $scope.searchparams.page = $scope.bigCurrentPage;



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

                $rootScope.listData = response.data;
                //$rootScope.$apply();
            });

        };

        $scope.$watch('searchparams', function() {
            //if($scope.searchparams != undefined) return;
            console.log($scope.searchparams);
            $routeParams = $scope.searchparams;
            $scope.refresh();
        }, true);

        $rootScope.$watch("issearch", function() {
            if (!$rootScope.issearch) return;

            $scope.searchparams.q = $rootScope.searchval;
            //$scope.refresh({q:$rootScope.searchval}, true)
        });

        /*$scope.$watch("bigCurrentPage", function() {

            //$scope.refresh({page:$scope.bigCurrentPage})
            $scope.refresh({page:$scope.bigCurrentPage})
        });

        $scope.$watch("radioModel", function() {
            //$scope.refresh();
            $scope.refresh();
        });*/


    }]);

});