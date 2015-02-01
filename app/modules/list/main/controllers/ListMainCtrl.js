define([
    'modules/list/main/module',
    'angular-bootstrap-tpl',

], function (module) {
    'use strict';

    module.controller('ListMainCtrl', ['$scope', '$rootScope', '$routeParams', 'ListFactory', function($scope, $rootScope, $routeParams, ListFactory) {
        $scope.maxSize = 5;
        $scope.bigTotalItems = 10;
        $scope.bigCurrentPage = 1;


        $scope.refresh = function(params, isSearch) {
            $scope.$loading = true;

            if (params.page != undefined) {
                $routeParams.page = params.page;
            }

            $routeParams.project = $routeParams.id;

            if (params.q != undefined) {
                $routeParams.q = params.q;
            }

            ListFactory.get($routeParams, function(response) {
                if (isSearch == true) {
                    $rootScope.issearch = false;
                    //$rootScope.$apply();
                }
                $scope.$loading = true;
                if (response.code != 200) {
                    console.info(response.message);
                    //alertify.error(data.message || "Помилка доступу до сервіса. Спробуйте пізніше");
                }
                $scope.bigTotalItems = response.data.pages;
                $rootScope.listData = response.data;
            });

        }

        $rootScope.$watch("issearch", function() {
            if (!$rootScope.issearch) return;
            $scope.refresh({q:$rootScope.searchval}, true)
        })

        $scope.$watch("bigCurrentPage", function() {
            $scope.refresh({page:$scope.bigCurrentPage})
        });



    }]);

});