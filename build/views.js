angular.module('views', []).run(['$templateCache', function($templateCache) {
  $templateCache.put("/views/home.html",
    "Welcome");
  $templateCache.put("/views/page.html",
    "<div class=projectChoose><div class=projectBlock ng-repeat=\"project in projects\" ng-click=choose(project.id)><div class=infoboxData><span class=title>{{project.name}}</span></div><img src=\"/assets/img/logos/{{project.slang}}-logo.png\"></div></div>");
}]);
