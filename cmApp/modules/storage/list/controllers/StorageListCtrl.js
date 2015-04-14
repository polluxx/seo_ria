define([
    'modules/storage/list/module',
    'alertify'
    //'angular-bootstrap'
], function (module, alertify) {
    'use strict';

    module.controller('StorageListCtrl', ['$scope', '$resource', 'bzConfig', 'ngTableParams', 'StorageFactory', '$location', '$routeParams', '$rootScope', 'PostFactory',  function($scope, $resource, bzConfig, ngTableParams, StorageFactory, $location, $routeParams, $rootScope, PostFactory) {

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
            "doctype[0]": "active",
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
                    console.log(data)
                    //$timeout(function() {
                    // update table params
                    params.total(data.ideas.total);
                    // set new data
                    $scope.ideas = data.ideas.data;
                    $scope.ideas[0].$show = true;
                    $defer.resolve(data.ideas.data);
                    //}, 500);
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

        $scope.removeIdea = function(id) {
            alertify.confirm("Удалить идею?", function(e) {
                if(!e) return;

                StorageFactory.remove({id:id}, function(response) {
                    if(response.code != 200) {
                        alertify.error(response.message);
                        return;
                    }
                    alertify.log(response.message);
                    $scope.list();
                })
            })
        }

        $scope.open = function(idea) {
            $scope.ideas.forEach(function(iItem) {
                iItem.$show = false;
            });
            idea.$show = true;
        };


        // RUBRICS
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
        //


        // doc UPDATE
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

        $scope.uploadPost = function(post, callback) {
            $scope.tableParams.$loading = true;
            PostFactory.send(post, function(resp) {
                $scope.tableParams.$loading = false;
                if(resp.code != 200) {
                    alertify.error(resp.message);
                    $scope.errors = resp.errors;
                    callback(resp.errors);
                    return;
                }
                alertify.success(resp.message);
                callback();
            })

        };


        $scope.toWork = function(pretitle, idea) {
            pretitle.workType = "inwork";
            //idea.doctype = "mixed";
            post.description = idea.description;
            post.title = pretitle.titles[0].value;
            post.rubric = pretitle.rubric;
            post.project = idea.project;
            post.doctype = "plan";
            post.isNew = true;

            post.author = idea.author;
            post.publication = {};
            post.publication.date = post.publication.time = pretitle.titles[1].value;

            $scope.uploadPost(post, function(response) {
                pretitle.$errors = response;
                if(response != undefined) return;

                $scope.ideaUpdate(idea);
            });

        };

        $scope.toArchive = function(idea) {
            alertify.confirm("В архив?", function(e) {
                if(!e) return;

                idea.pretitles.forEach(function(pre) {
                    if(pre.workType != undefined) return;

                    pre.workType = "inarchive";
                });
                $scope.ideaUpdate(idea);
                $scope.$apply();
            });

            //console.log(idea);
        };
        //
    }]);

});