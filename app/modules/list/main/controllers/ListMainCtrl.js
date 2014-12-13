define([
    'modules/list/main/module'
], function (module) {
    'use strict';

    module.controller('ListMainCtrl', ['$scope', '$routeParams', 'ListFactory', function($scope, $routeParams ,ListFactory) {

        $scope.$loading = true;
        ListFactory.get($routeParams);

        $scope.list = [
            {"id":1, "link":"/Каталог/Продажа-аренда/Дома/", "parent":0},
            {"id":2, "link":"/Каталог/Продажа-аренда/Дома/", "parent":0},
            {"id":5, "link":"/Каталог/Продажа-аренда/Дома/", "parent":0},
            {"id":4, "link":"/Каталог/Продажа-аренда/Дома/", "parent":0},
            {"id":8, "link":"/Каталог/Продажа-аренда/Дома/", "parent":0},
            {"id":7, "link":"/Каталог/Продажа-аренда/Дома/", "parent":0},
            {"id":10, "link":"/Каталог/Продажа-аренда/Дома/", "parent":0}
        ];

    }]);

});