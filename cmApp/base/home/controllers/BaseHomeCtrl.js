define(['base/home/module'], function (module) {

    module.controller('BaseHomeCtrl', ['$scope', '$location', 'bzUser', function ($scope, $location, bzUser) {
        if(!bzUser.is_guest) {
            $location.path("/calendar");
        }
    }]);

});