define([
    'modules/view/main/module'
], function (module) {
    'use strict';

    module.controller('ViewMainCtrl', ['$scope', '$routeParams', 'ViewFactory', '$rootScope', 'localStorageService', function($scope, $routeParams, ViewFactory, $rootScope, localStorageService) {
        var variablesBlock,
            width;



        $scope.langs = [{"id":1, "name":"ru"}, {"id":2, "name":"uk"}];
        $scope.selectedLang = $scope.langs[0];
        $scope.variables = [{"id":1, "name":"Категорії"}, {"id":2, "name":"Типи"}, {"id":3, "name":"Регіон"}];
        $scope.dataCanSave = false;
        $scope.validate = false;

        $scope.langSelect = function(langID) {
            $scope.selectedLang = langID;
        }

        $scope.$watch("selectedLang", function() {
            console.log($scope.selectedLang)
        })

        $scope.slideIn = function(langId) {
            variablesBlock = angular.element(document.getElementById("view-variables-"+langId.id));
            width = variablesBlock[0].offsetWidth;
            variablesBlock.css("left","-"+width+"px");
        }

        $scope.slideOut = function(langId) {
            variablesBlock = angular.element(document.getElementById("view-variables-"+langId.id));
            variablesBlock.css("left","0px");
        }

        $scope.selectVars = function(variable) {
            console.log(variable);
        }

        $scope.checkData = function() {
            $scope.dataCanSave = true;
            $scope.validate = false;
            $scope.$apply();
        }

        $scope.saveData = function() {
            $scope.dataCanSave = false;
            $scope.validate = true;
        }


    }]);

});