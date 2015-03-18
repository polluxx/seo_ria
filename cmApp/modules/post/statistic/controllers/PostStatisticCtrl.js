define([
    'modules/post/statistic/module'
], function (module) {
    'use strict';

    module.controller('PostStatisticCtrl', ['$scope', 'bzUser', 'ngTableParams', 'bzConfig', '$resource', '$rootScope', function($scope, bzUser, ngTableParams, bzConfig, $resource, $rootScope) {
        var Api = $resource(bzConfig.api() + "/cm/postlist");


        $scope.tableParams = new ngTableParams({
            search: "title",
            page: 1,            // show first page
            count: 10,          // count per page
            sorting: {
                added: 'desc'     // initial sorting
            },
            doctype: "planned",
            project: $rootScope.currentProject.id
        }, {
            total: 0,           // length of data
            getData: function($defer, params) {
                //$scope.tableParams.$loading = true;
                // ajax request to api
                Api.get(params.url(), function(data) {
                    //$scope.tableParams.$loading = false;
                    params.total(data.items.total);
                    // set new data
                    $defer.resolve(data.items.data);
                });
            }
        });

        $scope.search = function() {
            $scope.tableParams.parameters({q:$scope.tableParams.q});
            $scope.tableParams.reload();
        }

        $rootScope.$watch("currentProject", function() {
            if($rootScope.currentProject == undefined) return;

            $scope.tableParams.parameters({project:$rootScope.currentProject.id});
            $scope.tableParams.reload();
        });
    }]);

});