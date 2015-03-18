define([
    'modules/post/informer/module',
    'alertify'
], function (module, alertify) {
    'use strict';

    module.controller('PostInformerCtrl', ['$scope', '$resource', 'bzConfig', '$rootScope', 'localStorageService', '$compile', '$routeParams', function($scope, $resource, bzConfig, $rootScope, localStorageService, $compile, $routeParams) {
        $scope.styles = [];
        var cobrandLink = "http://cobrand.ria.local";
        $scope.reload = false;
        $scope.minWidth = 120;
        $scope.maxWidth = 120;

        $scope.info = {};
        $scope.params = {};
        $scope.info.project = $rootScope.currentProject;
        $scope.info.clientUrl = $scope.info.project.name;
        $scope.info.category = [{id:0, name:"Выберите категорию"}];

        $scope.axises = [{id:1, name:"Горизонтальное"},{id:2, name:"Вертикальное"}];

        $scope.tizersNum = [];
        for(var i=1;i<11;i++) {
            $scope.tizersNum.push({id:i, name:i});
        }

        $rootScope.$watch("rubric", function () {
            $scope.info.category = $rootScope.rubric;
        });


        $rootScope.$watch("currentProject", function() {
            $scope.info.project = $rootScope.currentProject;
            $scope.info.clientUrl = $scope.info.project.name;
        });

        $scope.params.subcategories = [{id:0, name:"Выберите категорию"}];
        $scope.params.options = [{id:0, name:"Выберите подкатегорию"}];
        $scope.info.subcategory = $scope.params.subcategories[0];
        $scope.info.option = $scope.params.options[0];


        // SETUP DEFAULT FILTERS
        $scope.info.filters = {};
        $scope.info.filters.tizers_horisontal = $scope.tizersNum[0];
        $scope.info.filters.tizers_vertical = $scope.tizersNum[0];

        $scope.info.filters.riaBanner_borderStyle = $rootScope.linesTypes[0];
        $scope.info.filters.riaBanner_borderWidth = 1;
        $scope.info.filters.riaBanner_borderColor = "#ccc";

        $scope.info.filters.riaTizer_marginRight = 5;
        $scope.info.filters.riaTizer_marginBottom = 5;

        $scope.info.filters.riaBanner_width = 120;

        $scope.info.filters.tizers_axis = $scope.axises[0];
        // END


        var link = cobrandLink+"/service/get/filtertypes",
            postInfoLink = bzConfig.api()+"/cm/informer";
        var params = {"json":true, "forDeep":true};


        $scope.$watch("info.option", function() {
            console.log();


            $scope.sendDataReq($scope.returnOptionsLink());
        });
        $scope.$watch("info.subcategory", function() {
            if($scope.info.subcategory == undefined || !$scope.info.subcategory.id) return;

            $scope.getParams({
                projectId:$scope.info.project.id,
                option:+$scope.info.subcategory.id,
                subcategory:+$scope.info.category.id
            }, function(results) {
                $scope.params.options = results;
                $scope.info.option = $scope.params.options[0];

                $scope.sendDataReq($scope.returnOptionsLink());
            });
        });
        $scope.$watch("info.category", function() {
            if($scope.info.category == undefined || !$scope.info.category.id) return;

            $scope.getParams({
                projectId:$scope.info.project.id,
                subcategory:+$scope.info.category.id
            }, function(results) {
                $scope.params.subcategories = results.map(function (item) {
                    return {id:item.subcategory, name:item.name};
                });
                $scope.info.subcategory = $scope.params.subcategories[0];

                $scope.sendDataReq();
            });

        });

        var api = $resource(link, {}, {
                get: {
                    method: "GET",
                    url: link,
                    isArray: true
                },
                post: {
                    method: "POST",
                    url: postInfoLink,
                    isArray: false
                }
            }
        );
        $scope.getParams = function(inputParams, callback) {
            for(var param in params) {
                inputParams[param] = params[param];
            }

            api.get(inputParams, function(resp) {
                callback(resp);
            })
        };



        var insertParams = [], item, items = [];
        $scope.infoSave = function() {
            api.post($scope.info, function(resp) {
                if(resp.code != 200) {
                    alertify.error("Ошибка генерирования информера");
                    return;
                }

                //localStorageService.set("currentInformer_"+$scope.info.project.id, resp.key);
                console.log(resp);
                $scope.informerBlock.toggle();

                var informer = angular.element(
                    "<div id=\"riainfo_"+resp.key+"\"></div>" +
                    "<script type=\"text/javascript\" src=\"http://cobrand.ria.com/js/ria_informer.js?riacode="+resp.key+"\" ></script>"
                );

                //informer = angular.copy(document.getElementsByTagName("infoblock"));
                //$compile(informer);
                angular.element(".trumbowyg-editor").append(informer);
            })
        }

        $scope.checkInfo = function() {

            var horisontal = angular.element(document.getElementById("tizers_horisontal"));
            var vertical = angular.element(document.getElementById("tizers_vertical"));
            var hor = $scope.info.filters.tizers_horisontal.id;
            var vert = $scope.info.filters.tizers_vertical.id;
            var width = $scope.info.filters.riaBanner_width;


            //var margin = angular.element(document.getElementById("tizer_marginRight"));
            var margin = $scope.info.filters.riaTizer_marginRight;
            document.getElementById("riaTizer_marginRight").value = margin;
            var calcMargin = (+hor-1)*(+margin);

            if (isNaN(calcMargin)) calcMargin = 0;
            var logoLeftWidth = 0;

            var calcWidth = (width-calcMargin)/hor;

            var projectsWithReversedLogo = [1, 2, 3, 4, 5,6];
            $scope.styles[".riaContainer"] = [];

            $scope.relocateLogo = function() {
                var wights = {1:62,2:24,3:58,4:24,5:73,6:58};
                var widths = {
                    1:wights[$scope.project],2:20
                };
                $scope.styles[".riaLogo img"] = [];
                var calculatedTizerWidth = widths[$scope.info.filters.tizers_axis.id];
                //calculatedTizerWidth = (calculatedTizerWidth / 1.7) < 80 ? 80 : (calculatedTizerWidth / 1.7);
                //$scope.styles[".riaLogo img"]["width"] = calculatedTizerWidth + "px";
                if ($scope.info.filters.tizers_axis.id==2) {
                    calcWidth = calcWidth - ((widths[$scope.info.filters.tizers_axis.id]+10)/+hor);
                    $scope.styles[".riaContainer"]["margin-left"] = (widths[$scope.info.filters.tizers_axis.id]+10)+"px";
                    logoLeftWidth = (widths[$scope.info.filters.tizers_axis.id]+10);

                } else {
                    $scope.styles[".riaLogo img"]["width"] = calculatedTizerWidth + "px";
                }
            };


            $scope.isAllowedLogoAxis = false;
            // FOR newbuilds and new auto
            if (projectsWithReversedLogo.indexOf(+$scope.info.project.id) != -1) {
                //if ($scope.project == 1 && $scope.category == 1 || $scope.project != 1){

                $scope.isAllowedLogoAxis = true;
                //var axis = $scope.info.filters.tizers_axis.id;
                //$scope.logoAxis = axis[0].options[axis[0].selectedIndex].value;

                $scope.relocateLogo();
                // }
            }

            var projectsWaitoutAddBtn = [5,6];
            var categoriesWaitoutAddBtn = [1,777];

            if ($scope.info.project.id == 1 && categoriesWaitoutAddBtn.indexOf($scope.info.category.id) != -1 || projectsWaitoutAddBtn.indexOf($scope.info.project.id) != -1) {
                $scope.hideAddBtn = true;
            }


            // END


            $scope.styles[".riaTizer"]["width"] = calcWidth+"px";
            //document.getElementById("riaTizer_width").value = calcWidth;
            document.getElementById("tizerWidthId").value = calcWidth;

            if (calcWidth <= $scope.minWidth) {
                var withMarginWidth = ($scope.minWidth*hor)+calcMargin+logoLeftWidth;

                document.getElementById("riaBanner_width").value = withMarginWidth;
                //$scope.splitData("riaBanner_width", withMarginWidth);
                $scope.styles[".riaBanner"]["width"] = withMarginWidth+"px";
                $scope.styles[".riaTizer"]["width"] = $scope.minWidth+"px";

            }

            if (+hor>1) {
                for(var i=0;i<hor*vert;i++) {
                    $scope.styles[".riaViewBanner .riaTizer:nth-child("+i+"n)"] = [];
                }

                if (calcMargin>0) {
                    if (!$scope.styles[".riaViewBanner .riaTizer:nth-child("+hor+"n)"]) {
                        $scope.styles[".riaViewBanner .riaTizer:nth-child("+hor+"n)"] = [];
                    }
                    $scope.styles[".riaViewBanner .riaTizer:nth-child("+hor+"n)"]["margin-right"] = "0";
                }

                if (calcWidth > 200) {

                    var withMarginNewWidth = (200*hor)+calcMargin+logoLeftWidth;
                    var widthdiff = +width - withMarginNewWidth;
                    $scope.styles[".riaViewBanner .riaTizer:nth-child("+hor+"n)"]["margin-right"] = widthdiff+"px";
                }

            }

            // CENTER tizers
            if (calcWidth > 200) {
                var substr = (2/+hor);
                var substrWidth = (calcWidth-200)/substr;

                if (substrWidth > 0) {
                    if ($scope.styles[".riaViewBanner"] == undefined) {
                        $scope.styles[".riaViewBanner"] = [];
                    }
                    $scope.styles[".riaViewBanner"]["padding-left"] = substrWidth + "px";
                }
            } else {
                if ($scope.styles[".riaViewBanner"] == undefined) {
                    $scope.styles[".riaViewBanner"] = [];
                }

                $scope.styles[".riaViewBanner"]["padding-left"] =  0;
            }
            //END


            if (hor == 1) {
                $scope.styles[".riaViewBanner .riaTizer:nth-child("+hor+"n)"] = [];
                $scope.styles[".riaViewBanner .riaTizer:nth-child("+hor+"n)"]["float"] = "none";
            }
            //$scope.setStyles();
            $scope.reload = true;
            $scope.toDisplay = hor*vert;

        }


        $scope.sendDataReq = function(updateLink) {

            var projects = ["auto","ria","dom", "ria", "market", "dom"];
            $scope.projectName = projects[$scope.info.project.id-1];
            $scope.logoAxis = 1;
            $scope.logos = {
                1:$scope.projectName+"_ria.jpg",
                2:$scope.projectName+"_ria_vert.png"
            };


            $scope.lessItems = null;

            var categories = "";
            if(updateLink != undefined) {
                categories = updateLink;
            }
            //var categories = document.getElementById("categories").value;

            if ($scope.info.project != undefined && $scope.info.category != undefined) {
                $scope.$loading = true;

                var categoryLinkAttr = "&category="+$scope.info.category.id;
                if($scope.info.project.id == 5) {
                    categoryLinkAttr = "&categories["+$scope.info.category.id+"]=1"
                }

                var link = cobrandLink+"/service/get/adverts?project=" + $scope.info.project.id + categoryLinkAttr + "&limit=50" + categories;
                var Adverts = $resource(link, {}, {
                    get: {
                        method: "GET",
                        url: link,
                        isArray: false
                    }
                });
                var response = Adverts.get(function(res) {
                    $scope.$loading = false;
                    $scope.informers = res.data.results;
                });
                //$scope.margr = document.getElementById("riaTizer_marginRight").value;

            }
        }


        $scope.returnOptionsLink = function() {
            var linkToReturn = "";
            if($scope.info.subcategory.id) {
                linkToReturn += "&subcategory="+$scope.info.subcategory.id;
            }
            switch($scope.info.project.id) {
                case 1:
                    break;
                case 2:
                    //if($scope.info.option.value != undefined) {
                    if($scope.info.option.id) {
                        linkToReturn += "&options[0][" + $scope.info.option.value + "]=" + $scope.info.option.id;
                    }
                    //}
                    break;
                case 3:
                    if($scope.info.option.id) {
                        linkToReturn += "&options[]="+$scope.info.option.id;
                    }
                    break;
                case 5:
                    linkToReturn = "";

                    console.log($scope.info.option);
                    if($scope.info.option.id) {
                        linkToReturn += "&option[" + $scope.info.subcategory.id + "]="+$scope.info.option.id;
                    }
                    break;
            }

            return linkToReturn;
        }

    }]);

});