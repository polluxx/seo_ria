define([
    'base/home/module',

    'base/home/controllers/BaseHomeCtrl',
    'base/home/directives/BaseDirective',
    'base/home/filters/BaseFilters'
], function (module) {
    'use strict';

    module.config(['$routeSegmentProvider', 'bzConfigProvider', 'bzUserProvider',
        function($routeSegmentProvider, bzConfigProvider, bzUserProvider) {
            $routeSegmentProvider
                .when('/home', 'home')

                .segment('home', {
                    redirectTo: "/page",
                    templateUrl: bzConfigProvider.templateUrl('/home.html'),
                    resolve: {
                        permissions: bzUserProvider.access()
                    },
                    controller: 'BaseHomeCtrl',
                    resolveFailed: bzConfigProvider.errorResolver()
                });
    }]);
    return module;

});