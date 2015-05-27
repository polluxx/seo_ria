define([
    'modules/dashboard/comments/module',
    'alertify'
], function (module, alertify) {
    'use strict';

    module.controller('DashboardCommentsCtrl', ['$scope', '$rootScope', 'CommentsFactory', function($scope, $rootScope, CommentsFactory) {
        var params, countParams;


        $scope.makeReq = function() {
            $scope.$loading = true;
            $scope.waitingCount = 0;
            params = {
                search: "message",
                page: 0,            // show first page
                count: 5,          // count per page
                sorting: {
                    added: 'desc'     // initial sorting
                },
                doctype: "approved",
                project: $rootScope.currentProject.id
            }, countParams = angular.copy(params);

            // comments list
            CommentsFactory.list(params, function (response) {
                $scope.$loading = false;
                if(response.code != 200) {
                    alertify.error(response.message || "ошибка получения комментариев");
                    return;
                }
                $scope.comments = response.items.data;
            });
            // end

            // new count
            countParams.aggs = "doctype";
            countParams.count = 1;
            delete countParams.doctype;
            //end

            CommentsFactory.list(countParams, function (responseCount) {
                if(responseCount.code != 200 || !responseCount.items.aggs.length) return;

                $scope.waitingCount = responseCount.items.aggs[1].doc_count;
            });
        }

        $rootScope.$watch("currentProject.id", function() {
            if($rootScope.currentProject.id == undefined) return;

            $scope.makeReq();
        })

    }]);

});