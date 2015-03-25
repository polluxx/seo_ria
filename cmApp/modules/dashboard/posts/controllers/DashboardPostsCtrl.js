define([
    'modules/dashboard/posts/module',
    'alertify'
], function (module, alertify) {
    'use strict';

    module.controller('DashboardPostsCtrl', ['$scope', 'bzUser', 'DashboardFactory', '$rootScope', function($scope, bzUser, DashboardFactory, $rootScope) {
        var params = {};
        $scope.posts = [];
        $scope.$loading = false;

        $scope.getLastPosts = function(num) {
            if($rootScope.currentProject == undefined) return;

            $scope.$loading = true;
            params.limit = num;
            params.project = $rootScope.currentProject.id;
            params['sorting[updated]'] = 'desc';

            DashboardFactory.list(params, function(response) {
                $scope.$loading = false;
               if(response.code != 200) {
                   alertify.error(response.message);
                   return;
               }

                $scope.posts = response.items.data;
            });
        };

        $rootScope.$watch("currentProject", function() {
            if($rootScope.currentProject == undefined) return;

            $scope.getLastPosts(5);
        });
        $scope.getLastPosts(5);
    }]);

});