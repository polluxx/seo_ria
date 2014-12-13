define([
    'modules/view/robots/module',

    'modules/view/robots/controllers/ViewRobotsCtrl',
    'modules/view/robots/factories/RobotsFactory'
], function (module) {
    'use strict';

    module.config(['$routeSegmentProvider', 'bzConfigProvider', 'bzUserProvider',
        function($routeSegmentProvider, bzConfigProvider, bzUserProvider) {
            $routeSegmentProvider
                .when('/robots/:id', 'robots')
                .segment('robots', {
                    templateUrl: bzConfigProvider.templateUrl('/robots.html'),
                    resolve: {
                        //permissions: bzUserProvider.access()
                    },
                    controller: 'ViewRobotsCtrl',
                    resolveFailed: bzConfigProvider.errorResolver()
                });
    }]);
    return module;

});