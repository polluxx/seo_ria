define([
    'modules/list/childs/module'
], function (module) {
    'use strict';

    module.controller('ListChildsCtrl', ['$scope', 'bzUser', '$location', function($scope, bzUser, $location) {
        var normalized = "/childs/";
        $scope.list = [
            {"id":1, "link":"/Каталог/Продажа-аренда/Дома/", "parent":2},
            {"id":2, "link":"/Каталог/Продажа-аренда/Дома/", "parent":2},
            {"id":5, "link":"/Каталог/Продажа-аренда/Дома/", "parent":2},
            {"id":4, "link":"/Каталог/Продажа-аренда/Дома/", "parent":2},
            {"id":8, "link":"/Каталог/Продажа-аренда/Дома/", "parent":2},
            {"id":7, "link":"/Каталог/Продажа-аренда/Дома/", "parent":2},
            {"id":10, "link":"/Каталог/Продажа-аренда/Дома/", "parent":2}
        ];
    }]);

});