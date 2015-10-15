define(['base/home/module'], function (module) {

    module.controller('BaseHomeCtrl', ['$scope', '$location', 'bzUser', '$rootScope', '$templateCache', function ($scope, $location, bzUser, $rootScope, $templateCache) {
        if(!bzUser.is_guest) {
            $rootScope.$watch("links", function() {
                if ($rootScope.links == undefined) return;

                var url = ($rootScope.links[0] == undefined) ? "" : $rootScope.links[0].url || $rootScope.links[0].content[0].url, redirect = url || "";
                $location.path("/" + redirect);
            });
        }

    }]);

});