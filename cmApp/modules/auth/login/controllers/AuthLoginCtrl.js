define([
    'modules/auth/login/module'
], function (module) {
    'use strict';

    module.controller('AuthLoginCtrl', ['$scope', 'bzUser', '$location', function($scope, bzUser, $location) {
        $scope.errors = [];
        $scope.user = {};


        $scope.setErrors = function(errors) {
            $scope.errors = errors;
            //$scope.$apply();
            console.log(errors);
        };


        $scope.login = function(user) {
            bzUser.$login(user, function(resp) {
                if(resp.code != 200) {
                    console.log(resp);
                    $scope.setErrors(resp.errors);
                    return;
                }

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