define(['base/home/module', 'alertify'], function (module, alertify) {

    module.directive('rootItem', function($rootScope, localStorageService) {
        return {
            restrict:"A",
            link: function(scope, element, attrs) {
                $rootScope.currentProject = localStorageService.get("currentProject");

                $rootScope.domains = {
                    1: "http://auto.ria.com",
                    2: "https://www.ria.com",
                    3: "http://dom.ria.com",
                    5: "https://market.ria.com"
                };
                $rootScope.domain = $rootScope.domains[$rootScope.currentProject];

                var timeout = null, time = 0, secondTime = 0, currentText;
                $rootScope.searchval = "";
                $rootScope.issearch = false;
                $rootScope.listData = {};
                //$rootScope.searchParams = {};

                var searchStr, interval, searchlength;

                scope.$watch("searchval", function() {
                    searchlength = $rootScope.searchval;
                    if($rootScope.searchval == undefined) return;
                    searchStr = $rootScope.searchval;

                    scope.makeSearch(searchStr);

                });

                scope.makeSearch = function(search) {
                    $rootScope.issearch = false;
                    interval = setTimeout(function() {
                        if(search.length == $rootScope.searchval.length) {

                            $rootScope.issearch = true;
                            //$rootScope.searchParams.q = $rootScope.searchval;
                            $rootScope.$apply();
                            clearTimeout(interval);
                        } else {
                            scope.makeSearch(search);
                        }

                        clearTimeout(interval);
                    }, 600);
                };


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

                    var rewrites = Object.getOwnPropertyNames(scope.rewrites);
                    if(rewrites.length == 0) {
                        scope.changeble({items:items, callback:function(response) {
                            scope.rewrites = response;
                            scope.setVariables(text, response);
                        }});
                    } else {
                        // check if there is new vars that we can renew
                        var varsIn = false;

                        rewrites.forEach(function(val) {
                            if(items.indexOf(val) != -1) {
                                varsIn = true;
                            }
                        });

                        if(!varsIn) {
                            element[0].disabled = false;
                            return;
                        }
                        // end
                        scope.setVariables(text, scope.rewrites);
                    }

                }

                scope.setVariables = function(text, response) {
                    for(itemResp in response) {
                        text = text.replace(itemResp, response[itemResp], "g");
                    }
                    element[0].disabled = false;
                    scope.info = text;
                    scope.$apply();
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

    module.directive('counterList', function() {
        return {
            restrict: "E",
            scope: {
                data: "=ngModel",
                all: " ="
            },
            templateUrl: "views/counterList.html",
            link: function(scope, element, attrs) {
                scope.name = attrs.name;
                switch(scope.data.priority) {
                    case 2:
                        scope.model = (scope.data['blocks'] != undefined && scope.data['blocks']['ru'][scope.name]) ? scope.data['blocks']['ru'][scope.name] : "";
                        break;
                    case 1:
                        scope.model = (scope.data['fill'] != undefined && scope.data['fill'][scope.name]) ? scope.data['fill'][scope.name] : 0;
                        break;
                    default:
                        scope.model = null;
                        break;
                }
            }
        }
    });

    module.directive('filterBlock', function(ListFactory) {
       return {
           restrict: "E",
           templateUrl: "views/filter.html",
           link: function(scope, element, attrs) {
               var bodyEl = document.body,
                   content = document.querySelector( '.main-list-wrap' ),
                   openbtn = document.getElementById( 'open-button' ),
                   closebtn = document.querySelector('.close-filter'),
                   isOpen = false;

               scope.isDeep = false;

               function initEvents() {
                   openbtn.addEventListener( 'click', toggleMenu );
                   if( closebtn ) {
                       closebtn.addEventListener( 'click', toggleMenu );
                   }

                   // close the menu element if the target it´s not the menu element or one of its descendants..
                   content.addEventListener( 'click', function(ev) {
                       var target = ev.target;
                       if( isOpen && target !== openbtn ) {
                           toggleMenu();
                       }
                   } );
               }

               function toggleMenu() {
                   if( isOpen ) {
                       classie.remove( bodyEl, 'show-menu' );
                   }
                   else {
                       classie.add( bodyEl, 'show-menu' );
                   }
                   isOpen = !isOpen;
               }

               initEvents();

               scope.blockdata = {
                   filters : {
                       name: "Filters",
                       type: "filter",
                       fields: [
                           {id:"title", name:"Title"},
                           {id:"description", name:"Description"},
                           {id:"h1", name:"H1"},
                           {id:"seotext", name:"Seo text"},
                           {id:"indexed", name:"Indexed"}
                       ],
                       types: [
                           {id:"exists", name:"Заполнено"},
                           {id:"missing", name:"Пусто"}
                       ],
                       $open: true
                   },
                   sorting : {
                       name: "Sorting",
                       type: "sorting",
                       fields: [
                           {id:"title", name:"Title"},
                           {id:"description", name:"Description"},
                           {id:"h1", name:"H1"},
                           {id:"seotext", name:"Seo text"},
                           {id:"indexed", name:"Indexed"}
                       ],
                       types: [
                           {id:"desc", name:"По убыванию"},
                           {id:"asc", name:"По возрастанию"}
                       ]
                   }
                };

               scope.switch = function(obj) {
                   for(var i in scope.blockdata) {
                       scope.blockdata[i].$open = false;
                   }
                   obj.$open = true;
                   scope.isDeep = false;
                   scope.blockdata.$grab = false;
               };

               scope.setData = function(item, type, parent) {
                   switch(type) {
                       case 'index':
                           scope.searchparams[parent.type] = item.id;

                           if(scope.searchparams[parent.type+"Type"] == undefined) {
                               scope.searchparams[parent.type+"Type"] = parent.types[0].id;
                           }
                           scope.isDeep = true;
                           break;
                       case 'type':
                           scope.searchparams[parent.type+"Type"] = item.id;
                           break;
                   }
               };

               scope.clear = function() {
                   var toremove = ["filter", "filterType", "sorting", "sortingType"];
                   toremove.forEach(function(remove) {
                       delete scope.searchparams[remove];
                   });
               };

               scope.grabSwitch = function() {
                   for(var i in scope.blockdata) {
                       scope.blockdata[i].$open = false;
                   }
                   scope.blockdata.$grab = true;
               };


               // EXPORTS search data
               scope.exportData = function() {
                   var email = document.getElementById("grab-data-email").value;
                   if(!email.length) return;

                   var emailCheck = new RegExp("[a-z0-9&_.]+@(?:[a-z0-9])+\.[a-z0-9]+");
                   if(!emailCheck.test(email)) {
                       alertify.error("Не валидный email");
                       return;
                   }

                   var params = {};
                   Object.assign(params, scope.searchparams);
                   params.email = email;
                   scope.$loadingSend = true;
                   ListFactory.export(params, function(response) {
                       scope.$loadingSend = false;
                       if(!response || response.code != 200) {
                           alertify.error(response.message || "Ошибка отправки письма");
                           return;
                       }
                       alertify.success(response.message);
                   })
               };
           }
       }
    });

    module.directive('aggHead', function() {
       return {
           restrict: "E",
           templateUrl: "views/aggregate/header.html"
       }
    });

});