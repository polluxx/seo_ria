define([
    'modules/post/list/module',
    'alertify'
], function (module, alertify) {
    'use strict';

    module.controller('UserListCtrl', ['$scope', 'bzUser', 'bzConfig', 'UserFactory', 'ngTableParams', '$resource', '$location', '$rootScope', function($scope, bzUser, bzConfig, UserFactory, ngTableParams, $resource, $location, $rootScope) {
        $scope.errors = [];
        $scope.userAdd = function(user, callback) {


            var userData = {};
            userData.email = user[0].value;
            userData.username = user[1].value;
            userData.password = user[2].value;
            userData.role = user[3].select.value.id;

            console.log(userData);
            UserFactory.send(userData, function(resp) {
                $scope.errors = [];
                if(resp.code != 200) {
                    alertify.error(resp.message);
                    $scope.errors = resp.errors;
                    return;
                }

                alertify.error(resp.message);
                $location.reload();

            });

        }

        $rootScope.$watch("roles", function() {
            console.log($rootScope.roles);
            console.log(typeof $rootScope.roles);
            if(!$rootScope.roles.length) return;

            $scope.selects = [
                {
                    name: "Роли",
                    value:$rootScope.roles[0],
                    options: $rootScope.roles
                }
            ];
        })

    }]);



});