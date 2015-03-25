define([
    'modules/storage/add/module',
    'alertify'
    //'angular-bootstrap'
], function (module, alertify) {
    'use strict';

    module.controller('StorageAddCtrl', ['$scope', 'bzUser', 'bzConfig', '$http', 'StorageFactory', '$location', '$routeParams', '$rootScope', function($scope, bzUser, bzConfig, $http, StorageFactory, $location, $routeParams, $rootScope) {
        $scope.files;
        $scope.$loading = false;

        $scope.idea = {};
        $scope.idea.doctype = 'active';
        $scope.idea.rubrics = [];
        $scope.idea.isNew = true;
        $scope.$loading = false;
        $scope.idea.pretitles = [];

        var userIndex, rubrics=[], pretitleItem;
        $rootScope.$watch("currentProject", function() {
            if($rootScope.currentProject == undefined) return;

            $scope.idea.project = $rootScope.currentProject.id;
        });

        //
        $rootScope.$watch("rubrics", function () {
            $scope.$loading = true;
            $scope.rubrics = $rootScope.rubrics;
            if($scope.rubrics == undefined) return;

            //$scope.idea.rubric = $rootScope.rubric = $scope.rubrics[0];
            $scope.$loading = false;
        });

        $rootScope.$watch("authors", function () {
            $scope.$loading = true;
            $scope.authors = $rootScope.authors;
            if($scope.authors == undefined || bzUser.userdata == undefined) return;

            function getUserIndex(element, index) {
                if(element.id == bzUser.userdata.id) {
                    return index;
                }
            }

            userIndex = $scope.authors.findIndex(getUserIndex);
            $scope.idea.author = $scope.idea.author || $scope.authors[userIndex];
            $scope.$loading = false;
        });



        function getPretitleIndex(element, index, needle) {
            if(element.title == needle.title) {
                return index;
            }
        }
        $scope.addPretitle = function(pretitle) {
            pretitle = pretitle.replace(/(^\s+|\s+$)/gi, "");
            pretitleItem = {title:pretitle};
            //$scope.idea.pretitles.findElm(getPretitleIndex, pretitleItem);
            if($scope.idea.pretitles.findElm(getPretitleIndex, pretitleItem) != -1 || !pretitle.length) return;


            $scope.idea.pretitles.push(pretitleItem);
        };

        document.querySelector(".add-pretitle").addEventListener("keypress", function(e) {
            var code = e.which || e.keyCode;

            if(code != 13) return;
            e.preventDefault();
            $scope.addPretitle(document.querySelector(".add-pretitle").value);

        });

        $scope.saveIdea = function() {
            //console.log($scope.idea);
            rubrics = [];
            $scope.idea.rubrics.forEach(function(item, index) {
                if(item === null || item === false) return;
                rubrics[index] = item;
            });
            $scope.idea.rubrics = rubrics;

            $scope.$loading = true;
            StorageFactory.send($scope.idea, function(resp) {
                $scope.$loading = false;
                if(resp.code != 200) {
                    alertify.error(resp.message);
                    $scope.errors = resp.errors || [];
                    return;
                }

                alertify.success("Добавлена идея");
                $location.path("/storage/list");
            })
        };

        $scope.openEv = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = true;
        };

        $scope.removePretitle = function(pretitle) {
            alertify.confirm("Удалить тайтл?", function (e) {
                if(!e) return;

                var indexPretitle = $scope.idea.pretitles.findElm(getPretitleIndex, pretitle);
                $scope.idea.pretitles.splice(indexPretitle, 1);
                $scope.$apply();
            });
        };

        $scope.getDoc = function() {
            StorageFactory.get({id:$routeParams.id}, function(resp) {
                $scope.$loading = false;
                if(resp.code != 200) {
                    alertify.error(resp.message);
                    return;
                }

                $scope.idea = resp.idea;
            })
        }

        if($routeParams.id != undefined) {
            $scope.getDoc();
        }
    }]);

});