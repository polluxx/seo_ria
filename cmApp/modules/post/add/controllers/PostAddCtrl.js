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
        var linkTo, linksTo = {draft:"drafts", planned:"list"}, userIndex, userData=["id", "name", "email"];

        $rootScope.$watch("currentProject", function() {
            if($rootScope.currentProject === undefined) return;

            $scope.doc.project = $rootScope.currentProject.id;
        });

        //
        $rootScope.$watch("rubrics", function () {
            $scope.$loading = true;
            $scope.rubrics = $rootScope.rubrics;
            if($scope.rubrics == undefined) return;

            var rubricIndex = 0;
            if($scope.doc !== undefined && $scope.doc.rubric !== undefined) {
                rubricIndex = $scope.rubrics.findIndex(getRubricIndex);
                if(!~rubricIndex) rubricIndex = 0;
            }

            $scope.doc.rubric = $rootScope.rubric = $scope.rubrics[rubricIndex];
            $scope.$loading = false;
        });

        // Helpers
        function getUserIndex(element, index) {
            if(element.id === bzUser.userdata.id) {
                return true; // IMPORTANT we must return NOT index, but TRUE if match found
            }
        }
        function getProjectIndex(elm, index) {
            if(elm.id === $scope.doc.project) {
                return true;
            }
        }
        function getRubricIndex(elm, index) {
            if(elm.id === $scope.doc.rubric.id) {
                return true;
            }
        }
        //

        $rootScope.$watch("authors", function () {
            //$scope.$loading = true;
            $scope.authors = $rootScope.authors;
            if($rootScope.authors == undefined || bzUser.userdata == undefined) return;

            userIndex = $rootScope.authors.findIndex(getUserIndex);

            $scope.doc.author = $rootScope.authors[userIndex];
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
                $scope.formddata = new FormData();

                $scope.formddata.append('project', $rootScope.currentProject.id);
                $scope.formddata.append('file', file);
            });
        });

        $scope.imageUpload = function() {
            $scope.fileLoading = true;
            if($scope.doc.img == undefined) {
                $scope.doc.img = {};
            }
            if($scope.doc.img.width) $scope.formddata.append('width', $scope.doc.img.width);
            if($scope.doc.img.height) $scope.formddata.append('height', $scope.doc.img.height);
            $scope.send($scope.formddata);
        }
        // END


        // UPLOAD PHOTO
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

                $scope.doc.img.src = resp.file;
                $scope.files = null;
                document.getElementById("filedata").value = null;
            })
            .error(function(resp) {
                $scope.fileLoading = false;
                alertify.error(resp.message != undefined ? resp.message : "ошибка загрузки");
                $scope.$apply();
            });
        };

        $scope.addTag = function (tag) {
            if($scope.doc.tags == undefined) {
                $scope.doc.tags = [];
            }

            if($scope.doc.tags.indexOf(tag) != -1) return;
            $scope.doc.tags.push(tag);
            $scope.tagItem = "";
        };
        $scope.removeTag = function(tag) {
            alertify.confirm("Удалить тег?", function(e) {
                if(!e) return;

                var index = $scope.doc.tags.indexOf(tag);
                $scope.doc.tags.splice(index,1);
                $scope.$apply();
            })
        };

        // DATE TIME
        $scope.today = function() {
            $scope.doc.publication.date = new Date();
        };
        $scope.today();
        function mapUserData(user) {
            for(var userindex in user) {
                if(!~userData.indexOf(userindex)) delete user[userindex];
            }
            return user;
        }

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

                $scope.doc.publication.doctype = $scope.doc.publication.doctype || 'deferred';
                if($scope.doc.doctype == "plan") {
                    $scope.doc.doctype = "planned";
                }

                //$scope.doc.rubric.id = $scope.doc.rubric.id+"";
                $scope.doc.publication.time = new Date(resp.doc.publication.datetime);
                $scope.doc.publication.date = new Date(resp.doc.publication.date);

                $scope.doc.author.id = +$scope.doc.author.id;

                var projectIndex = $rootScope.projects.findIndex(getProjectIndex);
                if(~projectIndex) $rootScope.currentProject = $rootScope.projects[projectIndex];
            })
        };

        $scope.docSave = function() {
            $scope.$loading = true;
            //console.log($scope.doc);
            $scope.doc.author = mapUserData($scope.doc.author);


            PostFactory.send($scope.doc, function(resp) {
                $scope.$loading = false;
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

                alertify.success(resp.message);


                linkTo = linksTo[$scope.doc.doctype];
                $scope.doc = {};

                $location.path("/post/"+linkTo);
            });
            //console.log($scope.doc);
        };


        $scope.$watch("doc.doctype", function() {
           if($rootScope.currentProject.id != 1 || $scope.doc.doctype !== "planned") return;

            $scope.doc.sendTo = [
                "anna.samoylenko@ria.com",
                "vitaliy.poberezkiy@ria.com"
            ];
        });
        $scope.removeEmail = function(email) {
            if($scope.doc.sendTo == undefined) return;

            alertify.confirm("Удалить email?", function(e) {
                if(!e) return;

                var index = $scope.doc.sendTo.indexOf(email);
                $scope.doc.sendTo.splice(index, 1);
                $scope.doc.sendTo = [].slice.call($scope.doc.sendTo);
                $scope.$apply();
            });
        };

        var emailInput = angular.element(document.getElementById("add-email"));
        emailInput.on("keydown", function(e) {
            // enter button code check
            if(e.keyCode != 13) return;
            e.preventDefault();

            var email = emailInput[0].value;
            // empty array emails check
            if($scope.doc.sendTo == undefined) $scope.doc.sendTo = [];
            // empty email check
            if(!email.length) return;
            // duplicate check
            if($scope.doc.sendTo.indexOf(email) != -1) return;

            $scope.doc.sendTo.push(emailInput[0].value);

            emailInput[0].value = "";
            $scope.$apply();
        });

        if($routeParams.id != undefined) {
            $scope.getDoc();
        }
    }]);

});