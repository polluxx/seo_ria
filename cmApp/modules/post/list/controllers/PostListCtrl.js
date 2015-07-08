define([
    'modules/post/list/module',
    'alertify',
    //'angular-bootstrap-tpl'
], function (module, alertify) {
    'use strict';

    module.controller('PostListCtrl', ['$scope', 'bzUser', 'bzConfig', 'PostFactory', 'ngTableParams', '$resource', '$location', '$rootScope', '$routeParams', function($scope, bzUser, bzConfig, PostFactory, ngTableParams, $resource, $location, $rootScope, $routeParams) {

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        $scope.format = 'yyyy-MM-dd';
        $scope.items = [];

        $rootScope.$watch("rubrics", function () {
            if($rootScope.rubrics == undefined) return;

            $scope.rubrics = $rootScope.rubrics;
        });
        $rootScope.$watch("currentProject", function () {
            if($rootScope.currentProject == undefined) return;

            $scope.getData();
        });

        $scope.getData = function() {
            var Api = $resource(bzConfig.api() + "/cm/postlist");

            $scope.tableParams = new ngTableParams({
                search: "title",
                page: 1,            // show first page
                count: 10,          // count per page
                sorting: {
                    added: 'desc'     // initial sorting
                },
                'doctype[0]': "planned",
                'doctype[1]': "plan",
                'doctype[2]': "was_planned",
                project: $rootScope.currentProject.id
            }, {
                total: 0,           // length of data
                getData: function($defer, params) {
                    // ajax request to api
                    Api.get(params.url(), function(data) {

                        //$timeout(function() {
                        // update table params
                        params.total(data.items.total);
                        // set new data
                        $defer.resolve(data.items.data);
                        //}, 500);
                    });
                }
            });
        }


        $scope.remove = function(id) {
            alertify.confirm("Удалить пост?", function(e) {
                $location.replace();
                if(!e) return;

                PostFactory.remove({id:id}, function(resp) {
                    if(resp.code != 200) {
                        console.info(resp);

                        alertify.error("Ошибка удаления поста");
                    }

                    document.getElementById("list-item-"+id).remove();
                    //$location.replace();
                });

            });
        }


        // DOC SAVE
        $scope.docUpdate = function(item) {

            $scope.tableParams.$loading = true;
            PostFactory.send(item, function(resp) {
                $scope.tableParams.$loading = false;
                if(resp.code != 200) {
                    alertify.error(resp.message);
                    return;
                }
                alertify.success(resp.message);
            })
        }
        //

        // DATE
        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = true;
        };
        $scope.openPublication = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.openedPublication = true;
        };
        // END

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