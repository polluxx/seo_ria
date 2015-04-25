define([
    'modules/post/list/module',
    'alertify'
], function (module, alertify) {
    'use strict';

    module.controller('UserListCtrl', ['$scope', 'bzUser', 'bzConfig', 'UserFactory', 'ngTableParams', '$resource', '$route', '$rootScope', function($scope, bzUser, bzConfig, UserFactory, ngTableParams, $resource, $route, $rootScope) {
        $scope.errors = [];
        $scope.userAdd = function(user, callback) {


            var userData = {};
            userData.email = user[0].value;
            userData.username = user[1].value;
            userData.password = user[2].value;
            userData.role = $rootScope.roles[1].id;

            console.log(userData);
            UserFactory.send(userData, function(resp) {
                $scope.errors = [];
                if(resp.code != 200) {
                    alertify.error(resp.message);
                    $scope.errors = resp.errors;
                    return;
                }

                alertify.success(resp.message);
                $route.reload();

            });

        };
        $scope.addPermission = function(user) {
            $scope.selectedUser = angular.copy(user);


            var selector = angular.element(document.querySelector(".permission-list-wrap"));
            selector.addClass("active open");
        };

        $scope.confirm = function() {
            var permissions = [], permission, index;


            for(index in $scope.selectedUser.permissions) {

                if(!$scope.selectedUser.permissions.hasOwnProperty(index)) continue;

                permission = $scope.selectedUser.permissions[index];
                if(!permission) continue;

                permissions.push(index);
            }

            UserFactory.permission({userId: $scope.selectedUser.id, type:"add", permissions: permissions}, function(resp) {
                if(resp.code != 200) {
                    alertify.error(resp.message);
                    return;
                }
                alertify.success("Успешно изменены полномочия");
                $route.reload();
            })
        };

        $rootScope.$watch("authors", function() {
            $scope.users = $rootScope.authors;
        });


    }]);



});