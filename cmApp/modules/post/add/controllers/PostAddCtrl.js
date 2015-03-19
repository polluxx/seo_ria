define([
    'modules/post/add/module',
    'alertify',
    //'angular-bootstrap'
], function (module, alertify) {
    'use strict';

    module.controller('PostAddCtrl', ['$scope', 'bzUser', 'bzConfig', '$http', 'PostFactory', '$location', '$routeParams', '$rootScope', function($scope, bzUser, bzConfig, $http, PostFactory, $location, $routeParams, $rootScope) {
        $scope.files;
        $scope.$loading = false;

        $scope.doc = {};
        $scope.doc.doctype = 'draft';
        $scope.doc.isNew = true;
        $scope.doc.publication = {};
        $scope.doc.publication.doctype = 'deferred';
        $scope.fileLoading = false;

        //$scope.doc.project = $rootScope.currentProject.id;
        //$scope.rubrics = $rootScope.rubrics[$rootScope.currentProject.id];
        //$scope.authors = $rootScope.authors;
        var linkTo, linksTo = {draft:"drafts", planned:"list"}, userIndex;

        $rootScope.$watch("currentProject", function() {
            if($rootScope.currentProject == undefined) return;

            $scope.doc.project = $rootScope.currentProject.id;
        });

        //
        $rootScope.$watch("rubrics", function () {
            $scope.$loading = true;
            $scope.rubrics = $rootScope.rubrics;
            if($scope.rubrics == undefined) return;

            $scope.doc.rubric = $rootScope.rubric = $scope.rubrics[0];
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
                //return -1;
            }

            userIndex = $scope.authors.findIndex(getUserIndex);
            $scope.doc.author = $scope.authors[userIndex];
            $scope.$loading = false;
        });

        $scope.$watch("doc.rubric", function() {
            $rootScope.rubric = $scope.doc.rubric;
        });



        $scope.$watch("files", function() {
            if($scope.files == undefined) return;

            angular.forEach($scope.files, function(file) {

                if (file.type == "application/x-trash") {
                    return false;
                }
                $scope.filesLength++;
                var formddata = new FormData();
                formddata.append('fileToUpload', file);
                $scope.fileLoading = true;
                $scope.send(formddata);
            });
        });

        $scope.send = function(form) {
            $http.post(bzConfig.api()+"/cm/upload", form, {
                headers:{"Content-Type":undefined},
                transformRequest:angular.identity
            })
            .success(function(resp) {
                $scope.fileLoading = false;
                if(resp.code != 200) {
                    alertify.error(resp.messageFull);
                    return;
                }

                if($scope.doc.img == undefined) {
                    $scope.doc.img = {};
                }
                $scope.doc.img.src = resp.file;
            })
            .error(function(resp) {
                $scope.fileLoading = false;
                alertify.error(resp.message != undefined ? resp.message : "ошибка загрузки");
                $scope.$apply();
            });
        }

        $scope.addTag = function (tag) {
            if($scope.doc.tags == undefined) {
                $scope.doc.tags = [];
            }

            if($scope.doc.tags.indexOf(tag) != -1) return;
            $scope.doc.tags.push(tag);
            $scope.tagItem = "";
        }
        $scope.removeTag = function(tag) {
            alertify.confirm("Удалить тег?", function(e) {
                if(!e) return;

                var index = $scope.doc.tags.indexOf(tag);
                $scope.doc.tags.splice(index,1);
                $scope.$apply();
            })
        }

        // DATE TIME
        $scope.today = function() {
            $scope.doc.publication.date = new Date();
        };
        $scope.today();

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = true;
        };
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        $scope.format = 'dd-MMMM-yyyy';
        $scope.doc.publication.time = new Date();
        $scope.hstep = 1;
        $scope.mstep = 5;
        $scope.ismeridian = false;
        // END

        $scope.getDoc = function () {
            $scope.$loading = true;
            PostFactory.get($routeParams, function(resp) {
                $scope.$loading = false;
                if(resp.code != 200) {
                    alertify.error("Документа не найдено");
                    $location.path("/post/list");
                    return;
                }

                $scope.doc = resp.doc;

                $scope.doc.publication.time = new Date(resp.doc.publication.datetime);
                $scope.doc.publication.date = new Date(resp.doc.publication.date);
            })
        }

        $scope.docSave = function() {
            $scope.$loading = true;
            PostFactory.send($scope.doc, function(resp) {
                if(resp.code != 200) {
                    $scope.errors = resp.errors;
                    alertify.error(resp.message);
                    return;
                }

                $scope.errors = [];
                if(resp.id == undefined) {
                    alertify.error("Ошибка добавления");
                    return;
                }
                $scope.$loading = false;
                alertify.success(resp.message);


                linkTo = linksTo[$scope.doc.doctype];
                $scope.doc = {};

                $location.path("/post/"+linkTo);
            });
            //console.log($scope.doc);
        }


        if($routeParams.id != undefined) {
            $scope.getDoc();
        }
    }]);

});