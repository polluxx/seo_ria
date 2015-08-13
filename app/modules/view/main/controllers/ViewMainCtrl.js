define([
    'modules/view/main/module',
    'alertify'
], function (module, alertify) {
    'use strict';

    module.controller('ViewMainCtrl', ['$scope', '$routeParams', 'ViewFactory', '$resource', '$rootScope', '$location', function($scope, $routeParams, ViewFactory, $resource, $rootScope, $location) {
        var variablesBlock,
            width;
        $scope.doc = {};
        $scope.$loading = true;
        $scope.langs = [{"id":1, "name":"ru"}, {"id":2, "name":"uk"}];

        $scope.getDoc = function() {
            $scope.$loading = true;
            ViewFactory.get($routeParams, function(resp) {
                $scope.$loading = false;
                if (resp.code == undefined || resp.code != 200) {
                    // error
                    alertify.error('помилка отримання данних');
                    return;
                }

                $scope.doc = resp.doc;

                $scope.variables = $scope.doc.vars;

                if($scope.doc.priority == 2) {
                    $scope.searchparams.parent = $scope.doc.parent;
                    $scope.searchparams.priority = $scope.doc.priority;
                }

            })
        };

        $scope.getDoc();

        console.log($rootScope);

        angular.extend($scope, {
            selectedLang : $scope.langs[0],
            variables : [{"id":1, "name":"Категорії"}, {"id":2, "name":"Типи"}, {"id":3, "name":"Регіон"}],
            selectedVarType : 0,
            dataCanSave : false,
            validate : false,
            rewriteItem : "",
            errors : [],
            varsRewrites : {},
            varsLoading : false,
            searchparams : {
                limit: 10,
                project: $rootScope.currentProject || $rootScope.searchParams.project
            },
            varsAll: {}
        });

        // clear search value
        $rootScope.searchval = "";

        $scope.langSelect = function(langID) {
            $scope.selectedLang = langID;
        }

        /*$scope.$watch("selectedLang", function() {
            console.log($scope.selectedLang)
        })*/

        $scope.slideIn = function(langId) {

            if(Object.keys($scope.varsRewrites).length == 0) {
                $scope.getVarsNames(function() {
                    setTimeout(function() {
                        console.log(langId);
                        $scope.slideMake(langId);
                    }, 1000);

                });
            } else {
                $scope.slideMake(langId);
            }

        }

        $scope.slideMake = function(langId){
            variablesBlock = angular.element(document.getElementById("view-variables-"+langId.id));
            width = variablesBlock[0].offsetWidth;
            variablesBlock.css("left","-"+width+"px");
        }

        $scope.slideOut = function(langId) {
            variablesBlock = angular.element(document.getElementById("view-variables-"+langId.id));
            variablesBlock.css("left","0px");
        }

        $scope.selectVars = function(variable) {
            $scope.selectedVarType = variable;

            window.prompt("Copy to clipboard: Ctrl+C, Enter", variable);
        }

        var interval = {};
        $scope.checkForRewrites = function (lang, callback) {

            if($scope.varsLoading) {
                interval = setTimeout(function() {
                    $scope.checkForRewrites(lang, callback);
                }, 200);
            } else if(Object.keys($scope.varsRewrites).length > 0) {
                //clearTimeout(interval);
                return callback($scope.getRewritesForLang(lang));
            } else {
                $scope.getVarsNames(function () {
                    callback($scope.getRewritesForLang(lang));
                });
            }
        };

        $scope.getRewritesForLang = function(lang) {
            return $scope.varsAll[lang];
        };

        $scope.checkData = function(items, lang, callback) {
            if(Object.keys($scope.varsRewrites).length > 0) {
                callback($scope.getRewritesForLang(lang));
            } else {
                $scope.checkForRewrites(lang, callback);
            }
        };


        // REWRITE

        $scope.addRewrite = function (rewriteItem) {

            var post = {rewrite:rewriteItem, type:"add", id:$scope.doc.link};

            $scope.rewriteItem = "";

            if($scope.doc.rewrites == undefined) {
                $scope.doc.rewrites = [];
            }
            $scope.doc.rewrites.push(post.rewrite);
            $scope.rewriteSend(post);
        }
        $scope.removeRewrite = function (rewriteItem) {

            alertify.confirm("are you sure?", function(e) {
                if(e) {
                    var post = {rewrite:rewriteItem, type:"remove", id:$scope.doc.link};

                    $scope.rewriteSend(post, function() {
                        $scope.getDoc();
                    });
                }
            })
        }

        $scope.rewriteSend = function(post, callback) {
            if(post.rewrite.length < 2) {
                alertify.error("rewrite length must be more than 2 symbols");
                return;
            }
            ViewFactory.rewrite(post, function(resp) {
                if(resp.code == undefined || resp.code != 200) {
                    alertify.error(resp.message || "error when sending rewrite");
                    return;
                }

                var message = post.type == "add" ? "added successfully" : "removed successfully";

                alertify.success(message);

                callback();
            });
        }

        // END

        $scope.saveData = function() {
            $scope.validate=true;
            $scope.dataCanSave=false;

            if ($scope.errors[0] != undefined) {

                return;
            }
            $scope.$loading = true;

            $scope.doc._id = $scope.doc.link;
            ViewFactory.update($scope.doc, function(resp) {
                $scope.$loading = false;
                if(!resp) {
                    alertify.error('помилка запису данних');
                    return;
                }
                alertify.success('данні успішно записані');
            });

        }

        $scope.getVarsNames = function(callback) {
            //console.log($scope.doc);
            if($scope.doc.vars == undefined || $scope.doc.vars.length == 0) {
                callback();
                return;
            }

            $scope.varsLoading = true;

            $routeParams.vars = JSON.stringify($scope.doc.vars);
            /*
            var link = "http://market.rest.ria.ua/seo/seo_example_for_param/"+vars;
            var rewrites = $resource(link, {}, {
                charge: {method:'GET', params:{charge:true}}
            });

            rewrites.query(function(resp) {
                console.log(resp);
            });*/


            ViewFactory.vars($routeParams, function(response) {
               //console.log(response);
                $scope.varsLoading = false;
               if(response.code == undefined || response.code != 200) {
                   alertify.error('помилка отримання змімнних з проекту');
                   return;
               }
                var rewriteArray = JSON.parse(response.vars);
                $scope.varsRewrites = rewriteArray;
                $scope.varsAll = {ru: rewriteArray, uk: response.varsUk !== undefined ? JSON.parse(response.varsUk) : rewriteArray};
                callback();
            });

        }

        // WATCHER SEARCH
        $rootScope.$watch("issearch", function() {

            if ($rootScope.issearch === false || !$rootScope.searchval.length) return;
            console.log($rootScope.issearch);
            var queryArray = [], index, root = $scope.searchparams.parent ? "childs" : "list", queryString = root+"/"+$scope.searchparams.project;
            $scope.searchparams.q = $rootScope.searchval;
            for(index in $scope.searchparams) {
                queryArray.push(index+"="+$scope.searchparams[index]);
            }

            $scope.searchparams.view = true;
            //queryString += queryArray.join("&");
            $location.path(queryString);
            $location.search($scope.searchparams);

            $scope.searchparams = {};
            $location.replace();
        });


    }]);

});