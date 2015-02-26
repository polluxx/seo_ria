define(['base/home/module'], function (module) {

    module.directive('rootItem', function($rootScope, localStorageService) {
        return {
            restrict:"A",
            link: function(scope, element, attrs) {
                $rootScope.currentProject = localStorageService.get("currentProject");
                var timeout = null, time = 0, secondTime = 0, currentText;
                $rootScope.searchval = "";
                $rootScope.issearch = false;
                $rootScope.listData = {};

                $rootScope.$watch("searchval", function() {
                    if ($rootScope.searchval.length < 3 && $rootScope.searchval.length >0 ) return;


                    currentText = $rootScope.searchval;
                    $rootScope.issearch = true;
                    //$rootScope.$apply();

                    /*time = performance.now();

                    if (timeout != null) return;

                    if (currentText != $rootScope.searchval) clearInterval(timeout);

                    timeout = setTimeout(function() {
                        currentText = $rootScope.searchval;
                        $rootScope.issearch = true;
                        $rootScope.$apply();
                        timeout = null;
                    }, 500);*/
                })
            }
        }
    });

    module.directive('changeble', function($compile, ViewFactory) {
        return {
            restrict:"A",
            scope:{
                changeble:"&",
                info: '=ngModel'
            },
            link: function(scope, element, attrs) {
                var items = [], replacement="";
                scope.rewrites = {};
                scope.checkVariables = function(text) {
                    if(text == undefined) return;

                    items = text.match(/(\[[_0-9a-zA-Zа-яА-Я]+\]|\{[a-zA-Zа-яА-Я]+\})/gi);


                    if(items == undefined) return;

                    element[0].disabled = true;


                    if(Object.keys(scope.rewrites).length == 0) {

                        // check if there is new vars that we can renew
                        var varsIn = false;
                        for(item in scope.rewrites) {
                            if(items.indexOf(scope.rewrites[item]) != -1) {
                                varsIn = true;
                                break;
                            }
                        }
                        if(!varsIn) return;
                        // end


                        scope.changeble({items:items, callback:function(response) {
                            scope.rewrites = response;
                            scope.setVariables(text, response);
                        }});
                    } else {
                        scope.setVariables(text, scope.rewrites);
                    }

                }

                scope.setVariables = function(text, response) {
                    for(itemResp in response) {
                        text = text.replace(itemResp, response[itemResp], "g");
                    }
                    element[0].value = text;
                    element[0].innerHTML = text;
                    element.text(text);

                    element[0].disabled = false;

                }

                scope.$watch("info", function() {

                    //console.log(scope.info)
                    scope.checkVariables(scope.info);
                    scope.setupSymbols();
                })

                var item = angular.element("<div></div>");
                scope.checkSymbols = function() {

                    item.addClass("symbolsLeft");

                    item.text("{{itemText}} symbols left");
                    //scope.$watch("info", function() {

                    //})
                    element.after(item);
                    $compile(item)(scope);
                }

                scope.setupSymbols = function() {
                    if(scope.info == undefined) {
                        return;
                    }

                    var left = scope.itemText = +attrs.symbolsLeft;
                    var res = "";

                    res = scope.info.replace(/\s/gi, "");

                    left = +attrs.symbolsLeft - res.length;

                    if (left <= 0) {
                        item.addClass("red");
                        element.parent().addClass("has-error");
                    } else {
                        item.removeClass("red");
                        element.parent().removeClass("has-error");
                    }

                    //if(left < 0) left = 0;
                    scope.itemText = left;
                }


                if(attrs.symbolsLeft != undefined) {
                    scope.checkSymbols();
                }
            }
        }
    });


    module.directive('validateInput', function() {
        return {
            restrict:"A",

            link: function(scope, element, attrs) {
                var error = false,
                    errorMess = "",
                    errorBlock;
                scope.$watch("validate", function() {

                    error = false;
                    if (scope.validate) {
                        switch(element[0].type) {
                            case "text":
                                value = element[0].value;
                                break;
                            case "textarea":
                                value = document.getElementById(element[0].id).value;
                                break;
                            default :
                                value = "";
                                break;
                        }

                        element.parent().find(".error-mess").remove();
                        if (value.length < 5) {
                            error = true;
                            errorMess = "Довжина значень блоку повинна бути більше 5 символів";
                            errorBlock = element.parent().append("<div class='error-mess'>"+errorMess+"</div>");
                        } else {
                            error = false;
                        }


                        if (scope.lang.$error == undefined) {
                            scope.lang.$error = 0;
                        }


                        if (error) {

                            scope.errors[element[0].id] = true;

                            scope.lang.$error++;
                            element.parent().addClass("has-error");
                            element.parent().removeClass("has-success");
                        } else {
                            delete(scope.errors[element[0].id]);
                            if (element.parent().hasClass("has-error")) {
                                if (scope.lang.$error != 0) scope.lang.$error--;
                            }

                            element.parent().removeClass("has-error");
                            element.parent().addClass("has-success");
                        }
                    }

                });
            }
        }
    })

    module.directive("keysearch", function() {
        return {
            restrict:"A",
            link: function(scope, element, attrs) {
                self = this;
                var inSearch = ["BUTTON", "BODY"];
                window.addEventListener("keypress", function(e) {
                    //e.preventDefault();
                    //if (document.activeElement.id != "mainSearch") return;
                    if (inSearch.indexOf(document.activeElement.tagName) == -1) return;

                    if (element[0].value.length == undefined) return;

                    element.focus();
                    if (element[0].value.length == 0) {
                        element.value = String.fromCharCode(e.keyCode);
                        //self.settings.searchText = self.$.searchLine.value;
                    }

                })


            }
        }
    })

    module.directive("savable", function(ListFactory) {
        return {
            restrict: "A",

            link: function(scope, element, attrs) {
                element.on("change", function() {
                    var loader = document.querySelector("#progress-circle").parentElement;
                    angular.element(loader).addClass("loading");
                    angular.element(loader).removeClass("hide");

                    var path = document.querySelector('#progress-circle path');
                    var length = path.getTotalLength();
                    // Clear any previous transition
                    path.style.transition = path.style.WebkitTransition =
                        'none';
// Set up the starting positions
                    path.style.strokeDasharray = length + ' ' + length;
                    path.style.strokeDashoffset = length;
                    path.getBoundingClientRect();
// Define our transition


                    ListFactory.update(scope.link, function(resp) {
                        path.style.transition = path.style.WebkitTransition =
                        'stroke-dashoffset 1.4s ease-in-out';
                        // Go!
                        path.style.strokeDashoffset = '0';

                        angular.element(path).on("webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd", function() {
                            angular.element(loader).removeClass("loading");
                            angular.element(loader).addClass("success");

                            setTimeout(function() {
                                angular.element(loader).removeClass("success");
                                angular.element(loader).addClass("hide");
                            }, 2000)
                        })

                        console.log(resp)
                    })
                })
            }
        }
    })

    module.directive('loadingContainer', function () {
        return {
            restrict: 'A',
            scope: false,
            link: function(scope, element, attrs) {
                var loadingLayer = angular.element('<div class="bz-loading"></div>');
                element.append(loadingLayer);
                element.addClass('bz-loading-container');
                scope.$watch(attrs.loadingContainer, function(value) {
                    loadingLayer.toggleClass('ng-hide', !value);
                });
            }
        };
    });

});