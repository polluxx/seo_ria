define([
    'modules/post/add/module',
    'alertify',
    //'angular-bootstrap'
], function (module, alertify) {
    'use strict';

    module.controller('PostAddCtrl', ['$scope', 'bzUser', 'bzConfig', '$http', 'PostFactory', '$location', '$routeParams', '$rootScope', '$resource', '$templateCache', function($scope, bzUser, bzConfig, $http, PostFactory, $location, $routeParams, $rootScope, $resource, $templateCache) {
        $scope.files;
        $scope.$loading = false;
        $scope.$updating = false;

        $scope.doc = {};
        $scope.doc.doctype = 'draft';
        $scope.doc.isNew = true;
        $scope.doc.publication = {};
        $scope.doc.parameters = {};
        $scope.doc.sources = [];
        $scope.doc.parameters.subcategory = {};
        $scope.doc.publication.doctype = 'deferred';
        $scope.fileLoading = false;
        $scope.sourceItem = "";

        // widthes
        $scope.projectsArticleWidthes = {
            1: 940,
            2: 700,
            3: 640,
            5: 720
        };


        // DEEP OPTIONS
        $scope.tmp = {};
        $scope.params = {};
        $scope.autoTags = [];
        $scope.params.subcategories = [{id:'0', name:"Выберите категорию"}];
        $scope.params.defaultOptions = $scope.params.options = [{id:'0', name:"Выберите подкатегорию"}];
        $scope.doc.parameters.subcategory.id = $scope.params.subcategories[0];
        $scope.doc.parameters.option = $scope.params.options[0];


        var link = bzConfig.api()+"/cm/filtertypes",
            postInfoLink = bzConfig.api()+"/cm/informer",
            infoLink = bzConfig.api()+"/cm/informer";
        var params = {"json":true, "forDeep":true},
            subcategoryIndex = 0;



        //
        var svgshape = document.getElementById( 'notification-shape' );

        document.addEventListener( 'updating', function(e) {

            // create the notification
            var notification = new NotificationFx({
                wrapper : svgshape,
                message : '<p>Изменения сохранены</p>',
                layout : 'other',
                effect : 'loadingcircle',
                ttl : 7000,
                type : 'notice', // notice, warning or error
                onClose : function() {
                    //bttn.disabled = false;
                    return false;
                }
            });

            // show the notification
            notification.show();

            // disable the button (for demo purposes only)
            this.disabled = true;
        } );
        //



        $scope.$watch("doc.parameters.subcategory", function() {

            if(!$scope.doc.rubric ||
                !$scope.doc.parameters ||
                !$scope.doc.parameters.subcategory) return;

            if($scope.doc.parameters.subcategory.id === undefined) {
                //if($scope.doc.parameters.subcategory !== undefined) {
                //
                //    subcategoryIndex = $scope.params.subcategories.findElm(getArrayIndex, {id: +$scope.doc.articleInfo.subcategory});
                //    $scope.doc.parameters.subcategory = $scope.params.subcategories[subcategoryIndex] || $scope.params.subcategories[0];
                //}
                return;
            } else if($scope.doc.parameters.subcategory.id == 0) {
                $scope.params.options = $scope.params.defaultOptions;
                $scope.doc.parameters.option = $scope.params.options[0];
                return;
            }

            $scope.getParams({
                projectId:$scope.doc.project,
                option:+$scope.doc.parameters.subcategory.id,
                subcategory:+$scope.doc.rubric.id
            }, function(results) {
                //console.log(results);
                if(results == undefined) return;

                $scope.params.options = results;
                $scope.doc.parameters.option = !$scope.doc.parameters.option ? $scope.params.options[0] : getOption($scope.doc.parameters.option.id, $scope.params.options);

                //$scope.sendDataReq($scope.returnOptionsLink());
            });
        });
        function getOption(id, heap) {
            var index = heap.findElm(getArrayIndex, {id: +id});

            return ~index ? heap[index] : heap[0];
        }

        $scope.$watch("doc.rubric", function() {
            if(!$scope.doc.rubric || !$scope.doc.rubric.id) return;

            $rootScope.rubric = $scope.doc.rubric;

            // for subcat
            $scope.getParams({
                projectId:$scope.doc.project,
                subcategory:+$scope.doc.rubric.id
            }, function(results) {

                if(results == undefined) return;

                $scope.params.subcategories = results.map(function (item) {
                    return {id:item.subcategory, name:item.name};
                });

                if($scope.doc.parameters !== undefined && $scope.doc.parameters.subcategory != undefined) {
                    var indexid = $scope.doc.parameters.subcategory.id;
                    if(!$scope.doc.parameters.subcategory.id) indexid = $scope.doc.parameters.subcategory;
                    subcategoryIndex = $scope.params.subcategories.findElm(getArrayIndex, {id: indexid});
                }
                //if(!$scope.doc.articleInfo) $scope.doc.articleInfo = {};
                $scope.doc.parameters.subcategory = $scope.params.subcategories[subcategoryIndex] || $scope.params.subcategories[0];

                //$scope.sendDataReq();

            });
            // end subcat
        });

        //END

        //$scope.doc.project = $rootScope.currentProject.id;
        //$scope.rubrics = $rootScope.rubrics[$rootScope.currentProject.id];
        //$scope.authors = $rootScope.authors;
        var linkTo, linksTo = {draft:"drafts", planned:"list"}, userIndex, userData=["id", "name", "email"];

        $rootScope.$watch("currentProject", function() {
            if($rootScope.currentProject === undefined) return;

            $scope.doc.project = $rootScope.currentProject.id;
            $scope.getAutoTags($scope.doc.project);
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
        function getArrayIndex(element, index, needle) {
            if(+element.id === +needle.id) {
                //console.log(index);
                return index;
            }
        }
        //

        //

        var api = $resource(link, {}, {
                get: {
                    method: "GET",
                    url: link,
                    isArray: false
                },
                post: {
                    method: "POST",
                    url: postInfoLink,
                    isArray: false
                },
                informer: {
                    method: "GET",
                    url: infoLink,
                    isArray: false
                }
            }
        );
        $scope.getParams = function(inputParams, callback) {
            for(var param in params) {
                inputParams[param] = params[param];
            }

            api.get(inputParams, function(resp) {
                callback(resp.results);
            })
        };

        //

        $rootScope.$watch("authors", function () {
            //$scope.$loading = true;
            $scope.authors = $rootScope.authors;
            if($rootScope.authors == undefined || bzUser.userdata == undefined) return;

            userIndex = $rootScope.authors.findIndex(getUserIndex);

            $scope.doc.author = $rootScope.authors[userIndex];
            $scope.$loading = false;
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

            if($scope.doc.img.src) {
                if($scope.formddata === undefined) $scope.formddata = new FormData();
                $scope.formddata.append('src', $scope.doc.img.src);
                $scope.formddata.append('project', $rootScope.currentProject.id);
            }

            if($scope.doc.img.width) $scope.formddata.append('width', $scope.doc.img.width);
            if($scope.doc.img.height) $scope.formddata.append('height', $scope.doc.img.height);
            $scope.send($scope.formddata);
        };
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

        $scope.getAutoTags = function(project) {
            if(project != 1 || $scope.autoTags.length) return;

            PostFactory.tags(function(resp) {
                if(resp.code != 200) {
                    alertify.error("Ошибка получения тегов");
                    return;
                }

                $scope.autoTags = resp.items;
                $scope.tagName = $scope.autoTags[0];
            });
        };

        $scope.addTag = function (tag) {
            if(!tag || !tag.length || tag == 'Все') return;
            if($scope.doc.tags == undefined) {
                $scope.doc.tags = [];
            }

            if($scope.doc.tags.indexOf(tag) != -1) return;
            $scope.doc.tags.push(tag);
            $scope.tagItem = "";
            $scope.$apply();
        };
        $scope.removeTag = function(tag) {
            alertify.confirm("Удалить тег?", function(e) {
                if(!e) return;

                var index = $scope.doc.tags.indexOf(tag);

                $scope.doc.tags.splice(index,1);
                $scope.$digest();
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

        function cleanAdditionalData(data) {
            //console.log(data);
            data = data.replace(/<script id="loader".+><\/script>/g, "");

            // tweeter img replace auto styles
            data = data.replace(/(<img.*twitter.*)(style=".+")(.*>)/g, "$1style=\"position: absolute !important; padding: 0 !important;left: 10px;top: 10px;\"$3");


            // informer replacer
            data = data.replace(/(<div id="riainfo_[a-z0-9]+")((\n|.)+)(<script.+>)/g, "$1></div>$4");

            data += "<script id=\"loader\" src=\"https://cobrand.ria.com/js/partners/loader.js\"></script>";

            return data
        }

        $scope.docSave = function(auto) {

            if(!auto) {
                $scope.$loading = true;
                var updater = new Event('updated', {'detail': {times: 0}});
                document.dispatchEvent(updater);
            } else {
                $scope.doc.autoupdate = true;
                $scope.$updating = true;
                document.dispatchEvent(new Event('updating'));
            }

            //if($scope.doc.articleInfo !== undefined) {
            //    delete $scope.doc.articleInfo.option;
            //    delete $scope.doc.articleInfo.subcategory;
            //}



            // REGEXS
            var objToSend = Object.assign({}, $scope.doc);
            objToSend.text = cleanAdditionalData(objToSend.text);



            //
            objToSend.author = mapUserData($scope.doc.author);
            console.log(objToSend);


            PostFactory.send(objToSend, function(resp) {
                $scope.$loading = false;
                $scope.$updating = false;
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


                linkTo = linksTo[objToSend.doctype];

                if(!auto) {
                    alertify.success(resp.message);
                    $scope.doc = {};
                    $location.path("/post/"+linkTo);
                }

            });
            //console.log($scope.doc);
        };
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

        // SLIDER
        $scope.slide = function() {
            var defaultWidth = 640,
                articleWidth = $scope.projectsArticleWidthes[$scope.doc.project] || defaultWidth,
                slideBtn = angular.element(".add-resizer");


            if(slideBtn.hasClass('glyphicon-resize-full')) {
                slideBtn.removeClass('glyphicon-resize-full');
                slideBtn.addClass('glyphicon-resize-small', 'slided');

                angular.element('.right-add-block').addClass('inactive');
                angular.element('.left-add-block').css("width", articleWidth+"px");
                angular.element('.left-add-block').addClass("expanded");
            } else {
                slideBtn.removeClass('glyphicon-resize-small', 'slided');
                slideBtn.addClass('glyphicon-resize-full');

                angular.element('.right-add-block').removeClass('inactive');
                angular.element('.left-add-block').css("width", defaultWidth+"px");
                angular.element('.left-add-block').removeClass("expanded");
            }
        };


        // AUTOUPDATE
        $scope.autoupdate = function() {
            if(!$scope.doc.title || $scope.doc.title.length < 5) return;


            $scope.docSave(true);

            console.log('doc updating!');
        };


        // WATCHERS

        var emailInput = angular.element(document.getElementById("add-email"));
        emailInput.on("keypress", function(e) {
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

        // source
        $scope.addSource = function(source) {
            source = source.replace(/(^\s+|\s+$)/gi, "");

            if($scope.doc.sources.indexOf(source) != -1 || !source.length) return;

            $scope.doc.sources.push(source);
        };
        $scope.removeSource = function(source) {
            var index = $scope.doc.sources.indexOf(source);
            $scope.doc.sources.splice(index, 1);
            $scope.doc.sources = [].slice.call($scope.doc.sources);
            //$scope.$apply();
        };

        angular.element(".add-source").on("keypress", function(e) {
            var code = e.which || e.keyCode;

            if(code != 13) return;
            e.preventDefault();
            $scope.addSource(document.querySelector(".add-source").value);
            $scope.$apply();
            document.querySelector(".add-source").value = "";
        });

        //



        if($routeParams.id != undefined) {
            $scope.getDoc();
        }
    }]);

});