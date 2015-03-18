define([
    'modules/auth/login/module'
], function (module) {
    'use strict';

    module.controller('AuthLoginCtrl', ['$scope', 'bzUser', '$location', '$rootScope', function($scope, bzUser, $location, $rootScope) {
        //$scope.errors = [];
        $scope.user = {};


        $scope.setErrors = function(errors) {
            $rootScope.errors = errors;
            //$rootScope.errors = [];
            $rootScope.$apply();
            console.log(errors);
        };


        $scope.login = function(user) {
            bzUser.$login(user, function(resp) {
                if(resp.code != 200) {
                    console.log(resp);
                    $scope.setErrors(resp.errors);
                    return;
                }
                $rootScope.errors = [];
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