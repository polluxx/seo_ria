define(['base/home/module', "jquery"], function (module, $) {

    module.directive("leftPanel", function($rootScope, $resource, bzConfig, localStorageService) {
        return {
            restrict: "E",
            templateUrl: "views/cm/leftPanel.html",
            link: function(scope, element, attrs) {


                $rootScope.roles = [
                    {id:1, "name":"админ"},
                    {id:2, "name":"автор"}
                ];

                $rootScope.formats = [
                    {id:1, name: "Статья"},
                    {id:2, name: "Инфографика"}
                ];

                $rootScope.priorities = [
                    {id:1, name: "Высокий"},
                    {id:2, name: "Средний"},
                    {id:3, name: "Низкий"}
                ];

                $rootScope.projects = [
                    {id:1, "name":"AUTO.ria"},
                    {id:2, "name":"RIA.com"},
                    {id:3, "name":"DOM.ria"},
                    {id:5, "name":"MARKET.ria"}
                ];

                $rootScope.fonts = [
                    {id:"'Open Sans', sans-serif", name:"Open Sans"},
                    {id:"'Lato', sans-serif", name:"Lato"},
                    {id:"'Bitter', serif", name:"Bitter"},
                    {id:"'Vollkorn', serif", name:"Vollkorn"},
                    {id:"Arial, Helvetica, sans-serif", name:"Arial, Helvetica, sans-serif"},
                    {id:"Times", name:"Times"},
                    {id:"Verdana", name:"Verdana"},
                    {id:"Tahoma", name:"Tahoma"},
                    {id:"monospace", name:"Monospace"},
                    {id:"sans-serif", name:"Sans-serif"}
                ];
                $rootScope.linesTypes = [
                    {id:"ridge", name:"Край"},
                    {id:"dotted", name:"Пунктир"},
                    {id:"dashed", name:"Штрих-пунктир"},
                    {id:"solid", name:"Цельная"},
                    {id:"double", name:"Двойная"},
                    {id:"groove", name:"Паз"}
                ];

                var currProject = localStorageService.get('currentProject');
                $rootScope.currentProject = currProject || $rootScope.projects[0];

                // DASHBOARD
                var boardType = localStorageService.get('boardType');
                $rootScope.boardType = (boardType != undefined) ? boardType : 1;
                // DASH END

                $rootScope.rubrics = [];

                var userMethod = $resource(bzConfig.api() + "/auth/userdata", {});
                scope.$loading = true;
                userMethod.get({}, function(resp) {
                    scope.$loading = false;
                    $rootScope.links = resp.items.links;
                    $rootScope.authors = resp.items.authors;
                    $rootScope.roles = resp.items.roles;
                    $rootScope.permissions = resp.items.all_permissions;
                    $rootScope.allRubrics = resp.items.rubrics;

                    //$rootScope.$apply();

                });


                $rootScope.$watch("allRubrics", function() {
                    if($rootScope.allRubrics == undefined) return;

                    $rootScope.rubrics = $rootScope.allRubrics[$rootScope.currentProject.id];
                });
                $rootScope.$watch("currentProject", function() {
                    if($rootScope.currentProject == undefined || $rootScope.allRubrics == undefined) return;

                    $rootScope.rubrics = $rootScope.allRubrics[$rootScope.currentProject.id];
                });

                scope.$watch("currentProject", function() {
                    $rootScope.currentProject = scope.currentProject;
                    localStorageService.set('currentProject', $rootScope.currentProject);
                });

                var docElem = window.document.documentElement, didScroll, scrollPosition,
                    container = document.getElementById( 'container' );

                // trick to prevent scrolling when opening/closing button
                function noScrollFn() {
                    window.scrollTo( scrollPosition ? scrollPosition.x : 0, scrollPosition ? scrollPosition.y : 0 );
                }

                function noScroll() {
                    window.removeEventListener( 'scroll', scrollHandler );
                    window.addEventListener( 'scroll', noScrollFn );
                }

                function scrollFn() {
                    window.addEventListener( 'scroll', scrollHandler );
                }

                function canScroll() {
                    window.removeEventListener( 'scroll', noScrollFn );
                    scrollFn();
                }

                function scrollHandler() {
                    if( !didScroll ) {
                        didScroll = true;
                        setTimeout( function() { scrollPage(); }, 60 );
                    }
                };

                function scrollPage() {
                    scrollPosition = { x : window.pageXOffset || docElem.scrollLeft, y : window.pageYOffset || docElem.scrollTop };
                    didScroll = false;
                };

                scrollFn();

                var el = document.querySelector( '.morph-button' );

                var panel = $rootScope.panel = new UIMorphingButton( el, {
                    closeEl : '.icon-close',
                    onBeforeOpen : function() {
                        // don't allow to scroll
                        noScroll();
                        // push main container
                        classie.addClass( container, 'pushed' );
                    },
                    onAfterOpen : function() {
                        // can scroll again
                        canScroll();
                        // add scroll class to main el
                        classie.addClass( el, 'scroll' );
                    },
                    onBeforeClose : function() {
                        // remove scroll class from main el
                        classie.removeClass( el, 'scroll' );
                        // don't allow to scroll
                        noScroll();
                        // push back main container
                        classie.removeClass( container, 'pushed' );
                    },
                    onAfterClose : function() {
                        // can scroll again
                        canScroll();
                    }
                } );

                var morphPanel = document.querySelector(".container");

                angular.element(morphPanel).on("mouseenter", function() {
                    if(panel.expanded) {
                        panel.toggle();
                    }
                });

                // add MORPHING MODAL
                [].slice.call( document.querySelectorAll( '.morph-button' ) ).forEach( function( bttn ) {
                    new UIMorphingButton( bttn, {
                        closeEl : '.icon-close',
                        onBeforeOpen : function() {
                            // don't allow to scroll
                            noScroll();
                        },
                        onAfterOpen : function() {
                            // can scroll again
                            canScroll();
                        },
                        onBeforeClose : function() {
                            // don't allow to scroll
                            noScroll();
                        },
                        onAfterClose : function() {
                            // can scroll again
                            canScroll();
                        }
                    } );
                } );

                [].slice.call( document.querySelectorAll( 'form button' ) ).forEach( function( bttn ) {
                    bttn.addEventListener( 'click', function( ev ) { ev.preventDefault(); } );
                } );
                // END
            }
        }
    });

    module.directive("searchable", function() {
        return {
            restrict: "A",
            scope: {
                search: "&searchable",
                q: "=ngModel"
            },
            link: function(scope) {
                var interval, searchStr = "";

                scope.$watch("q", function() {
                    if(scope.q == undefined) return;
                    searchStr = scope.q;

                    scope.makeSearch(searchStr);

                });

                scope.makeSearch = function(search) {

                    interval = setTimeout(function() {
                        if(search.length == scope.q.length) {
                            clearTimeout(interval);
                            scope.search();
                        } else {
                            scope.makeSearch(search);
                        }

                        clearTimeout(interval);
                    }, 300);
                }
            }
        }
    });

    module.directive("chengable", function() {
       return {
           restrict: "A",
           scope: {
               update: "&chengable"
           },
           link: function(scope, element, attrs) {

               element.on("change", function() {
                   scope.update();
               })
           }
       }
    });

    module.directive("morphBtn", function() {
       return {
           restrict: "E",
           templateUrl: "views/cm/morphBtn.html",
           scope: {
               fields: "=fields",
               errors: "=errors",
               update: "&update"
           },
           link: function(scope, element, attrs) {
               scope.dialog = {};
               if(scope.errors == undefined) {
                   scope.errors = [];
               }
               //var errorskeys;


               scope.openDial = function($event, field) {
                   //console.log(field);
                   $event.preventDefault();
                   $event.stopPropagation();
                   field.opened = true;
                   //scope.$apply();
               };

               scope.dialog.name = (attrs.name != undefined) ? attrs.name : "name";
               scope.dialog.btn = (attrs.btn != undefined) ? attrs.btn: "btn";
               scope.dialog.confirm = (attrs.confirm != undefined) ? attrs.confirm : "confirm";

                scope.confirm = function() {


                    scope.checkNone(scope.fields, function(errors) {
                        if(errors.length > 0) return;

                        scope.update();
                        morphB.toggle();
                    })


                }

               scope.checkNone = function(fields, callback) {
                   scope.errors = [];
                   fields.forEach(function(field, index) {
                        console.log(typeof field.value);
                       if(field.value === null || typeof field.value == "undefined" || field.value != undefined && field.value.length === 0) {
                           scope.errors[field.doctype] = ["должно быть значение"];
                           scope.errors.length++;
                       }
                   });

                   callback(scope.errors);
               }

               var docElem = window.document.documentElement, didScroll, scrollPosition;

               // trick to prevent scrolling when opening/closing button
               function noScrollFn() {
                   window.scrollTo( scrollPosition ? scrollPosition.x : 0, scrollPosition ? scrollPosition.y : 0 );
               }

               function noScroll() {
                   window.removeEventListener( 'scroll', scrollHandler );
                   window.addEventListener( 'scroll', noScrollFn );
               }

               function scrollFn() {
                   window.addEventListener( 'scroll', scrollHandler );
               }

               function canScroll() {
                   window.removeEventListener( 'scroll', noScrollFn );
                   scrollFn();
               }

               function scrollHandler() {
                   if( !didScroll ) {
                       didScroll = true;
                       setTimeout( function() { scrollPage(); }, 60 );
                   }
               };

               function scrollPage() {
                   scrollPosition = { x : window.pageXOffset || docElem.scrollLeft, y : window.pageYOffset || docElem.scrollTop };
                   didScroll = false;
               };

               scrollFn();

               var morphB = new UIMorphingButton( element.children()[0], {
                   closeEl : '.icon-close',
                   onBeforeOpen : function() {
                       // don't allow to scroll
                       noScroll();
                   },
                   onAfterOpen : function() {
                       // can scroll again
                       canScroll();
                   },
                   onBeforeClose : function() {
                       // don't allow to scroll
                       noScroll();
                   },
                   onAfterClose : function() {
                       // can scroll again
                       canScroll();
                   }
               } );

               element.children()[0].addEventListener( 'click', function( ev ) { ev.preventDefault(); } );
           }
       }
    });

    module.directive("postBlock", function($rootScope) {
        return {
            restrict:"E",
            templateUrl: "views/cm/postBlock.html",
            scope: {
                item: "=item",
                index: "=index"
            },
            link:function(scope, element, attrs) {
                var docElem = window.document.documentElement, didScroll, scrollPosition, binded = element.children().children();

                // trick to prevent scrolling when opening/closing button
                function noScrollFn() {
                    window.scrollTo( scrollPosition ? scrollPosition.x : 0, scrollPosition ? scrollPosition.y : 0 );
                }

                function noScroll() {
                    window.removeEventListener( 'scroll', scrollHandler );
                    window.addEventListener( 'scroll', noScrollFn );
                }

                function scrollFn() {
                    window.addEventListener( 'scroll', scrollHandler );
                }

                function canScroll() {
                    window.removeEventListener( 'scroll', noScrollFn );
                    scrollFn();
                }

                function scrollHandler() {
                    if( !didScroll ) {
                        didScroll = true;
                        setTimeout( function() { scrollPage(); }, 60 );
                    }
                };

                function scrollPage() {
                    scrollPosition = { x : window.pageXOffset || docElem.scrollLeft, y : window.pageYOffset || docElem.scrollTop };
                    didScroll = false;
                };

                scrollFn();


                var uibtn = new UIMorphingButton( binded[0], {
                    closeEl : '.icon-close',
                    onBeforeOpen : function() {
                        // don't allow to scroll
                        noScroll();
                    },
                    onAfterOpen : function() {
                        // can scroll again
                        canScroll();
                    },
                    onBeforeClose : function() {
                        // don't allow to scroll
                        noScroll();
                    },
                    onAfterClose : function() {
                        // can scroll again
                        canScroll();
                    }
                });

                if($rootScope.uibtns == undefined) $rootScope.uibtns = [];
                $rootScope.uibtns[scope.$id] = uibtn;



            }
        }
    })

    module.directive("dragPost", function($rootScope) {
        return {
            restrict: "A",
            link: function(scope, element, attrs) {

                element.bind("dragstart", function(e) {
                    //if(e.dataTransfer) {

                    e.dataTransfer.setData('postdata', JSON.stringify(scope.post));
                    $rootScope.uibtns[scope.$parent.$id].toggle();
                    $rootScope.$emit("LVL-DRAG-START");
                    //}

                });
                angular.element(element).attr("draggable", "true");

                element.bind("dragend", function(e) {
                    $rootScope.$emit("LVL-DRAG-END");
                });
            }
        }
    });

    module.directive("dragTarget", function() {
        return {
            restrict: "A",
            link: function(scope, element, attrs) {

                element.on("dragover", function(e) {
                    if (e.preventDefault) {
                        e.preventDefault(); // Necessary. Allows us to drop.
                    }

                    if(e.stopPropagation) {
                        e.stopPropagation();
                    }

                    e.dataTransfer.dropEffect = 'move';
                    return false;
                });

                element.on("dragenter", function(e) {
                    element.addClass("drag-in");
                });
                element.on("dragleave", function() {
                    element.removeClass("drag-in");
                });

                element.on("drop", function(event) {
                    if (event.preventDefault) {
                        event.preventDefault(); // Necessary. Allows us to drop.
                    }

                    if (event.stopPropogation) {
                        event.stopPropogation(); // Necessary. Allows us to drop.
                    }
                    element.removeClass("drag-in");

                    var postdata = JSON.parse(event.dataTransfer.getData("postdata"));

                    if(scope.dayItem.time == "nulled") return;
                    postdata.publication.date = scope.returnFormattedDate(new Date(scope.dayItem.time));
                    scope.updatePost(postdata);

                })
            }
        }
    });

    module.directive("informer", function($rootScope) {
       return {
           restrict: "E",
           templateUrl: "views/cm/post/informer.html",
           link: function(scope, element, attrs) {
               var docElem = window.document.documentElement, didScroll, scrollPosition, binded = element.children();
               scope.lines = $rootScope.linesTypes;
               // trick to prevent scrolling when opening/closing button
               function noScrollFn() {
                   window.scrollTo( scrollPosition ? scrollPosition.x : 0, scrollPosition ? scrollPosition.y : 0 );
               }

               function noScroll() {
                   window.removeEventListener( 'scroll', scrollHandler );
                   window.addEventListener( 'scroll', noScrollFn );
               }

               function scrollFn() {
                   window.addEventListener( 'scroll', scrollHandler );
               }

               function canScroll() {
                   window.removeEventListener( 'scroll', noScrollFn );
                   scrollFn();
               }

               function scrollHandler() {
                   if( !didScroll ) {
                       didScroll = true;
                       setTimeout( function() { scrollPage(); }, 60 );
                   }
               };

               function scrollPage() {
                   scrollPosition = { x : window.pageXOffset || docElem.scrollLeft, y : window.pageYOffset || docElem.scrollTop };
                   didScroll = false;
               };

               scrollFn();

               var el = document.querySelector( '.morph-button' );

               scope.informerBlock = new UIMorphingButton( binded[0], {
                   closeEl : '.icon-close',
                   onBeforeOpen : function() {
                       // don't allow to scroll
                       noScroll();
                   },
                   onAfterOpen : function() {
                       // can scroll again
                       canScroll();
                       // add class "noscroll" to body
                       classie.addClass( document.body, 'noscroll' );
                       // add scroll class to main el
                       classie.addClass( binded[0], 'scroll' );
                   },
                   onBeforeClose : function() {
                       // remove class "noscroll" to body
                       classie.removeClass( document.body, 'noscroll' );
                       // remove scroll class from main el
                       classie.removeClass( binded[0], 'scroll' );
                       // don't allow to scroll
                       noScroll();
                   },
                   onAfterClose : function() {
                       // can scroll again
                       canScroll();
                   }
               } );

               element.children()[0].addEventListener( 'click', function( ev ) { ev.preventDefault(); } );


           }
       }
    });



    module.directive('constructor', function() {
        return {
            restrict: 'A',
            //scope: false,
            scope: {
                model: "=ngModel",
                styles: "=",
                reload: "=",
                checkInfo: "&"
            },
            link: function(scope, element, attrs) {


                var log = [];
                scope.width = document.getElementById("riaBanner_width").value;

                //scope.styles[".tizer"]["width"] = "150px";
                scope.minWidth = 120;
                scope.maxWidth = 120;
                scope.lessItems = null;
                var self = this;


                var modelValue;
                scope.$watch("model", function() {
                    modelValue = scope.model;

                    if(typeof modelValue == "object") {
                        modelValue = modelValue.id;
                    }

                    //console.info(modelValue);

                    if(modelValue === false) return;

                    if(element[0].type == "checkbox") {
                        modelValue = attrs.optionval;
                    }

                    if(modelValue == undefined) return;

                    //console.log(modelValue);
                    scope.callData(attrs.id, modelValue);
                })


                scope.callData = function(id, value) {

                    scope.splitData(id, value);


                    var intercept = ["riaBanner_width","tizers_horisontal", "tizers_vertical"];
                    if (intercept.indexOf(id) != -1) scope.checkWidth(id);
                    scope.checkResultsNumber();
                }

                scope.splitData = function(id, value) {
                    var identity = id.split("_");
                    var element;
                    identity.forEach(function(item, num) {
                        if (num == 0) {
                            element = "."+item;
                            return false;
                        }

                        if (item == "link") {
                            element += " a";
                            return false;
                        }

                        if (item == "hover") {
                            //element += ":hover";
                            element = ".riaTizer:hover "+element;
                            return false;
                        }

                        item = item.replace(/([A-Z])/g, "-"+"$1").toLowerCase();
                        var valNumber = +value;
                        if (!isNaN(valNumber) && valNumber > 0) {
                            value = valNumber+"px";
                        }

                        if (!(scope.styles[element])) scope.styles[element] = {};
                        scope.styles[element][item] = value;
                        scope.setStyles();
                        //scope.reload = true;
                    });
                }

                scope.setStyles = function() {
                    var styles = scope.styles;

                    var allStylesStr = "";

                    for(var style in styles) {
                        var string = ".infoblock "+style+" {";
                        var substyles = styles[style];

                        for(var substyle in substyles) {
                            if(typeof substyles[substyle] === "function") continue;


                            string += substyle+":"+substyles[substyle]+";\n";
                        }
                        string += "} \n";

                        allStylesStr += string;
                    }

                    var stylesHtml = angular.element(document.getElementById("styles"));

                    stylesHtml[0].innerHTML = allStylesStr;


                    scope.changeElementsPosition();
                    //scope.setLogoImg();
                };

                scope.setLogoImg = function() {
                    var container = 0,
                        block,
                        vertical = 1,
                        vert;


                    var iblock = document.getElementsByClassName("riaViewBanner");
                    if(iblock == undefined || iblock[0] == undefined) return;

                    iblock[0].addEventListener("DOMNodeInserted", function (ev) {

                        block = document.getElementsByClassName("riaTizer");

                        if(block == undefined || block[0] == undefined) return;

                        container = block[0].offsetHeight;

                        vert = document.getElementById("tizers_vertical");
                        vertical = vert.options[vert.selectedIndex].text;
                        if (+vertical > 1 && +container > 120) {
                            container = 120;
                        }

                        if(container) {
                            var height = container + "px";
                            //angular.element(document.getElementById("riaLogoImg")).css("height", height);
                        }

                    }, false);

                }

                scope.changeElementsPosition = function() {
                    var width = document.getElementById("riaBanner_width").value;
                    var elm = angular.element(document.getElementById("addItemRia"));
                    if (+width > 240) {
                        elm.addClass("riaRight");
                    } else {
                        elm.removeClass("riaRight");
                    }

                }

                scope.checkWidth = function(id) {
                    var widthEl = document.getElementById("riaBanner_width");
                    var width = angular.element(widthEl);
                    var value = +widthEl.value;

                    if (isNaN(value)) value = 0;



                    var tizersH = document.getElementById("tizers_horisontal"),
                        tizers = tizersH.options[tizersH.selectedIndex].text;
                    var minWidth = scope.minWidth * tizers;

                    if(id != undefined && id == "riaBanner_width" && value < minWidth) return;

                    if (value < minWidth) {
                        var defWidth = scope.width;
                        if (defWidth < minWidth) {
                            defWidth = minWidth;
                        }
                        widthEl.value = defWidth;
                        scope.addPopup(width);

                        scope.splitData("riaBanner_width", defWidth);
                    }

                    if(scope.checkInfo != undefined) scope.checkInfo();

                    scope.reload = true;
                    //scope.checkResultsNumber();
                }

                scope.checkResultsNumber = function() {
                    var tizersH = document.getElementById("tizers_horisontal"),
                        tizersV = document.getElementById("tizers_vertical"),
                        tizers = tizersH.options[tizersH.selectedIndex].text,
                        number = tizers * tizersV.options[tizersV.selectedIndex].text;

                    if (scope.info == undefined) return;
                    var itemsCount = scope.info.length;


                    if (itemsCount < number) {
                        scope.lessItems = itemsCount;
                    } else {
                        scope.lessItems = null;
                    }


                    scope.$apply();
                }

                scope.addPopup = function(width) {
                    var hidden = angular.element(document.getElementById("widthError"));
                    hidden.removeClass("hide");
                    width.removeClass("show-error");
                    width.parent().removeClass("has-error");
                    width.addClass("show-error");
                    width.parent().addClass("has-error");
                    var interval = setInterval(function(){
                        width.removeClass("show-error");
                        width.parent().removeClass("has-error");
                        clearInterval(interval);
                        hidden.addClass("hide");
                    },5000);
                }

                scope.$watch("reload", function() {
                    if(scope.reload == undefined || !scope.reload) return;

                    scope.setStyles();
                    scope.reload = false;

                })
                //scope.changeData(element);

            }

        }
    });
    module.directive('project', function() {
        return {
            restrict: 'A',
            scope: false,
            link: function(scope, element, attrs) {
                var projects = ["Auto","Ria","Dom","Ria","Market", "Newbuildings"];

                element.addClass("ria"+projects[scope.info.project.id-1]);
            }
        }
    });
    module.directive('infoblock', function() {
        return {
            restrict: 'E',
            templateUrl: "views/cm/infoblock.html",
            link: function($scope) {
                $scope.$watch('informers', function(value) {
                    if (value != undefined) {
                        $scope.checkInfo();
                    }
                });

            }
        };
    });



    module.directive("fontBlock", function($rootScope) {
        return {
            restrict: "E",
            templateUrl: "views/cm/informerFontBlock.html",
            scope: {
                bcolor:"=bcolor",
                bdecoration:"=bdecoration",
                bweight:"=bweight",
                bstyle:"=bstyle",
                bsize:"=bsize",
                bfont:"=bfont",

                dcolor:"=",
                ddecoration:"=",
                dweight:"=",
                dstyle:"=",
                dsize:"=",
                dfont:"=",

                styles: "=",
                reload: "="
            },
            link: function(scope, element, attrs) {
                scope.fonts = $rootScope.fonts;

                scope.bcolor = scope.bcolor || scope.dcolor;
                scope.bdecoration = scope.bdecoration || scope.ddecoration || false;
                scope.bweight = scope.bweight || scope.dweight || false;
                scope.bstyle = scope.bstyle || scope.dstyle || false;
                scope.bsize = scope.bsize || scope.dsize;
                scope.bfont = scope.bfont || scope.dfont || scope.fonts[0];


                if(scope.bcolor!=undefined) scope.bcolor = "#"+scope.bcolor;
            }
        }
    })

    module.directive("signIn", function($rootScope) {
        return {
            restrict: "E",
            templateUrl: "views/cm/signIn.html",
            link: function(scope, element, attrs) {
                $rootScope.$loading = false;
                $rootScope.errors = [];

                var docElem = window.document.documentElement, didScroll, scrollPosition,
                    container = document.getElementById( 'container' );

                // trick to prevent scrolling when opening/closing button
                function noScrollFn() {
                    window.scrollTo( scrollPosition ? scrollPosition.x : 0, scrollPosition ? scrollPosition.y : 0 );
                }

                function noScroll() {
                    window.removeEventListener( 'scroll', scrollHandler );
                    window.addEventListener( 'scroll', noScrollFn );
                }

                function scrollFn() {
                    window.addEventListener( 'scroll', scrollHandler );
                }

                function canScroll() {
                    window.removeEventListener( 'scroll', noScrollFn );
                    scrollFn();
                }

                function scrollHandler() {
                    if( !didScroll ) {
                        didScroll = true;
                        setTimeout( function() { scrollPage(); }, 60 );
                    }
                };

                function scrollPage() {
                    scrollPosition = { x : window.pageXOffset || docElem.scrollLeft, y : window.pageYOffset || docElem.scrollTop };
                    didScroll = false;
                };

                scrollFn();

                $rootScope.signInBlock = new UIMorphingButton( element.children()[0], {
                    closeEl : '.icon-close',
                    onBeforeOpen : function() {
                        // don't allow to scroll
                        noScroll();
                        classie.addClass( container, 'pushed' );
                    },
                    onAfterOpen : function() {
                        // can scroll again
                        canScroll();
                    },
                    onBeforeClose : function() {
                        // don't allow to scroll
                        noScroll();
                        classie.removeClass( container, 'pushed' );
                    },
                    onAfterClose : function() {
                        // can scroll again
                        canScroll();
                    }
                } );

                element.children()[0].addEventListener( 'click', function( ev ) { ev.preventDefault(); } );
            }
        }
    })

    module.directive("preloaderImg", function() {
        return {
            restrict: "A",
            link: function(scope, element, attrs) {
                var image = document.getElementById(attrs.preloaderImg);
                //console.log(image)
                scope.$watch("data", function() {
                    if(scope.data == undefined) return;


                    image.disabled = true;
                    image.placeholder = "Загрузка...";
                    scope.data = undefined;
                })


            }
        }
    });

    module.directive('fileInput', ['$parse', function($parse) {
        return {
            restrict: 'A',
            scope: false,
            link: function(scope, elm, attrs) {
                //var image = document.getElementById(attrs.preloaderImg);
                elm.bind(
                    'change', function() {
                        $parse(attrs.fileInput)
                            .assign(scope, elm[0].files);
                        scope.$apply();

                    }
                )
            }
        }
    }]);

    module.directive('loadingContainer', function () {
        return {
            restrict: 'A',
            scope: false,
            link: function(scope, element, attrs) {
                var loadingLayer = angular.element('<div class="loading"></div>');
                element.append(loadingLayer);
                element.addClass('loading-container');
                scope.$watch(attrs.loadingContainer, function(value) {
                    loadingLayer.toggleClass('ng-hide', !value);
                });
            }
        };
    });



    /* !!! DASHBOARD !!! */

    module.directive('calendar', function() {
        return {
            restrict: "E",
            templateUrl: "views/cm/dashboard/calendar.html",
            link: function(scope, element, attrs) {

            }
        }
    });

    module.directive('statisticBoard', function() {
        return {
            restrict: "E",
            templateUrl: "views/cm/dashboard/statistic.html",
            link: function(scope, element, attrs) {

            }
        }
    });

    module.directive('postsBoard', function() {
        return {
            restrict: "E",
            templateUrl: "views/cm/dashboard/posts.html",
            link: function(scope, element, attrs) {

            }
        }
    });

    module.directive('commentsBoard', function() {
        return {
            restrict: "E",
            templateUrl: "views/cm/dashboard/comments.html",
            link: function(scope, element, attrs) {

            }
        }
    });

    module.directive('symbolsCheck', function($compile) {
        return {
            restrict: "A",
            scope: {
                model: "=ngModel"
            },
            link: function(scope, element, attrs) {
                scope.$watch("model", function() {
                    scope.setupSymbols();
                });

                var item = angular.element("<div></div>");
                scope.checkSymbols = function() {

                    item.addClass("symbolsLeft");

                    item.text("{{itemText}} symbols left");
                    //scope.$watch("info", function() {

                    //})
                    element.after(item);
                    $compile(item)(scope);
                };

                scope.setupSymbols = function() {
                    if(scope.model == undefined) {
                        return;
                    }

                    var text = angular.copy(scope.model);

                    var left = scope.itemText = +attrs.symbolsCheck;
                    var res = "";

                    res = text.replace(/\s/gi, "");

                    left = +attrs.symbolsCheck - res.length;

                    if (left <= 0) {
                        item.addClass("red");
                        element.parent().addClass("has-error");
                    } else {
                        item.removeClass("red");
                        element.parent().removeClass("has-error");
                    }

                    //if(left < 0) left = 0;
                    scope.itemText = left;
                };


                if(attrs.symbolsCheck != undefined) {
                    scope.checkSymbols();
                }
            }
        }
    });

    module.directive("editable", function(bzConfig, $rootScope) {
        return {
            restrict: "A",
            scope: {
                model: "=ngModel"
            },
            link: function(scope, element, attrs) {
                $('textarea#edit')
                    .on('editable.contentChanged editable.initialized', function (e, editor) {

                        scope.$watch("model", function() {
                            if(scope.model.lenght === 0) return;

                            editor.setHTML(scope.model);
                        });
                        //
                        scope.model = editor.cleanTags(editor.getHTML());
                    })
                    .editable({
                        inlineMode: false,
                        minHeight:200,
                        toolbarFixed: false,
                        crossDomain: true,
                        allowScript: true,
                        allowStyle: true,
                        paragraphy: false,
                        useClasses: false,
                        imageUploadURL: bzConfig.api()+"/cm/upload",
                        imageUploadParams: {project: $rootScope.currentProject.id},
                        buttons:["bold", "italic", "underline", "strikeThrough", "subscript", "superscript", "fontFamily", "fontSize", "color", "formatBlock", "blockStyle", "align", "insertOrderedList", "insertUnorderedList", "outdent", "indent", "createLink", "insertImage", "insertVideo", "table", "undo", "redo", "html", "insertHorizontalRule", "removeFormat", "fullscreen"]
                    });
                document.querySelector(".froala-box > div:last-child").remove();
            }
        }
    });

    module.directive("permissionsList", function($rootScope) {
        return {
            restrict: "E",
            templateUrl: "views/cm/permissions.html",
            link: function(scope, element, attrs) {
                $rootScope.$watch("permissions", function() {
                    if($rootScope.permissions == undefined) return;

                    scope.permissions = angular.copy($rootScope.permissions);
                });

                scope.$watch("selectedUser", function() {
                    if(scope.selectedUser == undefined) return;

                    scope.selectedUser.permissions = scope.formSelections(scope.selectedUser.permissions);
                });

                scope.formSelections = function(selections) {
                    if(selections == undefined) return {};

                    // if already processed
                    if(selections[0] == undefined) return selections;

                    selections = angular.copy(selections);
                    var result = {}, index, selection;
                    for(index in selections) {
                        selection = selections[index];

                        if(!selections.hasOwnProperty(index)) continue;

                        result[selection] = true;
                    }
                    return result;
                };

                scope.$watch("selectedUser.selectedAll", function() {
                    if(scope.permissions == undefined || scope.selectedUser == undefined || scope.selectedUser.selectedAll == undefined) return;

                    var i;
                    for(i in scope.formSelections(scope.permissions)) {
                        scope.selectedUser.permissions[i] = scope.selectedUser.selectedAll;
                    }
                    console.log(scope.permissions);
                    console.log(scope.selectedUser);
                });

                var selector = angular.element(document.querySelector(".permission-wrap-close")),
                    index, permission;
                selector.on("click", function() {
                    angular.element(element.children()[0]).removeClass("active open");
                });

                function findGruntItem(item, index) {
                    if(item.name == "grantEverything") {
                        return true;
                    }
                }

            }
        }
    });

    /* !!! END !!! */

});