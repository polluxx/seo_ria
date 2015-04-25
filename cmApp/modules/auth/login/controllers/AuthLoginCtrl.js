define([
    'modules/auth/login/module'
], function (module) {
    'use strict';

    module.controller('AuthLoginCtrl', ['$scope', 'bzUser', '$location', '$rootScope', function($scope, bzUser, $location, $rootScope) {
        $scope.errors = [];
        $scope.user = {};


        $scope.setErrors = function(errors) {
            $scope.errors = errors;
            //$rootScope.errors = [];
            console.log(errors);
        };


        $scope.login = function(user) {
            $rootScope.$loading = true;
            bzUser.$login(user, function(resp) {
                $rootScope.$loading = false;
                if(resp.code != 200) {
                    console.log(resp);
                    $scope.setErrors(resp.errors);
                    return;
                }
                //$rootScope.errors = [];
                $rootScope.signInBlock.toggle();

                bzUser.is_guest = false;

                $rootScope.$watch("links", function() {
                    if($rootScope.links == undefined) return;

                    var url = ($rootScope.links[0] == undefined) ? "" : $rootScope.links[0].url || $rootScope.links[0].content[0].url, redirect = url || "";
                    $location.path("/"+redirect);
                });

            });
        };

        $scope.logout = function() {
            bzUser.$logout(function() {
                $rootScope.panel.toggle();

                $location.path("/");
            });
        }
    }]);

});