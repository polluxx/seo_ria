define([
    'modules/comments/list/module',
    'alertify',
    //'angular-bootstrap-tpl'
], function (module, alertify) {
    'use strict';

    module.controller('CommentsListCtrl', ['$scope', 'bzUser', 'bzConfig', 'CommentsFactory', 'ngTableParams', '$resource', '$location', '$rootScope', function($scope, bzUser, bzConfig, CommentsFactory, ngTableParams, $resource, $location, $rootScope) {

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        $scope.format = 'yyyy-MM-dd';
        $scope.items = [];

        var Api = $resource(bzConfig.api() + "/cm/comment");

        $scope.tableParams = new ngTableParams({
            withArticle:true,
            search: "message",
            page: 0,            // show first page
            count: 10,          // count per page
            sorting: {
                added: 'desc'     // initial sorting
            },
            'doctype[0]': "waiting",
            'doctype[1]': "approved",
            //withArticle : true,
            project: $rootScope.currentProject.id
        }, {
            total: 0,           // length of data
            getData: function($defer, params) {
                // ajax request to api
                Api.get(params.url(), function(data) {
                    params.total(data.items.total);
                    // set new data
                    $defer.resolve(data.items.data);
                    //}, 500);
                });
            }
        });

        $scope.remove = function(id) {
            alertify.confirm("Удалить пост?", function(e) {
                $location.replace();
                if(!e) return;

                CommentsFactory.remove({id:id}, function(resp) {
                    if(resp.code != 200) {
                        console.info(resp);
                        alertify.error("Ошибка удаления поста");
                    }

                    alertify.success(resp.message);
                    $location.replace();
                });
            });
        }


        // DOC SAVE
        $scope.save = function(item) {
            item.project = $rootScope.currentProject.id;
            $scope.tableParams.$loading = true;
            CommentsFactory.send(item, function(resp) {
                $scope.tableParams.$loading = false;
                if(resp.code != 200) {
                    alertify.error(resp.message);
                    return;
                }
                alertify.success(resp.message);
            });
            item.$changed = false;
        };

        $scope.approve = function(item) {
            item.doctype = "approved";
            $scope.save(item);
        };
        //

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