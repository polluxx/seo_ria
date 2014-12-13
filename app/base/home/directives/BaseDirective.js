define(['base/home/module'], function (module) {

    module.directive('rootItem', function($rootScope, localStorageService) {
        return {
            restrict:"A",
            link: function(scope, element, attrs) {
                $rootScope.currentProject = localStorageService.get("currentProject");
            }
        }
    });

    module.directive('changeble', function() {
        return {
            restrict:"A",
            scope:{
                changeble:"&"
            },
            link: function(scope, element, attrs) {
                element.on("change", function() {
                    scope.changeble();
                })
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
                            scope.lang.$error++;
                            element.parent().addClass("has-error");
                            element.parent().removeClass("has-success");
                        } else {

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

});