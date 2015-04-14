define([
    'modules/storage/list/module',
    'alertify'
    //'angular-bootstrap'
], function (module, alertify) {
    'use strict';

    module.controller('StorageArchiveCtrl', ['$scope', 'bzUser', 'bzConfig', '$http', 'StorageFactory', '$location', '$routeParams', '$rootScope', 'ngTableParams', '$resource', function($scope, bzUser, bzConfig, $http, StorageFactory, $location, $routeParams, $rootScope, ngTableParams, $resource) {
        $scope.$loading = false;
        $scope.archive = true;
        $scope.ideas = [];

        $scope.errors = [];

        $scope.q;
        $scope.params = $routeParams;

        if($scope.params.q !== undefined) {
            $scope.q = angular.copy($scope.params.q);
        }
        var params = {}, post = {};

        var Api = $resource(bzConfig.api() + "/cm/idea");
        $scope.tableParams = new ngTableParams({
            search: "title",
            page: 1,            // show first page
            count: 10,          // count per page
            sorting: {
                added: 'desc'     // initial sorting
            },
            "doctype[0]": "archived",
            "doctype[1]": "mixed",
            project: $scope.params.project,
            q: $scope.params.q
        }, {
            total: 0,           // length of data
            getData: function($defer, params) {
                $scope.tableParams.$loading = true;
                // ajax request to api
                Api.get(params.url(), function(data) {
                    $scope.tableParams.$loading = false;
                    params.total(data.ideas.total);
                    // set new data
                    $scope.ideas = data.ideas.data;
                    $scope.ideas[0].$show = true;

                    $defer.resolve(data.ideas.data);
                });
            }
        });
        $scope.tableParams.$loading = false;

        $scope.list = function() {
            params = {
                project: $scope.params.project,
                q: $scope.params.q
            };
            $scope.tableParams.parameters(params);
            $scope.tableParams.reload();
        };

        $scope.params = $routeParams;
        $scope.$watch("params", function() {
            $location.search($scope.params);
            $scope.list();
        }, true);
        $scope.search = function() {
            $scope.params.q = $scope.q;
            $scope.$apply();
        };

        $rootScope.$watch("currentProject", function() {
            if($rootScope.currentProject == undefined) return;

            $routeParams.project = $rootScope.currentProject.id;
            $location.search($routeParams);
        });

        $scope.open = function(idea) {
            $scope.ideas.forEach(function(iItem) {
                iItem.$show = false;
            });
            idea.$show = true;
        };

        $scope.rubricsList = function(items) {
            var keys = [], result=[], rubrics=[];
            items.forEach(function(item, index) {
                if(item === true) {
                    keys.push(index);
                    rubrics[index] = item;
                }
            });


            $rootScope.rubrics.forEach(function(rubric) {
                rubric.id = +rubric.id;
                if(keys.indexOf(rubric.id) != -1) {
                    result.push(rubric);
                }
            });
            return result;
        };


        $scope.ideaUpdate = function(idea) {
            idea.$loading = true;
            //$scope.$apply();

            StorageFactory.send(idea, function(resp) {
                //$scope.$loading = false;
                idea.$loading = false;
                //$scope.$apply();
                if(resp.code != 200) {
                    alertify.error(resp.message);
                    $scope.errors = resp.errors || [];
                    return;
                }
                $scope.list();
                alertify.success("Изменена идея");

            })

        };

        $scope.toList = function(pretitle, idea) {
            delete pretitle.workType;

            $scope.ideaUpdate(idea);
        };

    }]);

});