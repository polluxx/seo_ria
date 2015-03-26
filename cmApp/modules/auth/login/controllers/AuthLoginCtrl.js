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
                $rootScope.$apply();
                console.log(bzUser);
                $location.path('/dashboard');

            });
        };

        $scope.logout = function() {
            bzUser.$logout(function() {
                $location.path("/");
            });
        }
    }]);

});