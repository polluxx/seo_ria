define([
    'modules/post/drafts/module',
    'alertify'
], function (module, alertify) {
    'use strict';

    module.controller('PostDraftsCtrl', ['$scope', 'bzUser', 'bzConfig', 'ngTableParams', '$resource', 'PostFactory', '$location', '$rootScope', function($scope, bzUser, bzConfig, ngTableParams, $resource, PostFactory, $location, $rootScope) {
        //$routeParams.doctype = "planned";
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        $scope.format = 'yyyy-MM-dd';
        $scope.items = [];
        $rootScope.$watch("rubrics", function () {
            if($rootScope.rubrics == undefined) return;

            $scope.rubrics = $rootScope.rubrics;
        })


        var Api = $resource(bzConfig.api() + "/cm/postlist");

        $scope.linker = function(post) {
            $location.path("/post/add/"+post._id);
        }

        $scope.tableParams = new ngTableParams({
            search: "title",
            page: 1,            // show first page
            count: 10,          // count per page
            sorting: {
                added: 'desc'     // initial sorting
            },
            doctype: "draft",
            project: $rootScope.currentProject.id
        }, {
            total: 0,           // length of data
            getData: function($defer, params) {
                $scope.tableParams.$loading = true;
                // ajax request to api
                Api.get(params.url(), function(data) {
                    //$scope.tableParams.$loading = false;
                    params.total(data.items.total);
                    // set new data
                    $defer.resolve(data.items.data);
                });
            }
        });

        $scope.remove = function(id) {
            alertify.confirm("Удалить пост?", function(e) {
                if(!e) return;

                console.log(id);
            });
        }


        // DOC SAVE
        $scope.docUpdate = function(item) {
            console.log(item);
            PostFactory.send(item, function(resp) {
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